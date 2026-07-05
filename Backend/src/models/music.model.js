const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    uri: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: null
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

const musicModel = mongoose.model('Music', musicSchema);

module.exports = musicModel;