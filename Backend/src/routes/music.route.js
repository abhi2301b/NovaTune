const express = require('express');
const musicController = require('../controllers/music.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// POST /api/music/upload — accepts audio file + optional cover image
router.post(
    '/upload',
    authMiddleware.authArtist,
    upload.fields([{ name: 'music', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
    musicController.createMusic
);

// POST /api/music/album — accepts optional cover image
router.post(
    '/album',
    authMiddleware.authArtist,
    upload.fields([{ name: 'image', maxCount: 1 }]),
    musicController.createAlbum
);

// GET /api/music
router.get('/', authMiddleware.authUser, musicController.getallMusic);

// GET /api/music/albums
router.get('/albums', authMiddleware.authUser, musicController.getAllAlbums);

// GET /api/music/my  — artist: their own songs
router.get('/my', authMiddleware.authArtist, musicController.getMyMusic);

// GET /api/music/my-albums  — artist: their own albums
router.get('/my-albums', authMiddleware.authArtist, musicController.getMyAlbums);

// GET /api/music/album/:id
router.get('/album/:albumId', authMiddleware.authUser, musicController.getAlbumById);

module.exports = router;
