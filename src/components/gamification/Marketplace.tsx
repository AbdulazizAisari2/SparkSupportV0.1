import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Gift, 
  Star, 
  Zap, 
  Crown, 
  TrendingUp, 
  Filter,
  Search,
  Heart,
  Eye,
  Clock,
  Users,
  Award,
  Sparkles
} from 'lucide-react';

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'tech' | 'office' | 'food' | 'experience' | 'development' | 'premium';
  availability: 'unlimited' | 'limited' | 'exclusive';
  stockQuantity?: number;
  imageUrl: string;
  brand?: string;
  techSpecs?: string[];
  estimatedDelivery?: string;
  popularity: number; // 1-5 stars
  isNew?: boolean;
  isHot?: boolean;
  originalPrice?: number; // in points, for "discounts"
  tags: string[];
}

interface MarketplaceProps {
  userPoints: number;
  onPurchase: (item: MarketplaceItem) => void;
  onWishlist: (item: MarketplaceItem) => void;
}

const techItems: MarketplaceItem[] = [
  // 🍎 Apple Premium Tech
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2nd Gen',
    description: 'Active Noise Cancellation, Spatial Audio, Sweat and Water Resistant',
    pointsCost: 15000,
    category: 'tech',
    availability: 'limited',
    stockQuantity: 5,
    imageUrl: '/images/airpods-pro-2.jpg',
    brand: 'Apple',
    techSpecs: ['Active Noise Cancellation', 'Spatial Audio', 'Sweat Resistant', 'Up to 6 hours listening'],
    estimatedDelivery: '2-3 weeks',
    popularity: 5,
    isHot: true,
    tags: ['wireless', 'noise-cancelling', 'premium', 'apple']
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro 128GB',
    description: 'A17 Pro chip, 48MP camera, Titanium design, USB-C',
    pointsCost: 45000,
    category: 'tech',
    availability: 'exclusive',
    stockQuantity: 2,
    imageUrl: '/images/iphone-15-pro.jpg',
    brand: 'Apple',
    techSpecs: ['A17 Pro chip', '48MP camera', 'Titanium design', 'USB-C', '5G'],
    estimatedDelivery: '4-6 weeks',
    popularity: 5,
    isNew: true,
    tags: ['smartphone', 'premium', 'apple', '5g', 'camera']
  },
  {
    id: 'macbook-air-m2',
    name: 'MacBook Air M2 13" 256GB',
    description: 'M2 chip, 13.6" Liquid Retina display, up to 18 hours battery',
    pointsCost: 60000,
    category: 'tech',
    availability: 'exclusive',
    stockQuantity: 1,
    imageUrl: '/images/macbook-air-m2.jpg',
    brand: 'Apple',
    techSpecs: ['M2 chip', '13.6" Liquid Retina', '18 hours battery', '8GB RAM', '256GB SSD'],
    estimatedDelivery: '6-8 weeks',
    popularity: 5,
    tags: ['laptop', 'premium', 'apple', 'm2-chip', 'portable']
  },
  {
    id: 'ipad-air-5th',
    name: 'iPad Air 5th Gen 64GB',
    description: 'M1 chip, 10.9" Liquid Retina display, Apple Pencil support',
    pointsCost: 25000,
    category: 'tech',
    availability: 'limited',
    stockQuantity: 8,
    imageUrl: '/images/ipad-air-5th.jpg',
    brand: 'Apple',
    techSpecs: ['M1 chip', '10.9" Liquid Retina', 'Apple Pencil support', '5G optional', 'Touch ID'],
    estimatedDelivery: '2-3 weeks',
    popularity: 4,
    tags: ['tablet', 'premium', 'apple', 'm1-chip', 'pencil-support']
  },

  // 🎧 Premium Audio
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling, 30-hour battery, Premium comfort',
    pointsCost: 12000,
    category: 'tech',
    availability: 'limited',
    stockQuantity: 10,
    imageUrl: '/images/sony-wh1000xm5.jpg',
    brand: 'Sony',
    techSpecs: ['Industry-leading noise canceling', '30-hour battery', 'Premium comfort', 'LDAC support'],
    estimatedDelivery: '1-2 weeks',
    popularity: 5,
    tags: ['headphones', 'noise-cancelling', 'premium', 'sony', 'wireless']
  },
  {
    id: 'airpods-max',
    name: 'AirPods Max',
    description: 'High-fidelity audio, Active Noise Cancellation, Spatial audio',
    pointsCost: 20000,
    category: 'tech',
    availability: 'limited',
    stockQuantity: 3,
    imageUrl: '/images/airpods-max.jpg',
    brand: 'Apple',
    techSpecs: ['High-fidelity audio', 'Active Noise Cancellation', 'Spatial audio', '20-hour battery'],
    estimatedDelivery: '3-4 weeks',
    popularity: 4,
    tags: ['headphones', 'premium', 'apple', 'noise-cancelling', 'spatial-audio']
  },

  // 💻 Gaming & Entertainment
  {
    id: 'ps5-digital',
    name: 'PlayStation 5 Digital Edition',
    description: 'Next-gen gaming, 4K graphics, Ultra-high speed SSD',
    pointsCost: 35000,
    category: 'tech',
    availability: 'exclusive',
    stockQuantity: 1,
    imageUrl: '/images/ps5-digital.jpg',
    brand: 'Sony',
    techSpecs: ['4K graphics', 'Ultra-high speed SSD', 'DualSense controller', '3D audio'],
    estimatedDelivery: '8-10 weeks',
    popularity: 5,
    isHot: true,
    tags: ['gaming', 'console', 'premium', 'sony', '4k']
  },
  {
    id: 'nintendo-switch-oled',
    name: 'Nintendo Switch OLED',
    description: '7" OLED screen, Enhanced audio, 64GB internal storage',
    pointsCost: 18000,
    category: 'tech',
    availability: 'limited',
    stockQuantity: 6,
    imageUrl: '/images/nintendo-switch-oled.jpg',
    brand: 'Nintendo',
    techSpecs: ['7" OLED screen', 'Enhanced audio', '64GB storage', '6.2" LCD screen'],
    estimatedDelivery: '2-3 weeks',
    popularity: 4,
    tags: ['gaming', 'portable', 'nintendo', 'oled', 'hybrid']
  },

  // 📱 Smart Devices
  {
    id: 'apple-watch-series-9',
    name: 'Apple Watch Series 9 45mm',
    description: 'S9 chip, Always-On Retina display, Health monitoring',
    pointsCost: 22000,
    category: 'tech',
    availability: 'limited',
    stockQuantity: 7,
    imageUrl: '/images/apple-watch-series-9.jpg',
    brand: 'Apple',
    techSpecs: ['S9 chip', 'Always-On Retina', 'Health monitoring', 'GPS', 'Water resistant'],
    estimatedDelivery: '2-3 weeks',
    popularity: 4,
    tags: ['smartwatch', 'health', 'apple', 'gps', 'water-resistant']
  },
  {
    id: 'samsung-galaxy-tab-s9',
    name: 'Samsung Galaxy Tab S9 11" 128GB',
    description: 'Snapdragon 8 Gen 2, 11" Dynamic AMOLED 2X, S Pen included',
    pointsCost: 20000,
    category: 'tech',
    availability: 'limited',
    stockQuantity: 5,
    imageUrl: '/images/samsung-galaxy-tab-s9.jpg',
    brand: 'Samsung',
    techSpecs: ['Snapdragon 8 Gen 2', '11" Dynamic AMOLED 2X', 'S Pen included', '128GB storage'],
    estimatedDelivery: '2-3 weeks',
    popularity: 4,
    tags: ['tablet', 'android', 'samsung', 's-pen', 'amoled']
  },

  // 🎮 Accessories
  {
    id: 'apple-pencil-2nd',
    name: 'Apple Pencil 2nd Generation',
    description: 'Pixel-perfect precision, Pressure sensitivity, Wireless charging',
    pointsCost: 8000,
    category: 'tech',
    availability: 'unlimited',
    imageUrl: '/images/apple-pencil-2nd.jpg',
    brand: 'Apple',
    techSpecs: ['Pixel-perfect precision', 'Pressure sensitivity', 'Wireless charging', 'Magnetic attachment'],
    estimatedDelivery: '1 week',
    popularity: 4,
    tags: ['stylus', 'apple', 'precision', 'wireless-charging', 'ipad']
  },
  {
    id: 'logitech-mx-master-3s',
    name: 'Logitech MX Master 3S',
    description: '8000 DPI sensor, Silent clicks, MagSpeed scroll wheel',
    pointsCost: 6000,
    category: 'tech',
    availability: 'unlimited',
    imageUrl: '/images/logitech-mx-master-3s.jpg',
    brand: 'Logitech',
    techSpecs: ['8000 DPI sensor', 'Silent clicks', 'MagSpeed scroll wheel', '70-day battery'],
    estimatedDelivery: '1 week',
    popularity: 4,
    tags: ['mouse', 'wireless', 'logitech', 'precision', 'ergonomic']
  }
];

const officeItems: MarketplaceItem[] = [
  {
    id: 'standing-desk',
    name: 'Premium Standing Desk',
    description: 'Electric height adjustment, Memory presets, Cable management',
    pointsCost: 15000,
    category: 'office',
    availability: 'limited',
    stockQuantity: 3,
    imageUrl: '/images/standing-desk.jpg',
    brand: 'Ergonomic Pro',
    techSpecs: ['Electric height adjustment', 'Memory presets', 'Cable management', 'Weight capacity: 300lbs'],
    estimatedDelivery: '3-4 weeks',
    popularity: 4,
    tags: ['furniture', 'ergonomic', 'adjustable', 'premium']
  },
  {
    id: 'ergonomic-chair',
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support, Adjustable arms, Breathable mesh',
    pointsCost: 12000,
    category: 'office',
    availability: 'limited',
    stockQuantity: 5,
    imageUrl: '/images/ergonomic-chair.jpg',
    brand: 'Comfort Plus',
    techSpecs: ['Lumbar support', 'Adjustable arms', 'Breathable mesh', 'Weight capacity: 350lbs'],
    estimatedDelivery: '2-3 weeks',
    popularity: 4,
    tags: ['furniture', 'ergonomic', 'adjustable', 'comfort']
  }
];

const foodItems: MarketplaceItem[] = [
  {
    id: 'team-lunch',
    name: 'Team Lunch Experience',
    description: 'Premium restaurant meal for your team (up to 8 people)',
    pointsCost: 8000,
    category: 'food',
    availability: 'unlimited',
    imageUrl: '/images/team-lunch.jpg',
    brand: 'Local Partners',
    techSpecs: ['Up to 8 people', 'Premium restaurants', 'Flexible scheduling', 'Dietary accommodations'],
    estimatedDelivery: '1-2 days notice',
    popularity: 4,
    tags: ['team-building', 'food', 'experience', 'social']
  },
  {
    id: 'coffee-subscription',
    name: 'Premium Coffee Subscription',
    description: '3 months of premium coffee delivery to office',
    pointsCost: 5000,
    category: 'food',
    availability: 'unlimited',
    imageUrl: '/images/coffee-subscription.jpg',
    brand: 'Bean Masters',
    techSpecs: ['3 months subscription', 'Premium beans', 'Weekly delivery', 'Multiple roast options'],
    estimatedDelivery: '1 week',
    popularity: 4,
    tags: ['coffee', 'subscription', 'premium', 'delivery']
  }
];

