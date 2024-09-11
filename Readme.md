# Video-Tube backend

This is a project about building backend for videotube where you can upload and watch videos, a platform similar to youtube

### Model link

- [Model link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

## Features

- User Authentication (Login/Signup with JWT)
- Video CRUD operations (upload, delete, update)
- Video like/dislike functionality
- Commenting on videos
- Playlist management (create, update, delete, add/remove videos)
- Channel subscriptions
- Search functionality with indexing
- Pagination and filtering for videos
- Cloudinary integration for video and thumbnail uploads

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Cloudinary** (for file storage)
- **JWT** (for authentication)
- **Multer** (for file uploads)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/username/videotube-backend.git
```

2. Install dependencies:

```bash
npm install
```

3. Setup your enivornment variables:
   Create a .env file and add the following:

```bash
MONGO_URI=your_mongoDB_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:

```bash
npm run dev
```

## API Endpoints

- /api/v1/user: For user operations
- /api/v1/video: For video CRUD operations
- /api/v1/comment: For adding and retrieving comments on videos
- /api/v1/likes: For liking videos and comments
- /api/v1/playlist: For managing playlists
- /api/v1/subscription: For subscribing to/unsubscribing from channels
- /api/v1/dashboard: For displaying dashboard
- /api/v1/tweet: For writing tweets
- /api/v1/healthcheck: For verifying backend's health

## Contributing

If you wish to contribute to this project, please feel free to contribute.

## License

This project is licensed under [Chai Aur Code](https://www.youtube.com/@chaiaurcode)
