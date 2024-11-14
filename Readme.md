# 📹 **VideoTube Backend**

A powerful backend solution for VideoTube, a platform that enables users to upload, watch, and engage with videos. Inspired by YouTube’s core features, this backend offers a seamless video streaming and social interaction experience.

### 🌐 **Quick Links**

| Resource              | Link                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| **Model Workspace**   | [Model Workspace](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)         |
| **API Documentation** | [API Documentation](https://documenter.getpostman.com/view/28528757/2sAY4yefx3) |
| **Landing Page**      | [Landing Page](https://videotube-backend-q1uq.onrender.com)                     |

## ✨ **Features**

- **User Authentication**: Secure Login/Signup using JWT.
- **Video Management**: CRUD operations for videos (upload, delete, update).
- **Interactive Engagement**: Like/Dislike videos, comment on videos.
- **Playlist Management**: Create, update, delete playlists, and add/remove videos.
- **Channel Subscriptions**: Stay updated with favorite channels.
- **Enhanced Search**: Powerful search with indexing for optimal performance.
- **Pagination & Filtering**: Effortless browsing through extensive video libraries.
- **Cloudinary Integration**: Reliable cloud storage for videos and thumbnails.

## 🛠 **Tech Stack**

- **Node.js**: Backend runtime
- **Express.js**: Web framework for REST APIs
- **MongoDB (Mongoose)**: Database for scalable data management
- **Cloudinary**: Cloud storage for media assets
- **JWT**: Authentication and authorization
- **Multer**: Middleware for file uploads

## 🚀 **Getting Started**

### **Clone the Repository**

```bash
git clone https://github.com/username/videotube-backend.git
```

### **Install Dependencies**

```bash
npm install
```

### **Environment Configuration**

Create a .env file in the root directory and configure the following environment variables:

```bash
MONGO_URI=your_mongoDB_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### **Start the Server**

```bash
npm run dev
```

The server will start running at http://localhost:8000.

## 🐳 Docker Configuration

To run SwiftMart with Docker, use Docker Compose for easy setup and container management.

### 📋 Prerequisites

Ensure you have the following installed:

- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Included with Docker Desktop on most systems.

### 🛠 Setup with Docker

1. **Environment Variables**: Create a `.env.docker` file in the project root directory copy the .env file and add docker specific environment variables . This file will be automatically loaded by Docker Compose.

   Example `.env.docker`:

   ```dotenv
   MONGODB_URL=mongodb://yourusername:yourpassword@mongodb
   MONGO_INITDB_ROOT_USERNAME=yourusername
   MONGO_INITDB_ROOT_PASSWORD=yourpassword
   ```

2. **Build and Start the Application**:Run the following command to build and start the services:

```
docker compose up -d
```

This will start:

- nodeapp: Backend server at http://localhost:3333
- mongodb: MongoDB database on port 3700

3. **Stopping the Containers**: To stop the containers, use:

```
docker compose down
```

## 📋 **API Endpoints**

| Endpoint               | Description                                  |
| ---------------------- | -------------------------------------------- |
| `/api/v1/users`        | User registration, login, profile management |
| `/api/v1/videos`       | Video upload, update, delete                 |
| `/api/v1/comments`     | Add and view comments on videos              |
| `/api/v1/likes`        | Like or dislike videos and comments          |
| `/api/v1/playlist`     | Manage playlists (create, update, delete)    |
| `/api/v1/tweets`       | Post tweets, integrating social interaction  |
| `/api/v1/subscription` | Subscribe or unsubscribe from channels       |
| `/api/v1/dashboard`    | User dashboard for activity overview         |
| `/api/v1/healthcheck`  | Backend health verification                  |

## 🤝 **Contributing**

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests.

## 📜 **License**

This project is licensed under [Chai Aur Code](https://www.youtube.com/@chaiaurcode).
