import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  Link,
} from 'react-router-dom';
import { Heart, MessageCircle, User, LogOut, Home, PlusCircle, Camera, X } from 'lucide-react';

// Mock API
const API_BASE = 'https://be-social-backend.onrender.com/api';

// Simple Storage Helper
const storage = {
  setUser: (userId, username) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  },
  getUser: () => ({
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
  }),
  clearUser: () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },
  isLoggedIn: () => !!localStorage.getItem('userId'),
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  return storage.isLoggedIn() ? children : <Navigate to="/login" replace />;
};

// Public Route
const PublicRoute = ({ children }) => {
  return storage.isLoggedIn() ? <Navigate to="/home" replace /> : children;
};

// Modal Component
const Modal = ({ show, onClose, children }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

// ==================== SIGNUP PAGE ====================
const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', name: '', dob: '', gender: '', phone: '', email: '', password: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-peach-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-purple-600 mb-2 text-center">Join BeSocial</h1>
          <p className="text-gray-500 text-center mb-6">Create your account</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input name="username" placeholder="Username" value={form.username} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400" required />
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-purple-400" required />
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-purple-400" required />
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-purple-400" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-purple-400" required />
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-purple-400" required />
            <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-purple-400" required />

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          <p className="text-center mt-4 text-gray-600">
            Already have an account? <button onClick={() => navigate('/login')} className="text-purple-600 font-semibold">Login</button>
          </p>
        </div>

        <Modal show={showSuccess} onClose={() => { setShowSuccess(false); navigate('/login'); }}>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">Check</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600 mb-6">Your account has been created</p>
            <button onClick={() => navigate('/login')} className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600">
              Go to Login
            </button>
          </div>
        </Modal>
      </div>
    </PublicRoute>
  );
};

// ==================== LOGIN PAGE ====================
const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      storage.setUser(data.userId, data.username);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-peach-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-purple-600 mb-2 text-center">Welcome Back</h1>
          <p className="text-gray-500 text-center mb-6">Login to BeSocial</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>
          )}

          <div className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-purple-400" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-purple-400" />

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <p className="text-center mt-4 text-gray-600">
            Don't have an account? <button onClick={() => navigate('/signup')} className="text-purple-600 font-semibold">Sign Up</button>
          </p>
        </div>
      </div>
    </PublicRoute>
  );
};

