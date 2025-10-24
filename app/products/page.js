'use client';

import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Navigation from '../components/Navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [publishFilter, setPublishFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [meta, setMeta] = useState({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    name_cont: '',
    publish_eq: '',
    created_at_gteq: '',
    created_at_lteq: '',
    s: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, publishFilter, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: perPage
      };

      if (searchTerm) {
        params['q[name_cont]'] = searchTerm;
      }

      if (publishFilter !== '') {
        params['q[publish_eq]'] = publishFilter;
      }

      if (sortBy) {
        params['q[s]'] = sortBy;
      }

      const response = await apiService.getProducts(params);
      setProducts(response.data || []);
      setMeta(response.meta || {});
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await apiService.deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleTogglePublish = async (productId, currentPublish) => {
    const action = currentPublish ? 'unpublish' : 'publish';
    if (!confirm(`Are you sure you want to ${action} this product?`)) return;

    try {
      await apiService.updateProduct(productId, { publish: !currentPublish });
      fetchProducts();
    } catch (err) {
      setError(`Failed to ${action} product`);
    }
  };

  const handleExport = async () => {
    try {
      const params = {};
      if (exportFilters.name_cont) params['q[name_cont]'] = exportFilters.name_cont;
      if (exportFilters.publish_eq !== '') params['q[publish_eq]'] = exportFilters.publish_eq;
      if (exportFilters.created_at_gteq) params['q[created_at_gteq]'] = exportFilters.created_at_gteq;
      if (exportFilters.created_at_lteq) params['q[created_at_lteq]'] = exportFilters.created_at_lteq;
      if (exportFilters.s) params['q[s]'] = exportFilters.s;

      const blob = await apiService.exportProducts(params);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `products_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowExportModal(false);
    } catch (err) {
      setError('Failed to export products');
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Navigation>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Export Excel
            </button>
            <a
              href="/products/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Product
            </a>
          </div>
        </div>

      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Search
          </button>
        </form>

        <div className="flex gap-4">
          <select
            value={publishFilter}
            onChange={(e) => {
              setPublishFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Products</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sort by</option>
            <option value="name asc">Name A-Z</option>
            <option value="name desc">Name Z-A</option>
            <option value="created_at desc">Newest First</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.publish ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.publish ? 'Published' : 'Unpublished'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Category: {product.category?.name || 'N/A'} | Created: {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </a>
                  <a
                    href={`/products/${product.id}/edit`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleTogglePublish(product.id, product.publish)}
                    className={`hover:text-opacity-75 ${product.publish ? 'text-orange-600' : 'text-green-600'}`}
                  >
                    {product.publish ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {meta.total_page > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Page {meta.current_page || page} of {meta.total_page || 1}
            </span>
            <button
              onClick={() => setPage(Math.min(meta.total_page || 1, page + 1))}
              disabled={page === (meta.total_page || 1)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Products to Excel</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Search by Name</label>
                  <input
                    type="text"
                    value={exportFilters.name_cont}
                    onChange={(e) => setExportFilters({...exportFilters, name_cont: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Product name contains..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Publish Status</label>
                  <select
                    value={exportFilters.publish_eq}
                    onChange={(e) => setExportFilters({...exportFilters, publish_eq: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Products</option>
                    <option value="true">Published Only</option>
                    <option value="false">Unpublished Only</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created From</label>
                    <input
                      type="date"
                      value={exportFilters.created_at_gteq}
                      onChange={(e) => setExportFilters({...exportFilters, created_at_gteq: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created To</label>
                    <input
                      type="date"
                      value={exportFilters.created_at_lteq}
                      onChange={(e) => setExportFilters({...exportFilters, created_at_lteq: e.target.value})}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort By</label>
                  <select
                    value={exportFilters.s}
                    onChange={(e) => setExportFilters({...exportFilters, s: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Default</option>
                    <option value="name asc">Name A-Z</option>
                    <option value="name desc">Name Z-A</option>
                    <option value="created_at desc">Newest First</option>
                    <option value="created_at asc">Oldest First</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleExport}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Export
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </Navigation>
  );
}