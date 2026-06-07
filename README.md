# Meetro 🚀

Meetro is a modern full-stack social media platform built with the MERN stack that allows users to connect, share posts, exchange messages, upload stories, and interact with friends in real time.

## ✨ Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* Secure password hashing with bcrypt
* Persistent user sessions

### 👤 User Management

* Edit profile information
* Upload profile and cover photos
* Follow and unfollow users
* View user profiles
* Search users

### 📝 Posts

* Create posts with text and images
* Like and unlike posts
* Comment on posts
* Delete own posts
* Save and unsave posts
* View feed from followed users

### 📸 Stories

* Upload stories with images
* View stories from followed users
* Story viewers tracking
* Automatic story expiration

### 💬 Real-Time Messaging

* One-to-one chat system
* Real-time message delivery using Socket.IO
* Image sharing in chat
* Message notifications
* Online/offline user status

### 🔔 Notifications

* Follow notifications
* Like notifications
* Comment notifications
* Real-time notification updates
* Mark notifications as read

### 📱 Responsive Design

* Mobile-friendly interface
* Tablet support
* Desktop optimized UI
* Modern and clean design

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios
* Socket.IO Client
* React Hot Toast
* React Icons

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.IO
* Multer

### Cloud Services

* Cloudinary (Image Storage)

---

## 📂 Project Structure

```bash
Meetro/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── store/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── db/
│   │   └── socket/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/meetro.git

cd meetro
```

### 2. Install Backend Dependencies

```bash
cd backend

npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend

npm install
```

### 4. Configure Environment Variables

Create `.env` files in both frontend and backend directories and add the required environment variables.

### 5. Run Backend

```bash
npm run dev
```

### 6. Run Frontend

```bash
npm run dev
```

---

## 🌐 API Modules

### Authentication

* Sign Up
* Sign In
* Sign Out
* Refresh Token

### Users

* Get Current User
* Get User Profile
* Update Profile
* Follow / Unfollow User

### Posts

* Create Post
* Delete Post
* Like / Unlike Post
* Save / Unsave Post
* Comment on Post

### Stories

* Upload Story
* View Story
* Delete Story

### Messages

* Send Message
* Get Conversations
* Get Messages

### Notifications

* Get Notifications
* Mark as Read

---

## 🔒 Security Features

* JWT Authentication
* Password Hashing with bcrypt
* Protected API Routes
* HTTP-Only Cookies
* Input Validation
* Error Handling Middleware

---

## 📸 Screenshots

Add screenshots of:

* Login Page
* Home Feed
* User Profile
* Messaging Interface
* Story Section
* Notifications

---

## 🧪 Future Enhancements

* Group Chats
* Voice & Video Calls
* Post Sharing
* Reels Support
* Dark Mode
* User Verification
* Push Notifications
* AI Content Recommendations

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed with ❤️ using the MERN Stack.

**Meetro — Connect, Share, and Stay Social.**
