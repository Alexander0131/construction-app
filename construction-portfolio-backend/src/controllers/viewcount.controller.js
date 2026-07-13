const ViewCount = require("../models/ViewCount");

// Increments (and lazily creates) the counter for a page in one atomic op.
exports.editCount = async (req, res, next) => {
  try {
    const { pageId } = req.body;

    if (!pageId) {
      return res.status(400).json({ success: false, message: "pageId is required" });
    }

    const updated = await ViewCount.findOneAndUpdate(
      { pageId },
      {
        $inc: { visitcount: 1 },
        $setOnInsert: {
          pageName: pageId.charAt(0).toUpperCase() + pageId.slice(1),
          subpage: [],
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    res.status(200).json({ success: true, message: "View count updated", data: updated });
  } catch (error) {
    next(error);
  }
};

exports.getAllViews = async (req, res, next) => {
  try {
    const data = await ViewCount.find();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
