// // routes/posts.js  ← FINAL WORKING VERSION
// import express from 'express';
// import Post from '../models/Post.js';
// import cloudinary from '../config/cloudinary.js';

// const router = express.Router();

// // Create Post
// router.post('/posts', async (req, res) => {
//   try {
//     const { text, userId, username, image } = req.body;
//     let imageUrl = null;

//     if (image && image.startsWith('data:')) {
//       const result = await cloudinary.uploader.upload(image, {
//         folder: 'besocial',
//         resource_type: 'image',
//       });
//       imageUrl = result.secure_url;
//     }

//     const post = new Post({
//       userId,
//       username,
//       text,
//       image: imageUrl,
//     });

//     await post.save();
//     res.status(201).json(post);
//   } catch (err) {
//     console.error('Create post error:', err);
//     res.status(500).json({ error: 'Failed to create post' });
//   }
// });

// // Get All Posts
// router.get('/posts', async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ timestamp: -1 });
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Get Single Post
// router.get('/posts/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Like Post
// router.post('/posts/:id/like', async (req, res) => {
//   try {
//     const post = await Post.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { likes: 1 } },
//       { new: true }
//     );
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Add Comment
// router.post('/posts/:id/comment', async (req, res) => {
//   try {
//     const { user, text } = req.body;
//     const post = await Post.findByIdAndUpdate(
//       req.params.id,
//       { $push: { comments: { user, text } } },
//       { new: true }
//     );
//     if (!post) return res.status(404).json({ error: 'Post not found' });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// export default router;


// routes/posts.js  ← FINAL WITH PAGINATION
import express from 'express';
import Post from '../models/Post.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Create Post (unchanged)
router.post('/posts', async (req, res) => {
  try {
    const { text, userId, username, image } = req.body;
    let imageUrl = null;

    if (image && image.startsWith('data:')) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'besocial',
        resource_type: 'image',
      });
      imageUrl = result.secure_url;
    }

    const post = new Post({
      userId,
      username,
      text,
      image: imageUrl,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get Posts with Pagination ← UPDATED
router.get('/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: posts.length === limit // true if there are more posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Other routes unchanged...
router.get('/posts/:id', async (req, res) => { try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }});
router.post('/posts/:id/like', async (req, res) => { try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  } 
});
router.post('/posts/:id/comment', async (req, res) => { try {
    const { user, text } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user, text } } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  } 
});

export default router;