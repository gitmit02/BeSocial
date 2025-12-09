# 🎨 BeSocial - Mini Social Media App

A beginner-friendly social media application built with React, featuring soft pastel colors and a clean, modern design.

## 📋 Features

- ✨ User Signup & Login (Simple localStorage-based auth)
- 🏠 Home Feed with all posts
- ➕ Create posts (text or images)
- ❤️ Like & Comment on posts
- 👤 User Profile with editable fields
- 📱 Mobile-responsive design
- 🎨 Soft pastel color scheme (pink, lavender, peach)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Create a new Vite project**

```bash
npm create vite@latest besocial -- --template react
cd besocial
```

2. **Install dependencies**

```bash
npm install
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Configure Tailwind CSS**

Update `vite.config.js`:

```js
/** import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(),tailwindcss()],
})
```

4. **Update `src/index.css`**

```css
@import "tailwindcss";

//remain it empty
```

5. **Replace `src/App.jsx`**

Copy the complete React component code from the artifact into `src/App.jsx`

6. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser!

## 📁 Project Structure

```
besocial/
├── src/
│   ├── App.jsx          # Main application component
│   ├── index.css        # Tailwind CSS imports
│   └── main.jsx         # React entry point
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## 🔐 Default Login Credentials

- **Username:** demo
- **Password:** demo123

## 🎯 How to Use

### 1. Sign Up
- Click "Sign Up" on the login page
- Fill in all required fields
- Success popup appears
- Redirected to login page

### 2. Login
- Enter username and password
- Credentials stored in localStorage
- Redirected to home feed

### 3. Create a Post
- Click the ➕ icon in the navigation
- Type your message or upload an image
- Click "Post" to share

### 4. Interact with Posts
- Click any post to view details
- Click ❤️ to like/unlike
- Add comments in the comment section

### 5. View Profile
- Click 👤 icon in navigation
- View your information
- Click ✏️ to edit profile
- See all your posts in a grid

## 🔌 Backend Integration

To connect with a real backend API:

### 1. Create `.env` file

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Create `src/api/axios.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
});

export default api;
```

### 3. Replace mock API calls with real endpoints

```javascript
// Example: Signup
import api from './api/axios';

const handleSignup = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    console.log(response.data);
  } catch (error) {
    console.error('Signup failed:', error);
  }
};

// Example: Get all posts
const fetchPosts = async () => {
  try {
    const response = await api.get('/posts');
    setPosts(response.data);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

// Example: Create post with image
const createPost = async (text, imageFile) => {
  const formData = new FormData();
  formData.append('text', text);
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  try {
    const response = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
};
```

## 📡 Expected Backend API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (multipart/form-data)
- `POST /api/posts/:id/like` - Toggle like
- `POST /api/posts/:id/comment` - Add comment

### Profile
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/:id/posts` - Get user's posts

## 🎨 Color Palette

- **Purple:** #a855f7 (Primary)
- **Pink:** #ec4899 (Accent)
- **Peach:** #fef3c7 (Background)
- **Lavender:** #f3e8ff (Light backgrounds)

## 🛠️ Tech Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios (ready to integrate)
- **Storage:** localStorage

## 📝 Notes for Beginners

1. **No complex authentication** - Uses simple localStorage
2. **Mock data included** - Works without backend initially
3. **Clean code structure** - Easy to understand and modify
4. **Commented code** - Helps you learn React concepts
5. **Responsive design** - Works on mobile and desktop

## 🔄 Building for Production

```bash
npm run build
```

The build files will be in the `dist/` folder.

## 🐛 Common Issues

### Tailwind classes not working?
Make sure `tailwind.config.js` content array includes your source files.

### Images not uploading?
For real image upload, you need a backend that accepts `multipart/form-data`.

### localStorage not persisting?
Check if your browser allows localStorage or if you're in incognito mode.

## 📚 Next Steps

1. Connect to a real backend API
2. Add image upload to cloud storage (Cloudinary, AWS S3)
3. Implement real-time updates with WebSockets
4. Add direct messaging feature
5. Implement search functionality
6. Add notifications

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new features
- Improve the UI
- Fix bugs
- Add comments for better understanding

## 📄 License

MIT License - Feel free to use this for learning!

---

Happy Coding! 🚀✨
