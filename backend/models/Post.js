import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  date: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: String,
  text: String,
  image: String, // Cloudinary URL
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);