import { create } from 'zustand';
import * as THREE from 'three';

export interface DesignElement {
  id: string;
  type: 'frame' | 'shaft' | 'handle' | 'grip' | 'string' | 'decoration' | 'text' | 'image';
  name: string;
  color: string;
  texture?: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  visible: boolean;
  opacity: number;
}

export interface DesignData {
  id?: string;
  title: string;
  description: string;
  elements: DesignElement[];
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  backgroundColor: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EditorState {
  // Design data
  design: DesignData;
  selectedElementId: string | null;
  isDirty: boolean;
  isLoading: boolean;

  // 3D scene
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;

  // Actions
  setDesign: (design: Partial<DesignData>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  addElement: (element: DesignElement) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setScene: (scene: THREE.Scene) => void;
  setCamera: (camera: THREE.PerspectiveCamera) => void;
  setRenderer: (renderer: THREE.WebGLRenderer) => void;
  setLoading: (loading: boolean) => void;
  setDirty: (dirty: boolean) => void;
  resetDesign: () => void;
}

const defaultDesign: DesignData = {
  title: '未命名设计',
  description: '',
  elements: [
    {
      id: 'frame',
      type: 'frame',
      name: '拍框',
      color: '#ffffff',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      opacity: 1,
    },
    {
      id: 'shaft',
      type: 'shaft',
      name: '中杆',
      color: '#cccccc',
      position: { x: 0, y: -0.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      opacity: 1,
    },
    {
      id: 'handle',
      type: 'handle',
      name: '手柄',
      color: '#333333',
      position: { x: 0, y: -1.2, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      opacity: 1,
    },
    {
      id: 'grip',
      type: 'grip',
      name: '握把',
      color: '#666666',
      position: { x: 0, y: -1.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      opacity: 1,
    },
    {
      id: 'string',
      type: 'string',
      name: '拍线',
      color: '#ffffff',
      position: { x: 0, y: 0, z: 0.02 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      visible: true,
      opacity: 0.9,
    },
  ],
  cameraPosition: { x: 0, y: 0, z: 3 },
  cameraTarget: { x: 0, y: -0.5, z: 0 },
  backgroundColor: '#f0f0f0',
};

export const useEditorStore = create<EditorState>((set) => ({
  design: defaultDesign,
  selectedElementId: null,
  isDirty: false,
  isLoading: false,
  scene: null,
  camera: null,
  renderer: null,

  setDesign: (updates) =>
    set((state) => ({
      design: { ...state.design, ...updates },
      isDirty: true,
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      design: {
        ...state.design,
        elements: state.design.elements.map((el) =>
          el.id === id ? { ...el, ...updates } : el
        ),
      },
      isDirty: true,
    })),

  addElement: (element) =>
    set((state) => ({
      design: {
        ...state.design,
        elements: [...state.design.elements, element],
      },
      isDirty: true,
    })),

  removeElement: (id) =>
    set((state) => ({
      design: {
        ...state.design,
        elements: state.design.elements.filter((el) => el.id !== id),
      },
      selectedElementId:
        state.selectedElementId === id ? null : state.selectedElementId,
      isDirty: true,
    })),

  selectElement: (id) => set({ selectedElementId: id }),

  setScene: (scene) => set({ scene }),
  setCamera: (camera) => set({ camera }),
  setRenderer: (renderer) => set({ renderer }),
  setLoading: (loading) => set({ isLoading: loading }),
  setDirty: (dirty) => set({ isDirty: dirty }),

  resetDesign: () =>
    set({
      design: defaultDesign,
      selectedElementId: null,
      isDirty: false,
    }),
}));
