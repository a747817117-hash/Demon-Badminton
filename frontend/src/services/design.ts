import api from './api';
import type { DesignData } from '../stores/editorStore';

export interface DesignListItem {
  id: string;
  title: string;
  description: string;
  cover: string;
  author: {
    id: string;
    nickname: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  likeCount: number;
  forkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DesignDetail extends DesignListItem {
  designData: DesignData;
  tags: string[];
  template?: string;
  isLiked: boolean;
}

export interface DesignListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DesignListItem[];
}

export const designService = {
  // Get list of designs
  getDesigns: (params?: {
    page?: number;
    status?: string;
    search?: string;
    ordering?: string;
  }) => {
    return api.get<DesignListResponse>('/designs/', { params });
  },

  // Get my designs
  getMyDesigns: (params?: { page?: number; status?: string }) => {
    return api.get<DesignListResponse>('/designs/my-designs/', { params });
  },

  // Get design detail
  getDesign: (id: string) => {
    return api.get<DesignDetail>(`/designs/${id}/`);
  },

  // Create new design
  createDesign: (data: {
    title: string;
    description?: string;
    designData: DesignData;
    status?: 'draft' | 'published';
  }) => {
    return api.post<DesignDetail>('/designs/', data);
  },

  // Update design
  updateDesign: (id: string, data: Partial<{
    title: string;
    description: string;
    designData: DesignData;
    status: 'draft' | 'published' | 'archived';
  }>) => {
    return api.put<DesignDetail>(`/designs/${id}/`, data);
  },

  // Delete design
  deleteDesign: (id: string) => {
    return api.delete(`/designs/${id}/`);
  },

  // Like design
  likeDesign: (id: string) => {
    return api.post(`/designs/${id}/like/`);
  },

  // Publish design
  publishDesign: (id: string) => {
    return api.post(`/designs/${id}/publish/`);
  },

  // Fork design (copy)
  forkDesign: (id: string) => {
    return api.post<DesignDetail>(`/designs/${id}/fork/`);
  },
};

export default designService;
