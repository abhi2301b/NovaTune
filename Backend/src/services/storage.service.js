const {ImageKit} = require('@imagekit/nodejs');

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(fileBase64) {
    try {
        const result = await imagekit.files.upload({
            file: fileBase64,
            fileName: `music_${Date.now()}.mp3`,
            folder: "/music"
        });
        return result;
    } catch (err) {
        console.error("========== IMAGEKIT AUDIO ERROR ==========");
        console.error(err.message);
        throw err;
    }
}

async function uploadImage(fileBase64, filename) {
    try {
        const result = await imagekit.files.upload({
            file: fileBase64,
            fileName: filename || `cover_${Date.now()}.jpg`,
            folder: "/covers"
        });
        return result;
    } catch (err) {
        console.error("========== IMAGEKIT IMAGE ERROR ==========");
        console.error(err.message);
        throw err;
    }
}

module.exports = { uploadFile, uploadImage };