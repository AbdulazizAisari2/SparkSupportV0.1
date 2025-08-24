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
      const payload = { ticketId, ...data };
      const token = localStorage.getItem('accessToken');
      
      console.log('🚀 Sending survey request:', { payload, hasToken: !!token });
      
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📨 Survey response:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        let errorMessage = `Failed to submit survey (${response.status})`;
        try {
          const text = await response.text();
          if (text) {
            const errorData = JSON.parse(text);
            errorMessage = errorData.error || errorMessage;
          }
        } catch {
          // If parsing fails, use status-based error message
          errorMessage = response.status === 401 ? 'Authentication required' : 
                        response.status === 403 ? 'Permission denied' :
                        response.status === 404 ? 'Survey endpoint not found' :
                        errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Handle successful response
      try {
        const text = await response.text();
        if (!text) {
          throw new Error('Empty response from server');
        }
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse survey response:', parseError);
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
        throw new Error(`Failed to fetch survey (${response.status})`);
      }

      // Handle successful response
      try {
        const text = await response.text();
        if (!text) {
          return null; // Empty response, no survey found
        }
        const data = JSON.parse(text);
        return data.survey;
      } catch (parseError) {
        console.error('Failed to parse survey response:', parseError);
        return null; // Treat as no survey found
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