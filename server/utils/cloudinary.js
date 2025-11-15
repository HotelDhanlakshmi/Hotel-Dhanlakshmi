const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (imageFile) => {
  try {
    // If you're handling file uploads, you can use this
    // For now, we'll assume you're using image URLs
    const result = await cloudinary.uploader.upload(imageFile, {
      folder: 'hotel-dhanlakshmi/banners',
      resource_type: 'image'
    });
    
    return {
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Delete image from Cloudinary
const deleteImage = async (cloudinaryId) => {
  try {
    if (cloudinaryId) {
      await cloudinary.uploader.destroy(cloudinaryId);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  cloudinary
};