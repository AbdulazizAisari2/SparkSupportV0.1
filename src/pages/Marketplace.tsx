import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShoppingCart, 
  Star, 
  Heart,
  Zap,
  Crown,
  Gift,
  Filter,
  Search,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import { GlassmorphismCard } from '../components/ui/GlassmorphismCard';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { PurchaseModal } from '../components/ui/PurchaseModal';
import { useMarketplaceItems, usePurchaseItem, type MarketplaceItem } from '../hooks/useMarketplace';

const categories = ['All', 'Audio', 'Smartphones', 'Gaming', 'Laptops', 'Wearables', 'Tablets'];

export const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Use the marketplace hook to get items
  const { data: marketplaceItems = [], isLoading, error } = useMarketplaceItems();
  const purchaseItemMutation = usePurchaseItem();

  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const handlePurchase = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;
    
    try {
      await purchaseItemMutation.mutateAsync({
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        pointsCost: selectedItem.price,
        category: selectedItem.category,
        vendor: 'SparkSupport Store'
      });
      setShowPurchaseModal(false);
      setSelectedItem(null);
    } catch (error) {
      // Error is already handled by the mutation's onError
    }
  };

  const MarketplaceCard: React.FC<{ item: MarketplaceItem; index: number }> = ({ item, index }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group h-full"
    >
      <GlassmorphismCard 
        variant={"intense" as const} 
        glow={item.popular || item.premium}
        className="h-full relative overflow-hidden"
      >
        {/* Special badges */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          {item.popular && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Popular</span>
            </motion.div>
          )}
          {item.premium && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1"
            >
              <Crown className="w-3 h-3" />
              <span>Premium</span>
            </motion.div>
          )}
          {item.new && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.7 }}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>New</span>
            </motion.div>
          )}
        </div>

        {/* Item image/icon */}
        <div className={`relative h-48 bg-gradient-to-br ${item.color} rounded-t-2xl -mx-6 -mt-6 mb-6 flex items-center justify-center overflow-hidden`}>
          <motion.div
            className="text-6xl"
            whileHover={{ scale: 1.2, rotate: 15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {item.image}
          </motion.div>
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
              {item.name}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {item.features.map((feature: string, featureIndex: number) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                className="flex items-center space-x-2 text-xs text-white/60"
              >
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(item.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white/70 text-sm">
                {item.rating} ({item.reviews})
              </span>
            </div>
          </div>

          {/* Price and Purchase */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-2xl font-bold text-white">
                  {item.price}
                </span>
              </div>
              <span className="text-white/60 text-xs">Points</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePurchase(item)}
              disabled={!user?.points || user.points < item.price || purchaseItemMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {purchaseItemMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Now</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </GlassmorphismCard>
    </motion.div>
  );

  // Loading state
  if (isLoading) {
    return (
      <AnimatedBackground variant="marketplace">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4"
            >
              <Gift className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading Marketplace...</h2>
            <p className="text-white/70">Preparing amazing deals for you</p>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  // Error state
  if (error) {
    return (
      <AnimatedBackground variant="marketplace">
        <div className="h-96 flex items-center justify-center">
          <GlassmorphismCard variant="intense" className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-bold text-white mb-4">Unable to Load Marketplace</h2>
            <p className="text-white/70 mb-4">
              We're having trouble loading the marketplace items. Please try again later.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
            >
              Try Again
            </motion.button>
          </GlassmorphismCard>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground variant="marketplace">
      <div className="marketplace-container min-h-screen pb-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative py-16 px-6 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-6"
            >
              <Gift className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Rewards Marketplace
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Redeem your earned support points for amazing tech products and gadgets
            </p>

            <GlassmorphismCard variant={"subtle" as const} className="inline-flex items-center space-x-4 px-6 py-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Your Balance:</span>
              <span className="text-2xl font-bold text-white">{user?.points || 0}</span>
              <span className="text-white/60">Points</span>
            </GlassmorphismCard>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-6 pb-32"
        >
          {/* Search and Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <GlassmorphismCard variant={"subtle" as const} className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search marketplace..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>

          {/* Items Grid */}
          <motion.div variants={itemVariants}>
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <GlassmorphismCard variant={"colorful" as const} size={"lg" as const} className="max-w-md mx-auto">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Search className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">No items found</h3>
                  <p className="text-white/70">
                    Try adjusting your search or filter criteria
                  </p>
                </GlassmorphismCard>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <MarketplaceCard key={item.id} item={item} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Purchase Modal */}
        {selectedItem && (
          <PurchaseModal
            isOpen={showPurchaseModal}
            onClose={() => {
              setShowPurchaseModal(false);
              setSelectedItem(null);
            }}
            onConfirm={handleConfirmPurchase}
            item={{
              id: selectedItem.id,
              name: selectedItem.name,
              description: selectedItem.description,
              points: selectedItem.price,
              category: selectedItem.category,
              rating: selectedItem.rating,
              image: selectedItem.image,
              vendor: 'SparkSupport Store'
            }}
            userPoints={user?.points || 0}
          />
        )}
      </div>
    </AnimatedBackground>
  );
};