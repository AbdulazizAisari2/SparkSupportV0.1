import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

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
  const { token, refreshUser } = useAuth();
  
  return useMutation({
    mutationFn: async (purchaseData: PurchaseRequest) => {
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/marketplace/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
    onSuccess: async (data, variables) => {
      addToast(`Successfully purchased ${variables.itemName}!`, 'success');
      
      console.log('🛍️ Purchase successful, response data:', data);
      
      // Update user points immediately using the response data
      if (data.user && data.user.points !== undefined) {
        console.log(`💰 Refreshing user data - new points: ${data.user.points}`);
        // The backend response includes updated user data, so refresh from server
        await refreshUser();
      }
      
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
    onError: (error: Error) => {
      addToast(error.message, 'error');
    }
  });
};

// Get marketplace items (returning the old physical products marketplace)
export const useMarketplaceItems = () => {
  return useQuery({
    queryKey: ['marketplace', 'items'],
    queryFn: async (): Promise<MarketplaceItem[]> => {
      // Return the original marketplace items (physical products)
      return [
        {
          id: '1',
          name: 'Apple AirPods Pro (2nd Gen)',
          description: 'Premium wireless earbuds with active noise cancellation and spatial audio.',
          price: 2500,
          category: 'Audio',
          rating: 4.8,
          reviews: 1247,
          image: '🎧',
          popular: true,
          features: ['Active Noise Cancellation', 'Spatial Audio', 'Wireless Charging'],
          color: 'from-gray-600 to-slate-600'
        },
        {
          id: '2',
          name: 'iPhone 15 Pro',
          description: 'The most advanced iPhone with titanium design and A17 Pro chip.',
          price: 12000,
          category: 'Smartphones',
          rating: 4.9,
          reviews: 892,
          image: '📱',
          premium: true,
          features: ['A17 Pro Chip', 'Titanium Design', 'Pro Camera System'],
          color: 'from-blue-600 to-purple-600'
        },
        {
          id: '3',
          name: 'Sony PlayStation 5',
          description: 'Next-generation gaming console with incredible graphics and speed.',
          price: 5500,
          category: 'Gaming',
          rating: 4.7,
          reviews: 2156,
          image: '🎮',
          popular: true,
          features: ['4K Gaming', 'Ray Tracing', 'Ultra-Fast SSD'],
          color: 'from-indigo-600 to-blue-600'
        },
        {
          id: '4',
          name: 'MacBook Air M3',
          description: 'Incredibly thin and light laptop with M3 chip performance.',
          price: 15000,
          category: 'Laptops',
          rating: 4.8,
          reviews: 634,
          image: '💻',
          premium: true,
          features: ['M3 Chip', '15-hour Battery', 'Liquid Retina Display'],
          color: 'from-purple-600 to-pink-600'
        },
        {
          id: '5',
          name: 'Samsung Galaxy Watch 6',
          description: 'Advanced smartwatch with health monitoring and fitness tracking.',
          price: 3200,
          category: 'Wearables',
          rating: 4.5,
          reviews: 445,
          image: '⌚',
          features: ['Health Monitoring', 'GPS Tracking', 'Water Resistant'],
          color: 'from-green-600 to-emerald-600'
        },
        {
          id: '6',
          name: 'Nintendo Switch OLED',
          description: 'Hybrid gaming console with vibrant OLED screen.',
          price: 3800,
          category: 'Gaming',
          rating: 4.6,
          reviews: 1523,
          image: '🕹️',
          new: true,
          features: ['OLED Display', 'Portable Gaming', 'Exclusive Games'],
          color: 'from-red-600 to-orange-600'
        },
        {
          id: '7',
          name: 'iPad Pro 12.9"',
          description: 'Professional tablet with M2 chip and Liquid Retina XDR display.',
          price: 11000,
          category: 'Tablets',
          rating: 4.7,
          reviews: 789,
          image: '📱',
          features: ['M2 Chip', 'Liquid Retina XDR', 'Apple Pencil Support'],
          color: 'from-cyan-600 to-blue-600'
        },
        {
          id: '8',
          name: 'Bose QuietComfort Headphones',
          description: 'World-class noise cancelling wireless headphones.',
          price: 3500,
          category: 'Audio',
          rating: 4.6,
          reviews: 967,
          image: '🎧',
          features: ['Noise Cancelling', 'Wireless', '24-hour Battery'],
          color: 'from-yellow-600 to-orange-600'
        }
      ];
    }
  });
};

// Get user's purchase history (if we had this endpoint)
export const usePurchaseHistory = () => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['marketplace', 'purchases'],
    queryFn: async () => {
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('/api/marketplace/purchases', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch purchase history');
      }

      return response.json();
    }
  });
};