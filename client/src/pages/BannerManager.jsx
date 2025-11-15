import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formState, setFormState] = useState({
    title: '',
    subtitle: '',
    imageFile: null,
    imagePreview: null,
    link: '/menu',
    altText: 'Banner Image',
    sortOrder: 0,
    isActive: true,
  });
  const [isEditing, setIsEditing] = useState(null);
  const [formMessage, setFormMessage] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/banners`, {
        headers: { 'X-API-Key': ADMIN_KEY }
      });
      if (!response.ok) throw new Error('Failed to fetch banners.');
      const data = await response.json();
      setBanners(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection and convert to base64
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, etc.)' });
        return;
      }

      // Validate file size (max 3MB)
      if (file.size > 3 * 1024 * 1024) {
        setFormMessage({ type: 'error', text: 'Image size should be less than 3MB' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        // Remove data:image/...;base64, prefix to store only base64 data
        const base64Data = e.target.result.split(',')[1];
        
        setFormState(prev => ({
          ...prev,
          imageFile: base64Data,
          imagePreview: e.target.result // Keep full data URL for preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);

    // Validate
    if (!formState.imageFile) {
      setFormMessage({ type: 'error', text: 'Please select an image file to upload' });
      return;
    }

    setUploading(true);

    try {
      const url = isEditing
        ? `${API_URL}/api/admin/banners/${isEditing}`
        : `${API_URL}/api/admin/banners`;

      const method = isEditing ? 'PUT' : 'POST';

      const requestBody = {
        title: formState.title,
        subtitle: formState.subtitle,
        imageData: formState.imageFile,
        link: formState.link,
        altText: formState.altText,
        sortOrder: parseInt(formState.sortOrder) || 0,
        isActive: formState.isActive
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ADMIN_KEY
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save banner');
      }
      
      setFormMessage({ type: 'success', text: `Banner ${isEditing ? 'updated' : 'created'} successfully!` });
      resetForm();
      fetchBanners();
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (banner) => {
    setIsEditing(banner._id);
    setFormState({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageFile: banner.imageData || null,
      imagePreview: banner.imageUrl,
      link: banner.link,
      altText: banner.altText || 'Banner Image',
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
    window.scrollTo(0, 0);
  };

  const handleDeleteClick = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': ADMIN_KEY }
      });
      
      if (!response.ok) throw new Error('Failed to delete banner');
      
      setFormMessage({ type: 'success', text: 'Banner deleted successfully.' });
      fetchBanners();
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message });
    }
  };

  const resetForm = () => {
    setFormState({
      title: '',
      subtitle: '',
      imageFile: null,
      imagePreview: null,
      link: '/menu',
      altText: 'Banner Image',
      sortOrder: 0,
      isActive: true,
    });
    setIsEditing(null);
  };

  const updateBannerOrder = async (bannerId, newOrder) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/banners/${bannerId}/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ADMIN_KEY
        },
        body: JSON.stringify({ sortOrder: newOrder })
      });

      if (response.ok) {
        fetchBanners();
      } else {
        const data = await response.json();
        setFormMessage({ type: 'error', text: data.error || 'Failed to update order' });
      }
    } catch (error) {
      console.error('Error updating banner order:', error);
      setFormMessage({ type: 'error', text: 'Failed to update banner order' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? 'Edit Banner' : 'Add New Banner'}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image (Max 3MB) *
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <p className="mt-1 text-sm text-gray-500">
              Supports JPG, PNG, WebP. Max 3MB. Image will be stored in database.
            </p>
            
            {formState.imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img 
                  src={formState.imagePreview} 
                  alt="Preview" 
                  className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input 
                type="text" 
                value={formState.title}
                onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                placeholder="Banner Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input 
                type="text" 
                value={formState.subtitle}
                onChange={(e) => setFormState(prev => ({ ...prev, subtitle: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                placeholder="Banner Subtitle"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input 
                type="text" 
                value={formState.link} 
                onChange={(e) => setFormState(prev => ({ ...prev, link: e.target.value }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                placeholder="/menu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort Order</label>
              <input 
                type="number" 
                value={formState.sortOrder} 
                onChange={(e) => setFormState(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                min="0"
              />
            </div>
            <div className="flex items-center pt-6">
              <input 
                type="checkbox" 
                checked={formState.isActive} 
                onChange={(e) => setFormState(prev => ({ ...prev, isActive: e.target.checked }))}
                className="mr-2 h-4 w-4 text-orange-600 border-gray-300 rounded" 
              />
              <label className="text-sm font-medium text-gray-700">
                Is Active?
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600"
              >
                Cancel Edit
              </button>
            )}
            <button 
              type="submit" 
              disabled={uploading}
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50"
            >
              {uploading ? 'Saving...' : (isEditing ? 'Update Banner' : 'Add Banner')}
            </button>
          </div>
        </form>
        
        {formMessage && (
          <div className={`mt-4 p-3 rounded ${
            formMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {formMessage.text}
          </div>
        )}
      </div>

      {/* Banner List Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          Current Banners ({banners.length})
        </h2>
        
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2">Loading banners...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {!isLoading && banners.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No banners found. Add your first banner above.
          </div>
        )}

        {!isLoading && banners.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner, index) => (
                  <tr key={banner._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={banner.imageUrl} 
                        alt="Banner" 
                        className="w-20 h-12 object-cover rounded border"
                        onError={(e) => {
                          e.target.src = '/src/assets/banner.png';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {banner.title || 'Untitled Banner'}
                        </div>
                        {banner.subtitle && (
                          <div className="text-sm text-gray-500">{banner.subtitle}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700">{banner.link}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateBannerOrder(banner._id, banner.sortOrder - 1)}
                          disabled={index === 0}
                          className={`p-1 rounded ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          ↑
                        </button>
                        <span className="text-sm text-gray-700 w-8 text-center font-medium">
                          {banner.sortOrder}
                        </span>
                        <button 
                          onClick={() => updateBannerOrder(banner._id, banner.sortOrder + 1)}
                          disabled={index === banners.length - 1}
                          className={`p-1 rounded ${
                            index === banners.length - 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {banner.isActive ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button 
                        onClick={() => handleEditClick(banner)} 
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(banner._id)} 
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManager;