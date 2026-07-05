const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: null
    },
    music: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Music',
    }],
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { timestamps: true });

const albumModel = mongoose.model('Album', albumSchema);

module.exports = albumModel;