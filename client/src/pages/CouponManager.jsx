import React, { useState, useEffect } from 'react';

const CouponManager = () => {
  // --- All your form states (unchanged) ---
  const [code, setCode] = useState('');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState(10);
  const [minOrder, setMinOrder] = useState(0);
  const [limit, setLimit] = useState(50);
  const [appliesTo, setAppliesTo] = useState('cart');
  const [targetCategories, setTargetCategories] = useState([]);
  const [targetItems, setTargetItems] = useState([]);

  // --- States for your lists (unchanged) ---
  const [allCategories, setAllCategories] = useState([]);
  const [allItems, setAllItems] = useState([]);

  // --- 1. ADD NEW STATES to hold your coupon list and messages ---
  const [coupons, setCoupons] = useState([]); // This will hold the list from the DB
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  // --- 2. UPDATE YOUR useEffect to fetch ALL data on load ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(''); // Clear errors
      try {
        // Fetch all three sets of data at the same time
        const [productsRes, categoriesRes, couponsRes] = await Promise.all([
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/categories'),
          fetch('http://localhost:5000/api/admin/coupons') // <-- YOUR NEW ROUTE
        ]);

        if (!productsRes.ok) throw new Error('Failed to fetch products');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        if (!couponsRes.ok) throw new Error('Failed to fetch coupons');

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const couponsData = await couponsRes.json(); // <-- YOUR NEW DATA

        setAllItems(productsData.data);
        setAllCategories(categoriesData.data);
        setCoupons(couponsData.data); // <-- SET THE COUPON LIST
        
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // The empty array [] means this runs once on mount


  // --- 3. UPDATE your handleFormSubmit to POST to the API ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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

    try {
      // Send the data to your new POST route
      const response = await fetch('http://localhost:5000/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create coupon');
      }

      const savedCoupon = await response.json();

      setSuccessMessage(`Coupon "${code}" created successfully!`);
      resetForm();
      
      // Add the new coupon to the top of your list (no re-fetch needed)
      setCoupons([savedCoupon.data, ...coupons]);
      
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  
  // --- 4. ADD a function to handle deleting a coupon ---
  const deleteCoupon = async (couponId) => {
    // Ask for confirmation
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/coupons/${couponId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete coupon');
      }

      setSuccessMessage('Coupon deleted successfully.');
      
      // Remove the coupon from the list in your state
      setCoupons(prevCoupons => prevCoupons.filter(c => c._id !== couponId));
      
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // ... (Your other functions like resetForm and handleSelectChange) ...
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

  const handleSelectChange = (e, setter) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setter(options);
  };
  

  // --- 5. PASTE THIS CODE into your return() statement ---
  // This is the full JSX for your component
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
                    {isLoading ? <option>Loading...</option> : allCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
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
                    {isLoading ? <option>Loading...</option> : allItems.map(item => (
                      <option key={item._id || item.id} value={item._id || item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button & Messages */}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700"
            >
              Generate Coupon
            </button>
            {successMessage && <p className="text-green-600 text-left mt-4">{successMessage}</p>}
            {errorMessage && <p className="text-red-600 text-left mt-4">{errorMessage}</p>}
          </div>
        </form>
      </div>

      {/* --- 6. ADD THIS TABLE to show your list of coupons --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Existing Coupons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applies To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4 text-gray-500">No coupons found. Create your first one!</td></tr>
              ) : (
                coupons.map(coupon => (
                  <tr key={coupon._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{coupon.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{coupon.appliesTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{coupon.uses} / {coupon.limit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => deleteCoupon(coupon._id)} 
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponManager;