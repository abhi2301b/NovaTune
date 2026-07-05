const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const { uploadFile, uploadImage } = require('../services/storage.service');

async function createMusic(req, res) {
    try {
        const { title } = req.body;
        const audioFile = req.files?.music?.[0];
        const imageFile = req.files?.image?.[0];

        if (!audioFile) {
            return res.status(400).json({ message: 'Audio file is required' });
        }

        // Upload audio
        const audioResult = await uploadFile(audioFile.buffer.toString('base64'));

        // Upload cover image if provided
        let imageUrl = null;
        if (imageFile) {
            const imgResult = await uploadImage(
                imageFile.buffer.toString('base64'),
                `cover_${Date.now()}_${imageFile.originalname}`
            );
            imageUrl = imgResult.url;
        }

        const music = await musicModel.create({
            uri: audioResult.url,
            imageUrl,
            title,
            artist: req.user.id
        });

        await music.save();

        res.status(201).json({
            message: 'Music created successfully',
            music: {
                id: music._id,
                uri: music.uri,
                imageUrl: music.imageUrl,
                title: music.title,
                artist: music.artist
            }
        });
    } catch (err) {
        console.error('createMusic error:', err.message);
        res.status(500).json({ message: 'Failed to upload music', error: err.message });
    }
}

async function createAlbum(req, res) {
    try {
        const { title, musicIds } = req.body;
        const imageFile = req.files?.image?.[0];

        let imageUrl = null;
        if (imageFile) {
            const imgResult = await uploadImage(
                imageFile.buffer.toString('base64'),
                `album_${Date.now()}_${imageFile.originalname}`
            );
            imageUrl = imgResult.url;
        }

        const album = await albumModel.create({
            title,
            imageUrl,
            music: musicIds,
            artist: req.user.id
        });
        await album.save();

        res.status(201).json({
            message: 'Album created successfully',
            album: {
                id: album._id,
                title: album.title,
                imageUrl: album.imageUrl,
                music: album.music,
                artist: album.artist
            }
        });
    } catch (err) {
        console.error('createAlbum error:', err.message);
        res.status(500).json({ message: 'Failed to create album', error: err.message });
    }
}

async function getallMusic(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const musics = await musicModel
            .find()
            .populate('artist', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await musicModel.countDocuments();
        const hasMore = skip + musics.length < total;

        res.status(200).json({ message: 'Music retrieved successfully', musics, hasMore });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving music', error: err.message });
    }
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().limit(10).populate('artist', 'username email');
    res.status(200).json({
        message: 'All albums retrieved successfully',
        albums: albums,
    });
}

async function getAlbumById(req, res) {
    const identifier = req.params.albumId;
    let album;
    
    // Check if it's a valid MongoDB ObjectId (24 hex characters)
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        album = await albumModel.findById(identifier)
            .populate('artist', 'username email')
            .populate('music');
    } else {
        // Otherwise, search by album title
        album = await albumModel.findOne({ title: identifier })
            .populate('artist', 'username email')
            .populate('music');
    }

    if (!album) {
        return res.status(404).json({ message: 'Album not found' });
    }

    return res.status(200).json({
        message: 'Album retrieved successfully',
        album: album,
    });
}

async function getMyMusic(req, res) {
    try {
        const songs = await musicModel
            .find({ artist: req.user.id })
            .populate('artist', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: 'Your music retrieved', musics: songs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your music', error: err.message });
    }
}

async function getMyAlbums(req, res) {
    try {
        const albums = await albumModel
            .find({ artist: req.user.id })
            .populate('artist', 'username email')
            .populate('music')
            .sort({ createdAt: -1 });
        res.status(200).json({ message: 'Your albums retrieved', albums });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your albums', error: err.message });
    }
}

module.exports = { createMusic, createAlbum, getallMusic, getAllAlbums, getAlbumById, getMyMusic, getMyAlbums };