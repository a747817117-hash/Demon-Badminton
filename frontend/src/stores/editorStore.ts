import { create } from 'zustand';

export interface DesignElement {
  id: string;
  type: 'frame' | 'shaft' | 'handle';
  name: string;
  color: string;
  texture?: string;
  textureScale?: number;
  textureOffsetX?: number;
  textureOffsetY?: number;
  textureRotation?: number;
  visible: boolean;
  opacity: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface DesignData {
  id?: string;
  title: string;
  description: string;
  elements: DesignElement[];
  backgroundColor: string;
}

// 默认位置配置
const DEFAULT_POSITIONS: Record<string, { x: number; y: number; z: number }> = {
  frame_top: { x: 0, y: 0.65, z: 0 },
  frame_upper_left: { x: 0, y: 0.65, z: 0 },
  frame_upper_right: { x: 0, y: 0.65, z: 0 },
  frame_left: { x: 0, y: 0.65, z: 0 },
  frame_right: { x: 0, y: 0.65, z: 0 },
  frame_lower_left: { x: 0, y: 0.65, z: 0 },
  frame_lower_right: { x: 0, y: 0.65, z: 0 },
  frame_throat: { x: 0, y: 0.65, z: 0 },
  shaft: { x: 0, y: -0.25, z: 0 },
  handle: { x: 0, y: -1.05, z: 0 },
};

interface EditorState {
  design: DesignData;
  selectedElementId: string | null;
  isDirty: boolean;
  isLoading: boolean;
  setDesign: (design: Partial<DesignData>) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  selectElement: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  resetDesign: () => void;
  resetElementPosition: (id: string) => void;
}

// 创建默认的拍框部件
const createFrameElement = (id: string, name: string): DesignElement => ({
  id,
  type: 'frame',
  name,
  color: '#1a1a1a',
  texture: undefined,
  textureScale: 1,
  textureOffsetX: 0,
  textureOffsetY: 0,
  textureRotation: 0,
  visible: true,
  opacity: 1,
  positionX: DEFAULT_POSITIONS[id]?.x || 0,
  positionY: DEFAULT_POSITIONS[id]?.y || 0.65,
  positionZ: DEFAULT_POSITIONS[id]?.z || 0,
});

const defaultDesign: DesignData = {
  title: '我的球拍设计',
  description: '',
  elements: [
    createFrameElement('frame_top', '拍框-顶部'),
    createFrameElement('frame_upper_left', '拍框-左上'),
    createFrameElement('frame_upper_right', '拍框-右上'),
    createFrameElement('frame_left', '拍框-左侧'),
    createFrameElement('frame_right', '拍框-右侧'),
    createFrameElement('frame_lower_left', '拍框-左下'),
    createFrameElement('frame_lower_right', '拍框-右下'),
    createFrameElement('frame_throat', '拍框-喉部'),
    {
      id: 'shaft',
      type: 'shaft',
      name: '中杆',
      color: '#2d2d2d',
      texture: undefined,
      textureScale: 1,
      textureOffsetX: 0,
      textureOffsetY: 0,
      textureRotation: 0,
      visible: true,
      opacity: 1,
      positionX: 0,
      positionY: -0.25,
      positionZ: 0,
    },
    {
      id: 'handle',
      type: 'handle',
      name: '手柄',
      color: '#1a1a1a',
      texture: undefined,
      textureScale: 1,
      textureOffsetX: 0,
      textureOffsetY: 0,
      textureRotation: 0,
      visible: true,
      opacity: 1,
      positionX: 0,
      positionY: -1.05,
      positionZ: 0,
    },
  ],
  backgroundColor: '#f5f5f5',
};

export const useEditorStore = create<EditorState>((set) => ({
  design: defaultDesign,
  selectedElementId: null,
  isDirty: false,
  isLoading: false,

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

  selectElement: (id) => set({ selectedElementId: id }),
  setLoading: (loading) => set({ isLoading: loading }),

  resetDesign: () =>
    set({
      design: defaultDesign,
      selectedElementId: null,
      isDirty: false,
    }),

  resetElementPosition: (id) =>
    set((state) => ({
      design: {
        ...state.design,
        elements: state.design.elements.map((el) =>
          el.id === id
            ? {
                ...el,
                positionX: DEFAULT_POSITIONS[id]?.x || 0,
                positionY: DEFAULT_POSITIONS[id]?.y || 0,
                positionZ: DEFAULT_POSITIONS[id]?.z || 0,
              }
            : el
        ),
      },
      isDirty: true,
    })),
}));
