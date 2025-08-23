import React, { useState } from 'react';
import { Search, Filter, Star, ShoppingCart, Package, Tag, Heart, Eye, Coins, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  points: number; // Changed from price to points
  category: string;
  rating: number;
  reviews: number;
  image: string;
  vendor: string;
  inStock: boolean;
  featured: boolean;
  originalPrice?: number; // Optional field to show original retail price for reference
}

// Mock marketplace data with entertainment/electronics items
const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation, Adaptive Transparency, Personalized Spatial Audio with dynamic head tracking.',
    points: 2500,
    category: 'Audio',
    rating: 4.8,
    reviews: 1247,
    image: '🎧',
    vendor: 'Apple',
    inStock: true,
    featured: true,
    originalPrice: 249
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and pro camera system.',
    points: 12000,
    category: 'Smartphones',
    rating: 4.9,
    reviews: 892,
    image: '📱',
    vendor: 'Apple',
    inStock: true,
    featured: true,
    originalPrice: 999
  },
  {
    id: '3',
    name: 'Sony PlayStation 5',
    description: 'Next-gen gaming console with ultra-high speed SSD and stunning 4K graphics.',
    points: 5500,
    category: 'Gaming',
    rating: 4.7,
    reviews: 2103,
    image: '🎮',
    vendor: 'Sony',
    inStock: true,
    featured: true,
    originalPrice: 499
  },
  {
    id: '4',
    name: 'MacBook Air M3',
    description: 'Supercharged by the M3 chip, up to 18 hours of battery life, and incredibly thin design.',
    points: 15000,
    category: 'Laptops',
    rating: 4.8,
    reviews: 567,
    image: '💻',
    vendor: 'Apple',
    inStock: true,
    featured: false,
    originalPrice: 1299
  },
  {
    id: '5',
    name: 'Samsung Galaxy Watch 6',
    description: 'Advanced health monitoring, sleep tracking, and seamless smartphone integration.',
    points: 3200,
    category: 'Wearables',
    rating: 4.6,
    reviews: 891,
    image: '⌚',
    vendor: 'Samsung',
    inStock: true,
    featured: false,
    originalPrice: 329
  },
  {
    id: '6',
    name: 'Nintendo Switch OLED',
    description: 'Vibrant 7-inch OLED screen, enhanced audio, and wide adjustable stand.',
    points: 3800,
    category: 'Gaming',
    rating: 4.7,
    reviews: 1534,
    image: '🕹️',
    vendor: 'Nintendo',
    inStock: false,
    featured: false,
    originalPrice: 349
  },
  {
    id: '7',
    name: 'iPad Pro 12.9"',
    description: 'M2 chip, Liquid Retina XDR display, and works with Apple Pencil.',
    points: 11000,
    category: 'Tablets',
    rating: 4.8,
    reviews: 423,
    image: '📲',
    vendor: 'Apple',
    inStock: true,
    featured: false,
    originalPrice: 1099
  },
  {
    id: '8',
    name: 'Bose QuietComfort Headphones',
    description: 'World-class noise cancellation, premium comfort, and crystal-clear calls.',
    points: 3500,
    category: 'Audio',
    rating: 4.6,
    reviews: 756,
    image: '🎵',
    vendor: 'Bose',
    inStock: true,
    featured: false,
    originalPrice: 349
  }
];

const categories = ['All', 'Audio', 'Smartphones', 'Gaming', 'Laptops', 'Wearables', 'Tablets'];

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Get user points from auth context, fallback to mock data for demo
  const userPoints = user?.points || 8500;

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

  const canAfford = (points: number) => userPoints >= points;

  const handlePurchase = async (item: MarketplaceItem) => {
    if (!canAfford(item.points) || !item.inStock) {
      return;
    }

    try {
      // In a real app, this would make an API call to process the purchase
      // For now, we'll just show a success message
      alert(`🎉 Successfully redeemed ${item.name} for ${item.points.toLocaleString()} points!`);
      
      // TODO: Update user points in backend and refresh auth context
      // await purchaseItem(item.id, item.points);
      
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    }
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

  const MarketplaceCard = ({ item }: { item: MarketplaceItem }) => {
    const affordable = canAfford(item.points);
    
    return (
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
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {item.points.toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
              {item.originalPrice && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  (${item.originalPrice} value)
                </div>
              )}
            </div>
          </div>

                     <button
             onClick={() => handlePurchase(item)}
             disabled={!item.inStock || !affordable}
             className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
               item.inStock && affordable
                 ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                 : !item.inStock
                 ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                 : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-not-allowed'
             }`}
           >
             <ShoppingCart className="w-5 h-5" />
             <span>
               {!item.inStock 
                 ? 'Out of Stock' 
                 : !affordable 
                 ? 'Insufficient Points' 
                 : 'Redeem with Points'
               }
             </span>
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Points Balance */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-lg">
              <Package className="w-8 h-8" />
            </div>
            <span>Points Marketplace</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Redeem your points for amazing electronics and entertainment products
          </p>
        </div>
        
        {/* Points Balance Card */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8" />
              <div>
                <div className="text-sm font-medium opacity-90">Your Points</div>
                <div className="text-3xl font-bold">{userPoints.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-75 mb-2">Earn more points</div>
              <button 
                onClick={() => window.location.href = '/staff/leaderboard'}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>View Leaderboard</span>
              </button>
            </div>
          </div>
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