import { useState, useCallback } from 'react';
import Scene from '../components/Editor3D/Scene';
import Toolbar from '../components/Editor3D/Toolbar';
import PropertiesPanel from '../components/Editor3D/PropertiesPanel';
import { useEditorStore } from '../stores/editorStore';
import { designService } from '../services/design';

export default function Editor() {
  const design = useEditorStore((state) => state.design);
  const setDirty = useEditorStore((state) => state.setDirty);
  const setLoading = useEditorStore((state) => state.setLoading);
  const setDesign = useEditorStore((state) => state.setDesign);
  const [isSaving, setIsSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setLoading(true);
    try {
      if (design.id) {
        // Update existing design
        await designService.updateDesign(design.id, {
          title: design.title,
          description: design.description,
          designData: design,
        });
      } else {
        // Create new design
        const result = await designService.createDesign({
          title: design.title,
          description: design.description,
          designData: design,
          status: 'draft',
        });
        setDesign({ id: result.id });
      }
      setDirty(false);
      alert('保存成功！');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  }, [design, setDirty, setLoading, setDesign]);

  const handleLoad = useCallback(() => {
    // TODO: Implement load design modal
    alert('加载功能开发中...');
  }, []);

  const handleExport = useCallback(() => {
    setShowExportModal(true);
  }, []);

  const handleUndo = useCallback(() => {
    // TODO: Implement undo functionality
    alert('撤销功能开发中...');
  }, []);

  const handleRedo = useCallback(() => {
    // TODO: Implement redo functionality
    alert('重做功能开发中...');
  }, []);

  const handleExportFormat = useCallback(
    (format: string) => {
      setShowExportModal(false);
      // TODO: Implement actual export logic
      alert(`导出为 ${format} 格式 - 功能开发中...`);
    },
    []
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <Toolbar
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <Scene className="w-full h-full" />

          {/* Viewport overlay info */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>3D 视口</span>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              拖拽旋转 | 滚轮缩放 | 右键平移
            </div>
          </div>

          {/* Quick actions */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button
              onClick={() => {
                const camera = useEditorStore.getState().camera;
                if (camera) {
                  camera.position.set(0, 0, 3);
                  camera.lookAt(0, -0.5, 0);
                }
              }}
              className="bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg text-sm shadow-sm"
            >
              正面视图
            </button>
            <button
              onClick={() => {
                const camera = useEditorStore.getState().camera;
                if (camera) {
                  camera.position.set(3, 0, 0);
                  camera.lookAt(0, -0.5, 0);
                }
              }}
              className="bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg text-sm shadow-sm"
            >
              侧面视图
            </button>
            <button
              onClick={() => {
                const camera = useEditorStore.getState().camera;
                if (camera) {
                  camera.position.set(0, 3, 0);
                  camera.lookAt(0, -0.5, 0);
                }
              }}
              className="bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg text-sm shadow-sm"
            >
              俯视图
            </button>
          </div>

          {/* Design info */}
          <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded-lg text-sm shadow-sm">
            <div className="text-gray-500">元素: {design.elements.length}</div>
            {design.id && (
              <div className="text-gray-400 text-xs mt-1">ID: {design.id.slice(0, 8)}...</div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <PropertiesPanel />
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">导出设计</h3>
            <p className="text-sm text-gray-500 mb-6">选择导出格式：</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { format: 'PNG', desc: '高清图片', icon: '🖼️' },
                { format: 'SVG', desc: '矢量图形', icon: '📐' },
                { format: 'PDF', desc: '打印文档', icon: '📄' },
                { format: 'GLTF', desc: '3D模型', icon: '🎮' },
              ].map((item) => (
                <button
                  key={item.format}
                  onClick={() => handleExportFormat(item.format)}
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <span className="font-medium text-gray-900">{item.format}</span>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save indicator */}
      {isSaving && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          保存中...
        </div>
      )}
    </div>
  );
}
