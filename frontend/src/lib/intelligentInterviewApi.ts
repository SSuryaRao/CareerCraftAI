import { apiClient } from './apiInterceptor';

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:5000/api';

export interface Domain {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  levels: string[];
  questionAreas: string[];
}

export interface Question {
  questionText: string;
  difficulty: string;
  category: string;
  keywords: string[];
  domainId: string;
  domainName: string;
  level: string;
}

export interface SessionData {
  sessionId: string;
  domainId: string;
  domain: string;
  level: string;
  analysisMode: 'standard' | 'advanced';
  totalQuestions: number;
  questions: Question[];
  createdAt: string;
}

export interface AnalysisResult {
  mode: 'standard' | 'advanced';
  score: number;
  scoreBreakdown?: {
    content: number;
    delivery: number;
    bodyLanguage: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    technicalAccuracy: number;
    clarity: number;
    relevance: number;
  };
  domainSpecificInsights: string;
  speechAnalysis?: {
    wordsPerMinute: number;
    fillerWordCount: number;
    fillerWordPercentage: number;
    confidence: number;
    recommendations: string[];
  };
  bodyLanguageAnalysis?: {
    eyeContact: string;
    bodyMovement: string;
    overallPresence: string;
    recommendations: string[];
  };
  transcription?: {
    text: string;
    confidence: number;
    wordCount: number;
    duration: number;
  };
  overallAssessment: string;
  timestamp: string;
}

export interface Answer {
  question: string;
  questionData: Question;
  answer?: string;
  transcription?: {
    text: string;
    confidence: number;
    wordCount: number;
    duration: number;
  };
  analysis: AnalysisResult;
  timestamp: string;
}

export interface SessionSummary {
  id: string;
  domain: string;
  domainId: string;
  level: string;
  analysisMode: string;
  questionsAnswered: number;
  totalQuestions: number;
  averageScore: number;
  completedAt: string;
}

class IntelligentInterviewApi {
  /**
   * Get all available domains
   */
  async getDomains(category?: string): Promise<{
    domains: Domain[];
    categories: { key: string; label: string }[];
  }> {
    const response = await apiClient.get(`${API_URL}/intelligent-interview/domains`, {
      params: { category }
    });
    return response.data.data;
  }

  /**
   * Get domain details by ID
   */
  async getDomainDetails(domainId: string): Promise<Domain> {
    const response = await apiClient.get(`${API_URL}/intelligent-interview/domains/${domainId}`);
    return response.data.data;
  }

  /**
   * Generate interview questions
   */
  async generateQuestions(
    domainId: string,
    level: string,
    count: number = 5
  ): Promise<Question[]> {
    const response = await apiClient.post(`${API_URL}/intelligent-interview/generate-questions`, {
      domainId,
      level,
      count
    });
    return response.data.data.questions;
  }

  /**
   * Start a new interview session
   */
  async startSession(
    userId: string,
    domainId: string,
    level: string,
    questionCount: number = 5,
    analysisMode: 'standard' | 'advanced' = 'standard',
    token?: string
  ): Promise<SessionData> {
    const response = await apiClient.post(`${API_URL}/intelligent-interview/session/start`, {
      userId,
      domainId,
      level,
      questionCount,
      analysisMode
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data.data;
  }

  /**
   * Analyze response - Standard mode (text only)
   */
  async analyzeResponseStandard(
    questionText: string,
    responseText: string,
    domainId: string,
    level: string,
    expectedKeywords?: string[]
  ): Promise<AnalysisResult> {
    const response = await apiClient.post(`${API_URL}/intelligent-interview/analyze/standard`, {
      questionText,
      responseText,
      domainId,
      level,
      expectedKeywords
    });
    return response.data.data;
  }

  /**
   * Analyze response - Advanced mode (with audio/video)
   */
  async analyzeResponseAdvanced(
    questionText: string,
    audioBlob: Blob,
    videoBlob: Blob | null,
    domainId: string,
    level: string,
    userId: string,
    sessionId: string,
    expectedKeywords?: string[],
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('questionText', questionText);
    formData.append('domainId', domainId);
    formData.append('level', level);
    formData.append('userId', userId);
    formData.append('sessionId', sessionId);

    if (expectedKeywords) {
      formData.append('expectedKeywords', JSON.stringify(expectedKeywords));
    }

    formData.append('audio', audioBlob, 'audio.webm');

    if (videoBlob) {
      formData.append('video', videoBlob, 'video.webm');
    }

    const response = await apiClient.post(
      `${API_URL}/intelligent-interview/analyze/advanced`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
      }
    );

    return response.data.data;
  }

  /**
   * Save completed session
   */
  async saveSession(
    userId: string,
    sessionData: SessionData,
    answers: Answer[]
  ): Promise<{
    sessionId: string;
    averageScore: number;
    stats: any;
  }> {
    const response = await apiClient.post(`${API_URL}/intelligent-interview/session/save`, {
      userId,
      sessionData,
      answers
    });
    return response.data.data;
  }

  /**
   * Get user's session history
   */
  async getSessionHistory(userId: string, limit: number = 10): Promise<{
    sessions: SessionSummary[];
    total: number;
  }> {
    const response = await apiClient.get(
      `${API_URL}/intelligent-interview/session/history/${userId}`,
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Get session details
   */
  async getSessionDetails(userId: string, sessionId: string): Promise<any> {
    const response = await apiClient.get(
      `${API_URL}/intelligent-interview/session/${userId}/${sessionId}`
    );
    return response.data.data;
  }
}

export const intelligentInterviewApi = new IntelligentInterviewApi();
