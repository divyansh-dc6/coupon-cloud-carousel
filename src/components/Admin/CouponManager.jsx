import React, { useState, useEffect } from 'react';
import { addCoupon, updateCoupon, deleteCoupon, getCoupons } from '../../services/couponService';
import Loading from '../Common/Loading';
import Error from '../Common/Error';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    isActive: true,
    description: ''
  });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'

  // Fetch coupons on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const couponsData = await getCoupons();
      setCoupons(couponsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    if (formMode === 'add') {
      setNewCoupon(prev => ({ ...prev, [name]: inputValue }));
    } else {
      setEditingCoupon(prev => ({ ...prev, [name]: inputValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (formMode === 'add') {
        await addCoupon(newCoupon);
        setNewCoupon({
          code: '',
          discount: '',
          expiryDate: '',
          isActive: true,
          description: ''
        });
      } else {
        await updateCoupon(editingCoupon.id, editingCoupon);
        setEditingCoupon(null);
        setFormMode('add');
      }
      
      await fetchCoupons();
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError('Failed to save coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormMode('edit');
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteCoupon(couponId);
      await fetchCoupons();
    } catch (err) {
      console.error('Error deleting coupon:', err);
      setError('Failed to delete coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    setLoading(true);
    try {
      await updateCoupon(coupon.id, { 
        ...coupon, 
        isActive: !coupon.isActive 
      });
      await fetchCoupons();
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      setError('Failed to update coupon status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingCoupon(null);
    setFormMode('add');
  };

  if (loading && coupons.length === 0) {
    return <Loading />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Coupon Manager</h2>
      
      {error && <Error message={error} />}
      
      <form onSubmit={handleSubmit} className="mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {formMode === 'add' ? 'Add New Coupon' : 'Edit Coupon'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              name="code"
              value={formMode === 'add' ? newCoupon.code : editingCoupon?.code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Value
            </label>
            <input
              type="text"
              name="discount"
              value={formMode === 'add' ? newCoupon.discount : editingCoupon?.discount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formMode === 'add' ? newCoupon.expiryDate : editingCoupon?.expiryDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formMode === 'add' ? newCoupon.isActive : editingCoupon?.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active
            </label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formMode === 'add' ? newCoupon.description : editingCoupon?.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : formMode === 'add' ? 'Add Coupon' : 'Update Coupon'}
          </button>
          
          {formMode === 'edit' && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <h3 className="text-xl font-semibold mb-4">Coupon List</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  No coupons available
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {coupon.code}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {coupon.discount}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No expiry'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      className={`mr-2 px-2 py-1 rounded-md ${coupon.isActive ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                    >
                      {coupon.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded-md"
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
  );
};

export default CouponManager;