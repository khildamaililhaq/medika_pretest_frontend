'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '../../services/api';
import Navigation from '../../components/Navigation';

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    publish: false,
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const searchCategories = async () => {
      if (categorySearch.length >= 2) {
        setSearching(true);
        try {
          const response = await apiService.searchCategories(categorySearch);
          setFilteredCategories(response.data || []);
        } catch (error) {
          console.error('Error searching categories:', error);
          setFilteredCategories([]);
        } finally {
          setSearching(false);
        }
      } else if (categorySearch.length === 0) {
        setFilteredCategories(categories);
      }
    };

    const debounceTimer = setTimeout(searchCategories, 300);
    return () => clearTimeout(debounceTimer);
  }, [categorySearch, categories]);

  const fetchCategories = async () => {
    try {
      const response = await apiService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.createProduct(formData);
      router.push('/products');
    } catch (err) {
      setError('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navigation>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Product</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter product name"
            />
          </div>

          <div className="relative">
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category_search"
              placeholder="Search categories..."
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {searching ? (
                  <div className="py-2 px-3 text-sm text-gray-500">Searching...</div>
                ) : filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                      onClick={() => {
                        setFormData({ ...formData, category_id: category.id });
                        setCategorySearch(category.name);
                        setShowDropdown(false);
                      }}
                    >
                      <span className="block truncate">{category.name}</span>
                    </div>
                  ))
                ) : categorySearch.length >= 2 ? (
                  <div className="py-2 px-3 text-sm text-gray-500">No categories found</div>
                ) : (
                  categories.slice(0, 10).map((category) => (
                    <div
                      key={category.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                      onClick={() => {
                        setFormData({ ...formData, category_id: category.id });
                        setCategorySearch(category.name);
                        setShowDropdown(false);
                      }}
                    >
                      <span className="block truncate">{category.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
            {formData.category_id && !showDropdown && (
              <p className="mt-1 text-sm text-gray-500">
                Selected: {categories.find(c => c.id === formData.category_id)?.name}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="publish"
              name="publish"
              type="checkbox"
              checked={formData.publish}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="publish" className="ml-2 block text-sm text-gray-900">
              Publish product
            </label>
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
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <a
              href="/products"
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