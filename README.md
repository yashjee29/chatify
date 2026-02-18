# Chatify 💬

A modern, real-time chat application built with React, Socket.IO, and Express. Chatify provides seamless instant messaging with support for direct messages, group chats, typing indicators, and user presence tracking.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.3-010101?logo=socket.io)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- ✉️ **Email Verification** - Email-based account verification
- 💬 **Real-time Messaging** - Instant message delivery using Socket.IO
- 👥 **Group Chats** - Create and manage group conversations
- 🟢 **User Presence** - See who's online in real-time
- ⌨️ **Typing Indicators** - Know when someone is typing
- 🔒 **End-to-End Encryption** - Secure message encryption
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Clean and intuitive user interface

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **React Router** - Routing
- **Lucide React** - Icons

### Backend
- **Express** - Web framework
- **Socket.IO** - WebSocket server
- **JSON Web Tokens** - Authentication
- **Bcrypt** - Password hashing
- **Resend** - Email service
- **UUID** - Unique ID generation

## 📋 Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn package manager
- A [Resend](https://resend.com/) API key for email verification (optional)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/chatify.git
cd chatify
```

### 2. Install dependencies

#### Install frontend dependencies:
```bash
npm install
```

#### Install backend dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=4000
EMAIL_SECRET=your_email_secret_key
JWT_SECRET=your_jwt_secret_key
MESSAGE_SECRET=your_message_encryption_key
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
FROM_EMAIL=Your App <noreply@yourdomain.com>
RESEND_API_KEY=your_resend_api_key
```

**Security Note:** Make sure to use strong, unique secrets for production!

## 🏃‍♂️ Running the Application

### Development Mode

#### Start the backend server:
```bash
cd server
npm run dev
```
The server will run on `http://localhost:4000`

#### Start the frontend (in a new terminal):
```bash
npm run dev
```
The app will run on `http://localhost:5173`

### Production Build

#### Build the frontend:
```bash
npm run build
npm run preview
```

#### Run the backend:
```bash
cd server
npm start
```

## 📁 Project Structure

```
chatify/
├── public/                 # Static assets
├── server/                 # Backend application
│   ├── controller/         # Route controllers
│   │   ├── auth/          # Authentication logic
│   │   ├── chat/          # Chat operations
│   │   ├── messages/      # Message handling
│   │   └── user/          # User management
│   ├── data/              # JSON data storage
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── socket/            # Socket.IO handlers
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── src/                   # Frontend application
│   ├── api/               # API configuration
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   ├── socket/            # Socket.IO client setup
│   ├── styles/            # CSS modules
│   └── main.jsx           # App entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Verify email

### Users
- `GET /api/users` - Get all users

### Chats
- `GET /api/chat` - Get user's chats
- `POST /api/chat` - Create new chat
- `POST /api/chat/group` - Create group chat

### Messages
- `GET /api/messages/:chatId` - Get chat messages
- `POST /api/messages` - Send message

### Health Check
- `GET /api/health` - Server health status

## 🔐 Socket.IO Events

### Client → Server
- `auth:authenticate` - Authenticate socket connection
- `message:send` - Send a message
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

### Server → Client
- `message:new` - Receive new message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `presence:update` - User online status changed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Your Name**
- GitHub: [@yashjee29](https://github.com/yashjee29)

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- React team for the amazing framework
- Vite for the blazing fast build tool

---

Made with ❤️ by [Yash Jee](https://github.com/yashjee29)
