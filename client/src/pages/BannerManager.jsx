import React, { useState, useEffect } from 'react';

// This is the default state for your new, simple form
const initialFormState = {
  imageUrl: '',
  link: '/menu',
  sortOrder: 0,
  isActive: true,
};

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for the form
  const [formState, setFormState] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(null); // Will hold the ID of the banner being edited
  const [formMessage, setFormMessage] = useState(null);

  // Your Admin API Key
  const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'hotel_dhanlakshmi_admin_2024';

  // --- 1. Fetch all banners when the component loads ---
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/banners', {
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

  // --- 2. Handle form input changes ---
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- 3. Handle form submission (Create or Update) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMessage(null);

    const url = isEditing
      ? `http://localhost:5000/api/admin/banners/${isEditing}`
      : 'http://localhost:5000/api/admin/banners';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': ADMIN_KEY
        },
        body: JSON.stringify(formState) // Sends the simplified formState
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save banner');
      }
      
      setFormMessage({ type: 'success', text: `Banner ${isEditing ? 'updated' : 'created'} successfully!` });
      resetForm();
      fetchBanners(); // Refresh the list
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message });
    }
  };

  // --- 4. Handle clicking the "Edit" button ---
  const handleEditClick = (banner) => {
    setIsEditing(banner._id);
    setFormState({
      imageUrl: banner.imageUrl,
      link: banner.link,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  // --- 5. Handle deleting a banner ---
  const handleDeleteClick = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': ADMIN_KEY }
      });
      if (!response.ok) throw new Error('Failed to delete banner');
      
      setFormMessage({ type: 'success', text: 'Banner deleted successfully.' });
      fetchBanners(); // Refresh the list
    } catch (err) {
      setFormMessage({ type: 'error', text: err.message });
    }
  };

  // --- 6. Reset the form (after submit or cancel) ---
  const resetForm = () => {
    setFormState(initialFormState);
    setIsEditing(null);
  };

  return (
    <div className="space-y-8">
      {/* --- FORM SECTION (Simplified) --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? 'Edit Banner' : 'Add New Banner'}
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Main required field: Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL *</label>
            <input 
              type="url" 
              name="imageUrl" 
              value={formState.imageUrl} 
              onChange={handleFormChange} 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
              placeholder="https://i.ibb.co/..."
            />
            {formState.imageUrl && <img src={formState.imageUrl} alt="Preview" className="w-full h-32 object-cover mt-2 rounded-md" />}
          </div>

          {/* Optional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Link (e.g., "/menu")</label>
              <input type="text" name="link" value={formState.link} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort Order</label>
              <input type="number" name="sortOrder" value={formState.sortOrder} onChange={handleFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="flex items-center pt-6">
              <input type="checkbox" name="isActive" id="isActive" checked={formState.isActive} onChange={handleFormChange} className="mr-2 h-4 w-4 text-orange-600 border-gray-300 rounded" />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Is Active?</label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600">
                Cancel Edit
              </button>
            )}
            <button type="submit" className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700">
              {isEditing ? 'Update Banner' : 'Add Banner'}
            </button>
          </div>
        </form>
        {formMessage && (
          <p className={`mt-4 text-sm ${formMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {formMessage.text}
          </p>
        )}
      </div>

      {/* --- BANNER LIST SECTION --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Current Banners</h2>
        {isLoading && <p>Loading banners...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map(banner => (
                <tr key={banner._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={banner.imageUrl} alt="Banner" className="w-32 h-16 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{banner.link}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{banner.sortOrder}</span>
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
                    <button onClick={() => handleEditClick(banner)} className="text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(banner._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BannerManager;