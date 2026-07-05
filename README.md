# NovaTune 🎵

A full-stack, modern music streaming platform built with the MERN stack. NovaTune allows users to discover music, artists to upload their tracks and albums, and everyone to enjoy continuous, uninterrupted audio playback across the entire application.

## 🚀 Features

* **Continuous Playback:** The music player is decoupled from the page routes, ensuring your songs never stop playing when navigating between albums, home, or upload pages.
* **Role-Based Authentication:** 
  * **Listeners** can browse, discover, and stream music.
  * **Artists** have access to a dedicated "My Music" studio dashboard to upload songs, add custom cover art, and group tracks into albums.
* **Cloud Storage:** Seamless integration with ImageKit for fast, reliable streaming of both MP3 audio files and image assets.
* **Modern UI:** Built with custom CSS and Framer Motion for a premium, responsive glassmorphism aesthetic with smooth micro-animations.
* **State Management:** Fully optimized global state using Redux Toolkit (handling playback queues, current track, user auth, and cached API responses).

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* Redux Toolkit (State Management)
* React Router v6
* Framer Motion (Animations)
* Lucide React (Icons)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Tokens (JWT) for secure cookies
* ImageKit SDK (Media storage)
* Multer (Handling multipart/form-data)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/novatune.git
   cd novatune
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` folder with your credentials:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 💡 How the Continuous Player Works
NovaTune achieves Spotify-like uninterrupted playback by utilizing a `MainLayoutWrapper` in the React Router configuration. The `audio` element and global `PlayerBar` sit outside of the individual page routes (`<Outlet />`). When a user navigates from the Home page to an Album page, only the inner content remounts—leaving the audio element fully intact and playing seamlessly.

## 📝 License
This project is open-source and available under the MIT License.