// ==================== LAYOUT WITH NAV (for authenticated pages) ====================
const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { username } = storage.getUser();

  const handleLogout = () => {
    storage.clearUser();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-peach-50">
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-600 cursor-pointer" onClick={() => navigate('/home')}>
            BeSocial
          </h1>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/home')} className="text-gray-600 hover:text-purple-600"><Home size={24} /></button>
            <button onClick={() => navigate('/create')} className="text-gray-600 hover:text-purple-600"><PlusCircle size={24} /></button>
            <button onClick={() => navigate('/profile')} className="text-gray-600 hover:text-purple-600"><User size={24} /></button>
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600"><LogOut size={24} /></button>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

// HomePage.jsx – WITH PAGINATION + LOAD MORE
const HomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { username } = storage.getUser();

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = async (pageNum) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`${API_BASE}/posts?page=${pageNum}&limit=10`);
      const data = await res.json();

      if (pageNum === 1) {
        setPosts(data.posts || []);
      } else {
        setPosts(prev => [...prev, ...(data.posts || [])]);
      }

      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Fetch posts error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    fetchPosts(page + 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-5 shadow-md mb-6">
          <p className="text-lg">
            😊Welcome, <span className="font-bold text-purple-600">@{username}</span>! ❤️❤️
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-md">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {posts.map(post => (
                <div
                  key={post._id}
                  onClick={() => navigate(`/post/${post._id}`)}
                  className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">@{post.username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {post.image && (
                    <img src={post.image} alt="post" className="w-full h-80 object-cover" />
                  )}

                  <div className="p-5">
                    <p className="text-gray-800 text-lg mb-4 leading-relaxed">{post.text}</p>
                    <div className="flex items-center gap-8 text-gray-600">
                      <Heart size={22} className="text-red-500" /> {post.likes || 0}
                      <MessageCircle size={22} /> {post.comments?.length || 0}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Loading more...' : 'Load More Posts'}
                </button>
              </div>
            )}

            {!hasMore && posts.length > 10 && (
              <p className="text-center text-gray-500 mt-8 text-lg">
                You've seen all posts!
              </p>
            )}
          </>
        )}
      </Layout>
    </ProtectedRoute>
  );
};
// ==================== CREATE POST PAGE ====================
const CreatePostPage = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { userId, username } = storage.getUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return setError('Please write something');

    setLoading(true);
    try {
      const payload = { text, userId, username, image: preview };
      const res = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) navigate('/home');
      else {
        const err = await res.json();
        setError(err.error || 'Failed to post');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <button onClick={() => navigate('/home')} className="text-purple-600 font-semibold mb-4">Back</button>
        <div className="bg-white rounded-2xl shadow-md p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4">{error}</div>}

          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="5"
            className="w-full p-4 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none resize-none"
          />

          <div className="my-4">
            <label className="flex items-center gap-2 cursor-pointer text-purple-600">
              <Camera size={20} /> Add Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {preview && (
            <div className="relative inline-block mb-4">
              <img src={preview} alt="preview" className="max-h-96 rounded-xl" />
              <button onClick={() => { setImage(null); setPreview(null); }} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full">
                <X size={16} />
              </button>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

// ==================== POST DETAIL PAGE ====================
const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const { username } = storage.getUser();

  useEffect(() => {
    fetch(`${API_BASE}/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    const res = await fetch(`${API_BASE}/posts/${id}/like`, { method: 'POST' });
    if (res.ok) {
      const updated = await res.json();
      setPost(updated);
      setLiked(!liked);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    const res = await fetch(`${API_BASE}/posts/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: username, text: comment })
    });
    if (res.ok) {
      const updated = await res.json();
      setPost(updated);
      setComment('');
    }
  };

  if (loading) return <div className="text-center py-20 text-purple-600">Loading...</div>;

  if (!post) return <div className="text-center py-20 text-red-600">Post not found</div>;

  return (
    <ProtectedRoute>
      <Layout>
        <button onClick={() => navigate('/home')} className="text-purple-600 font-semibold mb-4">Back to Home</button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
<div className="p-6 flex items-center gap-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-t-3xl">
  <div className="relative">
    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
      <User size={40} className="text-white" strokeWidth={2.5} />
    </div>
  </div>
  <div>
    <h2 className="text-2xl font-bold text-gray-800">@{post.username}</h2>
    <p className="text-gray-600">
      {new Date(post.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </p>
  </div>
</div>

          <div className="p-4">
            <p className="text-lg mb-4">{post.text}</p>
            {post.image && <img src={post.image} alt="post" className="w-full max-h-screen object-contain rounded-xl" />}
          </div>

          <div className="px-6 py-3 flex gap-8 border-t border-b">
            <button onClick={handleLike} className={`flex items-center gap-2 ${liked ? 'text-red-500' : 'text-gray-600'}`}>
              <Heart size={22} fill={liked ? 'currentColor' : 'none'} /> {post.likes || 0}
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle size={22} /> {post.comments?.length || 0}
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <button onClick={handleComment} className="bg-purple-500 text-white px-6 rounded-xl">Post</button>
            </div>

            <div className="space-y-4">
              {post.comments?.map((c, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold">@{c.user}</p>
                  <p>{c.text}</p>
                </div>
              ))}
              {(!post.comments || post.comments.length === 0) && (
                <p className="text-gray-500 text-center py-8">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

// ==================== PROFILE PAGE (Fixed Avatar) ====================
const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId, username } = storage.getUser();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          fetch(`${API_BASE}/users/${userId}`).then(r => r.json()),
          fetch(`${API_BASE}/posts`).then(r => r.json())
        ]);
        setUser(userRes);
        setForm({ name: userRes.name || '', email: userRes.email || '', phone: userRes.phone || '' });
        setUserPosts(Array.isArray(postsRes) ? postsRes.filter(p => p.userId === userId) : []);
      } catch (e) { /* silent */ } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleSave = async () => {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const updated = await res.json();
      setUser(updated);
      setEditing(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-purple-600">Loading profile...</div>;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-6 mb-8">
            {/* Fixed Avatar – Perfectly Centered */}
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <User size={56} className="text-white" strokeWidth={2} />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800">@{username}</h2>
              <p className="text-xl text-gray-600 mt-1">{user?.name || 'No name set'}</p>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 text-lg">
            <div>
              <span className="text-gray-600">Name:</span>{' '}
              <span className="font-medium">{user?.name || '—'}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>{' '}
              <span className="font-medium">{user?.email || '—'}</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>{' '}
              <span className="font-medium">{user?.phone || '—'}</span>
            </div>
          </div>

          {/* Edit Button */}
          {editing ? (
            <div className="mt-8 space-y-4">
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <div className="flex gap-3">
                <button onClick={handleSave} className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600">
                  Save Changes
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl text-xl font-bold hover:shadow-xl transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* My Posts Section (unchanged) */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">My Posts ({userPosts.length})</h2>
          {userPosts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No posts yet. <Link to="/create" className="text-purple-600 font-semibold">Create your first one!</Link>
            </p>
          ) : (
            <div className="grid gap-4">
              {userPosts.map(p => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/post/${p._id}`)}
                  className="border rounded-xl p-5 cursor-pointer hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-500 mb-2">{new Date(p.timestamp).toLocaleDateString()}</p>
                  <p className="font-medium text-gray-800 mb-3">{p.text}</p>
                  {p.image && <img src={p.image} alt="post" className="rounded-lg max-h-64 object-cover w-full" />}
                  </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

// ==================== MAIN APP ====================
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
