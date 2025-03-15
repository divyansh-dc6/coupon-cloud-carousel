import React, { useState, useEffect } from 'react';
import { getClaimHistory } from '../../services/couponService';
import Loading from '../Common/Loading';
import Error from '../Common/Error';

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    couponCode: '',
    dateRange: {
      start: '',
      end: ''
    },
    ip: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'claimedAt',
    direction: 'desc'
  });

  // Fetch claim history on component mount
  useEffect(() => {
    fetchClaimHistory();
  }, []);

  const fetchClaimHistory = async () => {
    try {
      setLoading(true);
      const claimData = await getClaimHistory();
      setClaims(claimData);
      setError(null);
    } catch (err) {
      console.error('Error fetching claim history:', err);
      setError('Failed to load claim history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      couponCode: '',
      dateRange: {
        start: '',
        end: ''
      },
      ip: ''
    });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting to claims
  const getFilteredClaims = () => {
    let filteredData = [...claims];
    
    // Apply coupon code filter
    if (filters.couponCode) {
      filteredData = filteredData.filter(claim => 
        claim.couponCode.toLowerCase().includes(filters.couponCode.toLowerCase())
      );
    }
    
    // Apply IP filter
    if (filters.ip) {
      filteredData = filteredData.filter(claim => 
        claim.ipAddress.includes(filters.ip)
      );
    }
    
    // Apply date range filter
    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start);
      filteredData = filteredData.filter(claim => 
        new Date(claim.claimedAt) >= startDate
      );
    }
    
    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      // Set time to end of day for inclusive filtering
      endDate.setHours(23, 59, 59, 999);
      filteredData = filteredData.filter(claim => 
        new Date(claim.claimedAt) <= endDate
      );
    }
    
    // Apply sorting
    filteredData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return filteredData;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading && claims.length === 0) {
    return <Loading />;
  }

  const filteredClaims = getFilteredClaims();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Coupon Claim History</h2>
      
      {error && <Error message={error} />}
      
      {/* Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              name="couponCode"
              value={filters.couponCode}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Filter by code"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IP Address
            </label>
            <input
              type="text"
              name="ip"
              value={filters.ip}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Filter by IP"
            />
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="dateRange.start"
                value={filters.dateRange.start}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                name="dateRange.end"
                value={filters.dateRange.end}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Claims Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('claimedAt')}
              >
                <div className="flex items-center">
                  Date/Time {getSortIcon('claimedAt')}
                </div>
              </th>
              <th 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('couponCode')}
              >
                <div className="flex items-center">
                  Coupon {getSortIcon('couponCode')}
                </div>
              </th>
              <th 
                className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('ipAddress')}
              >
                <div className="flex items-center">
                  IP Address {getSortIcon('ipAddress')}
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Browser Session
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Agent
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClaims.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  No claim history found
                </td>
              </tr>
            ) : (
              filteredClaims.map((claim) => (
                <tr key={claim.id}>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {formatDate(claim.claimedAt)}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-medium">{claim.couponCode}</span>
                    {claim.discount && <span className="ml-2 text-gray-500">({claim.discount})</span>}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-sm">
                    {claim.ipAddress}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm truncate max-w-xs">
                    {claim.sessionId || 'Not tracked'}
                  </td>
                  <td className="py-3 px-4 text-sm truncate max-w-xs">
                    <div className="tooltip" title={claim.userAgent}>
                      {claim.userAgent ? (
                        claim.userAgent.substring(0, 30) + (claim.userAgent.length > 30 ? '...' : '')
                      ) : (
                        'Not tracked'
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Results summary */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredClaims.length} of {claims.length} claim records
      </div>
    </div>
  );
};

export default ClaimHistory;