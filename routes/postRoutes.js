const express = require('express');
const { getPosts, getPostById, createPost, deletePost } = require('../controllers/postController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getPosts).post(protect, admin, createPost);
router.route('/:id').get(getPostById).delete(protect, admin, deletePost);

module.exports = router;
