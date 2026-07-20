const cloudinary = require("../config/cloudinary");
const Project = require("../models/Projects");
// const { nanoid } = require("nanoid");


const TEXT_FIELDS = [
  "projectTitle",
  "description",
  "contentTitle",
  "contentTitleTwo",
  "content",
  "quote",
  "contentTwo",
  "state",
];

async function uploadImages(files, folder) {
  if (!files) return [];
  const list = Array.isArray(files) ? files : [files];
  return Promise.all(
    list.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.tempFilePath, { folder });
      return { url: result.secure_url, public_id: result.public_id };
    })
  );
}

exports.getProjects = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [projects, totalProjects] = await Promise.all([
      Project.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Project.countDocuments(),
    ]);

    res.status(200).json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      hasMore: page * limit < totalProjects,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleProjects = async (req, res, next) => {
  try {
    const project = await Project.findOne({ projectId: req.params.id });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { title, contentTitle, content, contentTitleTwo, contentTwo, description, state, quote } = req.body;

    if (!title || !contentTitle || !content || !description || !state) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const uploadedImages = await uploadImages(req.files?.images, "construction-projects");

    const project = await Project.create({
      projectTitle: title,
      projectId: `project-${nanoid(10)}`,
      description,
      contentTitle,
      contentTitleTwo,
      quote,
      content,
      contentTwo,
      state,
      images: uploadedImages,
    });

    res.status(201).json({ success: true, message: "Project created successfully", project });
  } catch (error) {
    next(error);
  }
};

// Mirrors post.controller's updatePost: partial text-field updates plus an
// ordered imagePlan that rebuilds project.images.
exports.updateProject = async (req, res, next) => {
  const uploadedPublicIds = [];

  try {
    const project = await Project.findOne({ projectId: req.params.projectId });

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    TEXT_FIELDS.forEach((field) => {
      if (typeof req.body[field] === "string") {
        project[field] = req.body[field];
      }
    });

    const uploadedImages = await uploadImages(req.files?.newImages, "construction-projects");
    uploadedPublicIds.push(...uploadedImages.map((img) => img.public_id));

    let finalImages = project.images;

    if (req.body.imagePlan) {
      const plan = JSON.parse(req.body.imagePlan);
      const existingByPublicId = new Map(project.images.map((img) => [img.public_id, img]));

      finalImages = plan.map((item) => {
        if (item.type === "existing") {
          const match = existingByPublicId.get(item.public_id);
          if (!match) throw new Error(`imagePlan referenced unknown public_id: ${item.public_id}`);
          return match;
        }
        const uploaded = uploadedImages[item.fileIndex];
        if (!uploaded) throw new Error(`imagePlan referenced missing new file at index ${item.fileIndex}`);
        return uploaded;
      });
    }

    const keptPublicIds = new Set(finalImages.map((img) => img.public_id));
    const removedImages = project.images.filter((img) => !keptPublicIds.has(img.public_id));

    project.images = finalImages;
    await project.save();

    await Promise.all(
      removedImages.map((img) =>
        cloudinary.uploader.destroy(img.public_id).catch((err) => {
          console.error(`Failed to delete old image ${img.public_id}:`, err.message);
        })
      )
    );

    res.status(200).json({ success: true, message: "Project updated successfully", project });
  } catch (error) {
    await Promise.all(uploadedPublicIds.map((id) => cloudinary.uploader.destroy(id).catch(() => {})));
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    await Promise.all(project.images.map((image) => cloudinary.uploader.destroy(image.public_id)));
    await project.deleteOne();

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};
