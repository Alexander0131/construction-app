const Config = require("../models/Config");

exports.createConfig = async (req, res, next) => {
  try {
    const config = await Config.create(req.body);
    res.status(201).json({ success: true, message: "Config created", data: config });
  } catch (error) {
    next(error);
  }
};

exports.editConfig = async (req, res, next) => {
  try {
    const updatedConfig = await Config.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedConfig) {
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    res.status(200).json({ success: true, message: "Config updated", data: updatedConfig });
  } catch (error) {
    next(error);
  }
};

exports.getConfig = async (req, res, next) => {
  try {
    const config = await Config.findOne({ post: req.params.item });

    if (!config) {
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    res.status(200).json({ success: true, data: config });
  } catch (error) {
    next(error);
  }
};
