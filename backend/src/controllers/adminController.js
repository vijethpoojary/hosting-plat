const User = require('../models/User');
const Product = require('../models/Product');
const ContactLog = require('../models/ContactLog');
const Rating = require('../models/Rating');

// GET /api/admin/stats — dashboard analytics
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOwners, totalProducts, totalContacts] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      User.countDocuments({ role: 'OWNER' }),
      Product.countDocuments({ isActive: true }),
      ContactLog.countDocuments(),
    ]);

    // Most viewed products
    const mostViewed = await Product.find({ isActive: true })
      .sort('-viewsCount')
      .limit(5)
      .populate('owner', 'name')
      .select('title viewsCount contactCount category');

    // Most contacted products
    const mostContacted = await Product.find({ isActive: true })
      .sort('-contactCount')
      .limit(5)
      .populate('owner', 'name')
      .select('title viewsCount contactCount category');

    // Contact logs over last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentContacts = await ContactLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOwners,
        totalProducts,
        totalContacts,
        mostViewed,
        mostContacted,
        recentContacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users — all users
const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await User.find().sort('-createdAt').skip(skip).limit(limit);
    const total = await User.countDocuments();

    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin accounts' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/products — all products
const getAllProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate('owner', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments();

    res.json({ success: true, products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/contacts — all contact logs
const getContactLogs = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 50;
    const skip = (page - 1) * limit;

    const logs = await ContactLog.find()
      .populate('product', 'title')
      .populate('owner', 'name')
      .populate('user', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await ContactLog.countDocuments();

    res.json({ success: true, logs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getUsers, deleteUser, getAllProducts, getContactLogs };
