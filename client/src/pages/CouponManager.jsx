import React, { useState, useEffect } from 'react'; // Import useEffect

const CouponManager = () => {
  // State for the "Create New Coupon" form
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent'); // 'percent' or 'fixed'
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(0);
  const [limit, setLimit] = useState(50);
  const [appliesTo, setAppliesTo] = useState('cart'); // The "master switch"
  const [targetCategories, setTargetCategories] = useState([]);
  const [targetItems, setTargetItems] = useState([]);

  // State for fetching
  const [allCategories, setAllCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // --- 1. FETCH FROM BOTH ROUTES ON LOAD ---
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // --- Make sure these URLs match your server ---
        const productsPromise = fetch('http://localhost:5000/api/products');
        const categoriesPromise = fetch('http://localhost:5000/api/categories');

        // Wait for both fetches to complete
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsPromise,
          categoriesPromise
        ]);

        if (!productsResponse.ok) {
           throw new Error(`Failed to fetch products: ${productsResponse.statusText}`);
        }
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        // --- Populate your state with data from the server ---
        // Note: We use .data because your routes send { success: true, data: ... }
        setAllCategories(categoriesData.data);
        setAllItems(productsData.data);
        
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
        setErrorMessage(error.message); // Show error to user
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuData();
  }, []); // The empty array [] means this runs once

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newCoupon = {
      code,
      type,
      value,
      minOrder,
      limit,
      appliesTo,
      targetCategories: appliesTo === 'specific' ? targetCategories : [],
      targetItems: appliesTo === 'specific' ? targetItems : [],
    };

    console.log("NEW COUPON CREATED:", newCoupon);
    
    // This is where you would 'POST' to your API
    // await fetch('http://localhost:5000/api/admin/coupons', { ... });
    
    alert(`Coupon "${code}" created! Check the console (F12) to see the data.`);
    resetForm();
  };

  const resetForm = () => {
    setCode('');
    setType('percent');
    setValue(10);
    setMinOrder(0);
    setLimit(50);
    setAppliesTo('cart');
    setTargetCategories([]);
    setTargetItems([]);
  };

  // Helper for multi-select
  const handleSelectChange = (e, setter) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setter(options);
  };

  // Show error if data couldn't be loaded
  if (errorMessage) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-red-600">
        <h2 className="text-xl font-bold">Error loading component</h2>
        <p>{errorMessage}</p>
        <p>Please ensure your server is running and the routes `/api/products` and `/api/categories` are correct.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* --- CREATE COUPON FORM --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Create New Coupon</h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., DIWALI20"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Value</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Order Amount (₹)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(parseFloat(e.target.value))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Usage Limit</label>
              <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          
          {/* Column 2 - The Dynamic Part */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Discount Applies To</label>
              <select value={appliesTo} onChange={(e) => setAppliesTo(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="cart">Entire Cart (Bulk Order)</option>
                <option value="specific">Specific Items / Categories</option>
              </select>
            </div>

            {/* --- THIS IS THE DYNAMIC LOGIC --- */}
            {appliesTo === 'specific' && (
              <div className="border border-orange-300 p-4 rounded-md space-y-4">
                <p className="text-sm text-gray-600">Apply discount only to these (Hold Ctrl/Cmd to select multiple):</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Categories</label>
                  <select
                    multiple
                    value={targetCategories}
                    onChange={(e) => handleSelectChange(e, setTargetCategories)}
                    disabled={isLoading}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32 disabled:bg-gray-100"
                  >
                    {isLoading ? (
                      <option>Loading categories...</option>
                    ) : (
                      // --- Use 'id' and 'name' from your categories data ---
                      allCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Target Items</label>
                  <select
                    multiple
                    value={targetItems}
                    onChange={(e) => handleSelectChange(e, setTargetItems)}
                    disabled={isLoading}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32 disabled:bg-gray-100"
                  >
                    {isLoading ? (
                      <option>Loading items...</option>
                    ) : (
                      // --- Use 'id' and 'name' from your product data ---
                      // ***** ADJUST THIS LINE TO MATCH YOUR 'Product' SCHEMA *****
                      allItems.map(item => (
                        <option key={item._id || item.id} value={item._id || item.id}>{item.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700"
            >
              Generate Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponManager;