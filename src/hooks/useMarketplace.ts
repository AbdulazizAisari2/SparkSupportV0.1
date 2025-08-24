import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';

export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  popular?: boolean;
  premium?: boolean;
  new?: boolean;
  features: string[];
  color: string;
}

export interface PurchaseRequest {
  itemId: string;
  itemName: string;
  pointsCost: number;
  category?: string;
  vendor?: string;
}

// Purchase an item from marketplace
export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  return useMutation({
    mutationFn: async (purchaseData: PurchaseRequest) => {
      const response = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(purchaseData)
      });

      if (!response.ok) {
        let errorMessage = `Purchase failed (${response.status})`;
        try {
          const text = await response.text();
          if (text) {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          }
        } catch {
          errorMessage = response.status === 401 ? 'Authentication required' : 
                        response.status === 403 ? 'Insufficient points or permission denied' :
                        response.status === 404 ? 'Item not found' :
                        errorMessage;
        }
        throw new Error(errorMessage);
      }

      try {
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse purchase response:', parseError);
        throw new Error('Invalid response format from server');
      }
    },
    onSuccess: (data, variables) => {
      addToast(`Successfully purchased ${variables.itemName}!`, 'success');
      // Invalidate user data to refresh points
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
    onError: (error: Error) => {
      addToast(error.message, 'error');
    }
  });
};

// Get marketplace items (if we had a backend endpoint for this)
export const useMarketplaceItems = () => {
  return useQuery({
    queryKey: ['marketplace', 'items'],
    queryFn: async (): Promise<MarketplaceItem[]> => {
      // For now, return the mock data since there's no backend endpoint
      // In a real app, this would fetch from /api/marketplace/items
      return [
        {
          id: '1',
          name: 'Priority Support',
          description: 'Get your tickets resolved with priority handling and faster response times.',
          price: 50,
          category: 'Support',
          rating: 4.9,
          reviews: 234,
          image: '🚀',
          popular: true,
          features: ['24/7 Priority Support', 'Faster Response Time', 'Dedicated Agent'],
          color: 'from-blue-600 to-cyan-600'
        },
        {
          id: '2',
          name: 'Custom Avatar',
          description: 'Personalize your profile with unique avatars and badges.',
          price: 25,
          category: 'Customization',
          rating: 4.7,
          reviews: 156,
          image: '🎨',
          features: ['50+ Avatar Options', 'Custom Badges', 'Profile Themes'],
          color: 'from-purple-600 to-pink-600'
        },
        {
          id: '3',
          name: 'Advanced Analytics',
          description: 'Detailed insights into your support interactions and performance.',
          price: 75,
          category: 'Analytics',
          rating: 4.8,
          reviews: 89,
          image: '📊',
          features: ['Detailed Reports', 'Performance Metrics', 'Data Export'],
          color: 'from-green-600 to-blue-600'
        },
        {
          id: '4',
          name: 'VIP Status',
          description: 'Unlock exclusive features and premium support experience.',
          price: 100,
          category: 'Premium',
          rating: 5.0,
          reviews: 45,
          image: '👑',
          premium: true,
          features: ['All Premium Features', 'Exclusive Access', 'VIP Badge'],
          color: 'from-yellow-600 to-orange-600'
        },
        {
          id: '5',
          name: 'Team Collaboration',
          description: 'Enhanced team features for better collaboration and communication.',
          price: 60,
          category: 'Team',
          rating: 4.6,
          reviews: 178,
          image: '👥',
          features: ['Team Channels', 'File Sharing', 'Video Calls'],
          color: 'from-indigo-600 to-purple-600'
        },
        {
          id: '6',
          name: 'AI Assistant Pro',
          description: 'Advanced AI-powered assistance for instant support and solutions.',
          price: 80,
          category: 'AI',
          rating: 4.9,
          reviews: 267,
          image: '🤖',
          new: true,
          features: ['24/7 AI Support', 'Smart Suggestions', 'Auto-Resolution'],
          color: 'from-cyan-600 to-blue-600'
        }
      ];
    }
  });
};

// Get user's purchase history (if we had this endpoint)
export const usePurchaseHistory = () => {
  return useQuery({
    queryKey: ['marketplace', 'purchases'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/purchases', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch purchase history');
      }

      return response.json();
    }
  });
};