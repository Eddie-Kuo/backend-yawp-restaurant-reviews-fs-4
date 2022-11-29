const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
// const authorize = require('../middleware/authorize');
const deleteMiddleware = require('../middleware/deleteMiddleware');
const { Review } = require('../models/Review');

module.exports = Router().delete(
  '/:id',
  [authenticate, deleteMiddleware],
  // authenticate needs to come first before authorization
  // also don't name things 'delete'
  async (req, res, next) => {
    try {
      const review = await Review.delete(req.params.id);
      if (!review) next();
      res.status(204);
      res.send();
    } catch (e) {
      next(e);
    }
  }
);
