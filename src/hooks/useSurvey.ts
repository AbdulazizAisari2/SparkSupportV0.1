import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface SurveyData {
  overallRating: number;
  responseTime: number;
  helpfulness: number;
  professionalism: number;
  resolutionQuality: number;
  feedback?: string;
  improvements?: string;
}

export interface Survey {
  id: string;
  ticketId: string;
  overallRating: number;
  responseTime: number;
  helpfulness: number;
  professionalism: number;
  resolutionQuality: number;
  averageRating: number;
  feedback?: string;
  improvements?: string;
  submittedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  ticket: {
    id: string;
    subject: string;
    status: string;
  };
}

// Create a new survey
export const useCreateSurvey = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: string; data: SurveyData }) => {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ ticketId, ...data })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit survey';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use default error message
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          return JSON.parse(text);
        }
        throw new Error('Empty response from server');
      } else {
        throw new Error('Invalid response format from server');
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['survey', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.ticketId] });
    }
  });
};

// Get survey for a specific ticket
export const useSurvey = (ticketId: string) => {
  return useQuery({
    queryKey: ['survey', ticketId],
    queryFn: async (): Promise<Survey | null> => {
      if (!ticketId) return null;
      
      const response = await fetch(`/api/surveys/ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.status === 404) {
        return null; // No survey found
      }

      if (!response.ok) {
        throw new Error('Failed to fetch survey');
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          return data.survey;
        }
        return null; // Empty response
      } else {
        throw new Error('Invalid response format from server');
      }
    },
    enabled: !!ticketId
  });
};

// Get all surveys (admin/staff only)
export const useSurveys = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ['surveys', page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/surveys?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }

      return response.json();
    }
  });
};