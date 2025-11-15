const express = require('express');
const router = express.Router();
const Banner = require('../models/BannerModel');

const ADMIN_KEY = process.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024';

// Middleware to check admin API key
const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
};

// Get all active banners (public endpoint)
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
                                .select('-imageData') // Don't send image data to public endpoint
                                .sort({ sortOrder: 1 });
    
    res.json({ 
      success: true, 
      data: banners,
      message: 'Banners fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch banners' 
    });
  }
});

// Get all banners (admin only) - includes image data
router.get('/admin/banners', adminAuth, async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ sortOrder: 1 });
    res.json({ 
      success: true, 
      data: banners,
      message: 'All banners fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching all banners:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch banners' 
    });
  }
});

// Create new banner with image data (admin only)
router.post('/admin/banners', adminAuth, async (req, res) => {
  try {
    const { title, subtitle, imageData, imageUrl, link, altText, sortOrder, isActive } = req.body;

    // Validation - either imageData or imageUrl is required
    if (!imageData && !imageUrl) {
      return res.status(400).json({ 
        success: false,
        error: 'Either image data or image URL is required' 
      });
    }

    const newBanner = new Banner({
      title: title || 'New Banner',
      subtitle: subtitle || 'Discover our delicious offerings',
      imageData: imageData || null,
      imageUrl: imageUrl || (imageData ? `data:image/jpeg;base64,${imageData}` : ''),
      link: link || '/menu',
      altText: altText || 'Banner Image',
      sortOrder: sortOrder || 0,
      isActive: isActive !== false
    });

    const savedBanner = await newBanner.save();
    
    res.status(201).json({ 
      success: true, 
      data: savedBanner,
      message: 'Banner created successfully'
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to create banner: ' + error.message
    });
  }
});

// Update banner (admin only)
router.put('/admin/banners/:id', adminAuth, async (req, res) => {
  try {
    const { title, subtitle, imageData, imageUrl, link, altText, sortOrder, isActive } = req.body;

    const updateData = {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(link !== undefined && { link }),
      ...(altText !== undefined && { altText }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive })
    };

    // Update image data if provided
    if (imageData !== undefined) {
      updateData.imageData = imageData;
      updateData.imageUrl = `data:image/jpeg;base64,${imageData}`;
    } else if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
      updateData.imageData = null; // Clear base64 data if using URL
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } 
    );

    if (!updatedBanner) {
      return res.status(404).json({ 
        success: false,
        error: 'Banner not found' 
      });
    }

    res.json({ 
      success: true, 
      data: updatedBanner,
      message: 'Banner updated successfully'
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to update banner: ' + error.message
    });
  }
});

// Delete banner (admin only)
router.delete('/admin/banners/:id', adminAuth, async (req, res) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(req.params.id);
    
    if (!deletedBanner) {
      return res.status(404).json({ 
        success: false,
        error: 'Banner not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Banner deleted successfully',
      data: deletedBanner
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete banner' 
    });
  }
});

// Get banner image data (for specific use cases)
router.get('/admin/banners/:id/image', adminAuth, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id).select('imageData imageUrl');
    
    if (!banner) {
      return res.status(404).json({ 
        success: false,
        error: 'Banner not found' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        imageData: banner.imageData,
        imageUrl: banner.imageUrl
      }
    });
  } catch (error) {
    console.error('Error fetching banner image:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch banner image' 
    });
  }
});

module.exports = router;