import React, { useState } from 'react';
import { Search, Filter, Star, ShoppingCart, Package, Tag, Heart, Eye } from 'lucide-react';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  vendor: string;
  inStock: boolean;
  featured: boolean;
}

// Mock marketplace data
const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Premium Support Plan',
    description: 'Enhanced support with priority response times and dedicated agent assignment.',
    price: 99.99,
    category: 'Support Plans',
    rating: 4.8,
    reviews: 127,
    image: '📞',
    vendor: 'SparkSupport Pro',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'AI Chat Integration',
    description: 'Advanced AI-powered chatbot integration for automated customer support.',
    price: 149.99,
    category: 'AI Tools',
    rating: 4.9,
    reviews: 89,
    image: '🤖',
    vendor: 'TechSolutions',
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Custom Dashboard Theme',
    description: 'Beautiful, customizable dashboard themes to match your brand identity.',
    price: 29.99,
    category: 'Themes',
    rating: 4.6,
    reviews: 203,
    image: '🎨',
    vendor: 'DesignHub',
    inStock: true,
    featured: false
  },
  {
    id: '4',
    name: 'Analytics Pro',
    description: 'Advanced analytics and reporting tools for detailed insights.',
    price: 79.99,
    category: 'Analytics',
    rating: 4.7,
    reviews: 156,
    image: '📊',
    vendor: 'DataViz Inc',
    inStock: true,
    featured: false
  },
  {
    id: '5',
    name: 'Multi-Language Pack',
    description: 'Support for 20+ languages with professional translations.',
    price: 39.99,
    category: 'Localization',
    rating: 4.5,
    reviews: 91,
    image: '🌍',
    vendor: 'GlobalLang',
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Mobile App Add-on',
    description: 'Native mobile application for iOS and Android platforms.',
    price: 199.99,
    category: 'Mobile',
    rating: 4.8,
    reviews: 74,
    image: '📱',
    vendor: 'MobileFirst',
    inStock: false,
    featured: true
  }
];

const categories = ['All', 'Support Plans', 'AI Tools', 'Themes', 'Analytics', 'Localization', 'Mobile'];

export const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredItems = filteredItems.filter(item => item.featured);
  const regularItems = filteredItems.filter(item => !item.featured);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const MarketplaceCard = ({ item }: { item: MarketplaceItem }) => (
    <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-dark-700/50 group hover:scale-105">
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
        <div className="flex items-start justify-between">
          <div className="text-4xl mb-4">{item.image}</div>
          <div className="flex space-x-2">
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full transition-all duration-200 ${
                favorites.includes(item.id)
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
                  : 'bg-white/50 dark:bg-dark-700/50 text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-white/50 dark:bg-dark-700/50 text-gray-400 hover:text-primary-500 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {item.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Featured
          </div>
        )}
        
        {!item.inStock && (
          <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center space-x-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-lg text-xs font-medium">
            <Tag className="w-3 h-3" />
            <span>{item.category}</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center space-x-4 mb-4">
          {renderStars(item.rating)}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({item.reviews} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">by {item.vendor}</span>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${item.price}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">one-time</div>
          </div>
        </div>

        <button
          disabled={!item.inStock}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            item.inStock
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-lg">
              <Package className="w-8 h-8" />
            </div>
            <span>Marketplace</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and purchase add-ons to enhance your support experience
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6 border border-gray-200/50 dark:border-dark-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 lg:flex-shrink-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors lg:flex-shrink-0"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600 dark:text-gray-400">
          Showing {filteredItems.length} of {mockItems.length} items
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center space-x-2">
            <Star className="w-6 h-6 text-yellow-500" />
            <span>Featured Items</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* All Items */}
      {regularItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            All Items
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularItems.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No items found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};