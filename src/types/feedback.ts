// Types for call completion and feedback functionality

export interface CallFeedback {
  id: string;
  callId: string;
  userId: string;
  wasResolved: boolean;
  rating?: number; // 1-5 stars (only if resolved)
  comment?: string; // Optional comment (if resolved)
  reopenReason?: string; // Required if not resolved
  createdAt: string;
  updatedAt: string;
}

export interface CreateCallFeedbackRequest {
  wasResolved: boolean;
  rating?: number;
  comment?: string;
  reopenReason?: string;
}

export interface CallCompletionRequest {
  callId: string;
  feedback: CreateCallFeedbackRequest;
}

export interface CallCompletionResponse {
  success: boolean;
  message: string;
  callStatus: 'closed' | 'reopened';
  feedback?: CallFeedback;
}

// Statistics for feedback analytics
export interface FeedbackStats {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  resolutionRate: number; // Percentage of calls marked as resolved
  reopenRate: number; // Percentage of calls reopened
  topReopenReasons: {
    reason: string;
    count: number;
  }[];
}

// For technician performance based on feedback
export interface TechnicianFeedbackStats {
  technicianId: string;
  technicianName: string;
  totalCallsWithFeedback: number;
  averageRating: number;
  resolutionRate: number;
  reopenRate: number;
  recentFeedbacks: CallFeedback[];
}