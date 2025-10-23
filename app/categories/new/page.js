'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';
import Navigation from '../../components/Navigation';

export default function NewCategoryPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Note: The swagger.yaml doesn't show a create endpoint for categories
      // This might need to be added to the API or handled differently
      await apiService.create('/categories', { name });
      router.push('/categories');
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navigation>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Category</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter category name"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </button>
            <a
              href="/categories"
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-center"
            >
              Cancel
            </a>
          </div>
        </form>
        </div>
      </div>
    </Navigation>
  );
}