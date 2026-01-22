const Asset = require('../models/Asset');
const Studio = require('../models/Studio');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const upload = require('../config/multer');

exports.getAssets = async (req, res) => {
  const studio = await Studio.findOne();
  const assets = await Asset.find({ studio: studio ? studio._id : null });
  res.render('assets', { assets });
};

exports.postUpload = [
  upload.single('asset'),
  async (req, res) => {
    if (!req.file) return res.redirect('/assets');

    const studio = await Studio.findOne();
    const type = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    const originalPath = req.file.path;
    let optimizedPath = originalPath;

    if (type === 'image') {
      const optDir = 'uploads/optimized';
      if (!fs.existsSync(optDir)) {
        fs.mkdirSync(optDir, { recursive: true });
      }
      optimizedPath = path.join(optDir, req.file.filename);
      await sharp(originalPath)
        .resize(800)
        .jpeg({ quality: 80 })
        .toFile(optimizedPath);
    }

    await Asset.create({
      type,
      originalPath,
      optimizedPath,
      studio: studio ? studio._id : null,
    });

    res.redirect('/assets');
  }
];

exports.deleteAsset = async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (asset) {
    if (fs.existsSync(asset.originalPath)) {
      fs.unlinkSync(asset.originalPath);
    }
    if (asset.optimizedPath && fs.existsSync(asset.optimizedPath)) {
      fs.unlinkSync(asset.optimizedPath);
    }
    await asset.deleteOne();
  }
  res.redirect('/assets');
};