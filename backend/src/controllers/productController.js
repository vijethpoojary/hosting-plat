const Product = require('../models/Product');
const ContactLog = require('../models/ContactLog');
const ViewLog = require('../models/ViewLog');
const Image = require('../models/Image');
const { cloudinary, useCloudinary } = require('../config/cloudinary');
const APIFeatures = require('../utils/apiFeatures');

// ── Helper: save uploaded files and return images array ─────────────
const saveImages = async (files) => {
  if (!files || files.length === 0) return [];

  if (useCloudinary) {
    // Cloudinary: file.path = CDN url, file.filename = public_id
    return files.map((file) => ({ url: file.path, publicId: file.filename }));
  } else {
    // MongoDB: store base64, return a /api/images/:id URL
    const saved = await Promise.all(
      files.map((file) =>
        Image.create({
          data: file.buffer.toString('base64'),
          contentType: file.mimetype,
          originalName: file.originalname,
        })
      )
    );
    return saved.map((img) => ({ url: `/api/images/${img._id}`, publicId: img._id.toString() }));
  }
};

// ── Helper: delete images ────────────────────────────────────────────
const deleteImages = async (images) => {
  if (!images || images.length === 0) return;
  if (useCloudinary) {
    for (const img of images) {
      if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }
  } else {
    for (const img of images) {
      if (img.publicId) await Image.findByIdAndDelete(img.publicId).catch(() => {});
    }
  }
};

// GET /api/products — public, paginated, filterable
const getProducts = async (req, res, next) => {
  try {
    const baseQuery = Product.find({ isActive: true }).populate('owner', 'name averageRating totalRatings');

    const features = new APIFeatures(baseQuery, req.query)
      .filter()
      .search(['title', 'description', 'location'])
      .sort()
      .paginate();

    if (req.query.category && req.query.category !== 'all') {
      features.query = features.query.where('category').equals(req.query.category);
    }

    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
      features.query = features.query.where('price').equals(priceFilter);
    }

    const products = await features.query;
    const total = await Product.countDocuments({ isActive: true });

    res.json({
      success: true,
      count: products.length,
      total,
      page: features.page,
      pages: Math.ceil(total / features.limit),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id — public, increments view count
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate(
      'owner',
      'name averageRating totalRatings phone'
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    const alreadyViewed = await ViewLog.findOne({ ipAddress: ip, product: product._id });

    if (!alreadyViewed) {
      await ViewLog.create({ ipAddress: ip, product: product._id });
      await Product.findByIdAndUpdate(product._id, { $inc: { viewsCount: 1 } });
      product.viewsCount += 1;
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// POST /api/products/:id/contact — public, logs contact click
const logContact = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentClicks = await ContactLog.countDocuments({
      ipAddress: ip,
      product: product._id,
      createdAt: { $gte: oneHourAgo },
    });

    if (recentClicks >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many contact attempts. Please wait before trying again.',
      });
    }

    await ContactLog.create({
      ipAddress: ip,
      userAgent,
      product: product._id,
      owner: product.owner,
      user: req.user?._id || null,
    });

    await Product.findByIdAndUpdate(product._id, { $inc: { contactCount: 1 } });

    const message = encodeURIComponent(`Hi, I'm interested in ${product.title}`);
    const whatsappUrl = `https://wa.me/${product.whatsappNumber.replace(/\D/g, '')}?text=${message}`;

    res.json({ success: true, whatsappUrl });
  } catch (error) {
    next(error);
  }
};

// POST /api/products — owner only
const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, price, priceUnit, whatsappNumber, location } = req.body;
    const images = await saveImages(req.files);

    const product = await Product.create({
      title, description, category,
      price: Number(price), priceUnit,
      images, owner: req.user._id,
      whatsappNumber, location,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id — owner only
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }

    const { title, description, category, price, priceUnit, whatsappNumber, location, isActive } = req.body;

    let images = product.images;
    if (req.files && req.files.length > 0) {
      await deleteImages(product.images);
      images = await saveImages(req.files);
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, category, price: Number(price), priceUnit, whatsappNumber, location, images, isActive },
      { new: true, runValidators: true }
    );

    res.json({ success: true, product: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id — owner or admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await deleteImages(product.images);
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/owner/dashboard
const getOwnerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ owner: req.user._id }).sort('-createdAt');
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, logContact, createProduct, updateProduct, deleteProduct, getOwnerProducts };