const experienceItems: MarketplaceItem[] = [
  {
    id: 'conference-pass',
    name: 'Tech Conference Pass',
    description: 'Premium tech conference ticket with travel allowance',
    pointsCost: 25000,
    category: 'experience',
    availability: 'limited',
    stockQuantity: 2,
    imageUrl: '/images/conference-pass.jpg',
    brand: 'Tech Events',
    techSpecs: ['Conference ticket', 'Travel allowance', 'Networking events', 'Workshop access'],
    estimatedDelivery: '4-6 weeks',
    popularity: 5,
    tags: ['conference', 'networking', 'learning', 'travel']
  },
  {
    id: 'workshop-access',
    name: 'Premium Workshop Access',
    description: 'Access to exclusive skill-building workshops',
    pointsCost: 15000,
    category: 'experience',
    availability: 'limited',
    stockQuantity: 10,
    imageUrl: '/images/workshop-access.jpg',
    brand: 'Skill Academy',
    techSpecs: ['Workshop access', 'Materials included', 'Certificate', 'Expert instructors'],
    estimatedDelivery: '2-3 weeks',
    popularity: 4,
    tags: ['workshop', 'learning', 'skills', 'certification']
  }
];

const allItems = [...techItems, ...officeItems, ...foodItems, ...experienceItems];

