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
          <a
            href="/products/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Product
          </a>
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
      </div>
    </Navigation>
  );
}