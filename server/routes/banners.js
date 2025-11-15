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
    const { title, subtitle, imageData, link, altText, sortOrder, isActive } = req.body;

    // Validation
    if (!imageData) {
      return res.status(400).json({ 
        success: false,
        error: 'Image data is required' 
      });
    }

    // Validate image size (3MB max)
    const base64Size = (imageData.length * 3) / 4; // Approximate size in bytes
    if (base64Size > 3 * 1024 * 1024) {
      return res.status(400).json({ 
        success: false,
        error: 'Image size should be less than 3MB' 
      });
    }

    const newBanner = new Banner({
      title: title || 'New Banner',
      subtitle: subtitle || 'Discover our delicious offerings',
      imageData: imageData,
      imageUrl: `data:image/jpeg;base64,${imageData}`,
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
    const { title, subtitle, imageData, link, altText, sortOrder, isActive } = req.body;

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
      // Validate image size (3MB max)
      const base64Size = (imageData.length * 3) / 4;
      if (base64Size > 3 * 1024 * 1024) {
        return res.status(400).json({ 
          success: false,
          error: 'Image size should be less than 3MB' 
        });
      }
      
      updateData.imageData = imageData;
      updateData.imageUrl = `data:image/jpeg;base64,${imageData}`;
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

// Update banner order (admin only)
router.put('/admin/banners/:id/order', adminAuth, async (req, res) => {
  try {
    const { sortOrder } = req.body;

    if (sortOrder === undefined || sortOrder < 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid sort order is required' 
      });
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { sortOrder },
      { new: true }
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
      message: 'Banner order updated successfully'
    });
  } catch (error) {
    console.error('Error updating banner order:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to update banner order' 
    });
  }
});

module.exports = router;