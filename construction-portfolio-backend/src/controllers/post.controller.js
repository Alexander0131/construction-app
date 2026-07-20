const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");
// const { nanoid } = require("nanoid");
const crypto = require("crypto");

const TEXT_FIELDS = [
  "postTitle",
  "description",
  "contentTitle",
  "contentTitleTwo",
  "content",
  "quote",
  "contentTwo",
];

async function uploadImages(files, folder) {
  if (!files) return [];
  const list = Array.isArray(files) ? files : [files];
  const uploaded = await Promise.all(
    list.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.tempFilePath, { folder });
      return { url: result.secure_url, public_id: result.public_id };
    })
  );
  return uploaded;
}

exports.createPost = async (req, res, next) => {
  try {
    const { title, contentTitle, content, contentTitleTwo, contentTwo, description, quote } = req.body;

    if (!title || !contentTitle || !content || !description) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const uploadedImages = await uploadImages(req.files?.images, "construction-posts");


    const post = await Post.create({
      postTitle: title,
      postId: `post-${crypto.randomUUID()}`,
      description,
      contentTitle,
      contentTitleTwo,
      quote,
      content,
      contentTwo,
      images: uploadedImages,
    });

    res.status(201).json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(),
    ]);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: page * limit < totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

exports.getLimitedPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    const query = Post.find().sort({ createdAt: -1 });
    const posts = await (limit ? query.limit(limit) : query);

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ postId: req.params.id });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Updates only the fields the client actually sent, and rebuilds the image
// list from an ordered `imagePlan` so drag/replace/delete stay in sync.
exports.updatePost = async (req, res, next) => {
  const uploadedPublicIds = [];

  try {
    const post = await Post.findOne({ postId: req.params.postId });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    TEXT_FIELDS.forEach((field) => {
      if (typeof req.body[field] === "string") {
        post[field] = req.body[field];
      }
    });

    const uploadedImages = await uploadImages(req.files?.newImages, "construction-posts");
    uploadedPublicIds.push(...uploadedImages.map((img) => img.public_id));

    let finalImages = post.images;

    if (req.body.imagePlan) {
      const plan = JSON.parse(req.body.imagePlan);
      const existingByPublicId = new Map(post.images.map((img) => [img.public_id, img]));

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

    // Only delete replaced/removed images from Cloudinary after the save succeeds,
    // so a failed save never leaves the post pointing at already-deleted images.
    const keptPublicIds = new Set(finalImages.map((img) => img.public_id));
    const removedImages = post.images.filter((img) => !keptPublicIds.has(img.public_id));

    post.images = finalImages;
    await post.save();

    await Promise.all(
      removedImages.map((img) =>
        cloudinary.uploader.destroy(img.public_id).catch((err) => {
          console.error(`Failed to delete old image ${img.public_id}:`, err.message);
        })
      )
    );

    res.status(200).json({ success: true, message: "Post updated successfully", post });
  } catch (error) {
    // Roll back anything uploaded this request that never got attached to the post.
    await Promise.all(uploadedPublicIds.map((id) => cloudinary.uploader.destroy(id).catch(() => {})));
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    await Promise.all(post.images.map((image) => cloudinary.uploader.destroy(image.public_id)));
    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.countPosts = async (req, res, next) => {
  try {
    const now = new Date();
    const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [totalPosts, lastMonthPosts, currentMonthPosts] = await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ createdAt: { $gte: firstDayLastMonth, $lte: lastDayLastMonth } }),
      Post.countDocuments({ createdAt: { $gte: firstDayCurrentMonth } }),
    ]);

    const growthPercentage =
      lastMonthPosts > 0 ? ((currentMonthPosts - lastMonthPosts) / lastMonthPosts) * 100 : 0;

    res.status(200).json({
      success: true,
      totalPosts,
      lastMonthPosts,
      currentMonthPosts,
      growthPercentage: growthPercentage.toFixed(1),
    });
  } catch (error) {
    next(error);
  }
};