export const Marketplace: React.FC<MarketplaceProps> = ({
  userPoints,
  onPurchase,
  onWishlist
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | MarketplaceItem['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'points' | 'newest'>('popularity');
  const [showWishlist, setShowWishlist] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', icon: Gift, count: allItems.length },
    { id: 'tech', name: 'Tech & Gadgets', icon: Zap, count: techItems.length },
    { id: 'office', name: 'Office & Furniture', icon: Users, count: officeItems.length },
    { id: 'food', name: 'Food & Drinks', icon: Award, count: foodItems.length },
    { id: 'experience', icon: Sparkles, name: 'Experiences', count: experienceItems.length }
  ];

  const filteredItems = allItems
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'points':
          return a.pointsCost - b.pointsCost;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

  const canAfford = (item: MarketplaceItem) => userPoints >= item.pointsCost;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🛒 Points Marketplace
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Spend your hard-earned points on amazing rewards
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full px-6 py-3 text-white font-bold text-lg">
                {userPoints.toLocaleString()} pts
              </div>
              <button
                onClick={() => setShowWishlist(!showWishlist)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Heart className="w-5 h-5" />
                <span>Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Category Tabs */}
            <div className="flex space-x-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <category.icon className="w-4 h-4 inline mr-2" />
                  {category.name}
                  <span className="ml-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popularity">Most Popular</option>
                <option value="points">Lowest Points</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Item Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="text-6xl">📱</div>
                {item.isNew && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                )}
                {item.isHot && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    HOT
                  </div>
                )}
                {item.availability === 'exclusive' && (
                  <div className="absolute bottom-3 left-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    EXCLUSIVE
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                      {item.name}
                    </h3>
                    {item.brand && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                        {item.brand}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Tech Specs */}
                {item.techSpecs && item.techSpecs.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Key Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.techSpecs.slice(0, 3).map((spec, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                      {item.techSpecs.length > 3 && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                          +{item.techSpecs.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.slice(0, 4).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {item.pointsCost.toLocaleString()} pts
                    </div>
                    {item.originalPrice && item.originalPrice > item.pointsCost && (
                      <div className="text-sm text-gray-500 line-through">
                        {item.originalPrice.toLocaleString()} pts
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onWishlist(item)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Add to wishlist"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onPurchase(item)}
                      disabled={!canAfford(item)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        canAfford(item)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford(item) ? 'Purchase' : 'Not Enough Points'}
                    </button>
                  </div>
                </div>

                {/* Availability Info */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{item.estimatedDelivery}</span>
                    </div>
                    {item.stockQuantity && (
                      <div className="flex items-center space-x-1">
                        <span className={`w-2 h-2 rounded-full ${
                          item.stockQuantity > 5 ? 'bg-green-500' : 
                          item.stockQuantity > 2 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        <span>{item.stockQuantity} left</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};