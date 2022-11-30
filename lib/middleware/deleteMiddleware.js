const { Review } = require('../models/Review');

module.exports = async (req, res, next) => {
  const review = Review.getById(req.params.id);
  try {
    if (
      review &&
      (req.user.id !== review.user_id || req.user.email === 'admin')
    ) {
      next();
    } else {
      throw new Error('Not Allowed to Perform Command');
    }
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
