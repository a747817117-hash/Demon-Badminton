import { useCallback } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import ColorPicker from './ColorPicker';

export default function PropertiesPanel() {
  const design = useEditorStore((state) => state.design);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const updateElement = useEditorStore((state) => state.updateElement);
  const selectElement = useEditorStore((state) => state.selectElement);

  const selectedElement = design.elements.find(
    (el) => el.id === selectedElementId
  );

  const handleColorChange = useCallback(
    (color: string) => {
      if (selectedElementId) {
        updateElement(selectedElementId, { color });
      }
    },
    [selectedElementId, updateElement]
  );

  const handleVisibilityToggle = useCallback(() => {
    if (selectedElementId) {
      const element = design.elements.find((el) => el.id === selectedElementId);
      if (element) {
        updateElement(selectedElementId, { visible: !element.visible });
      }
    }
  }, [selectedElementId, design.elements, updateElement]);

  const handleOpacityChange = useCallback(
    (opacity: number) => {
      if (selectedElementId) {
        updateElement(selectedElementId, { opacity });
      }
    },
    [selectedElementId, updateElement]
  );

  const handlePositionChange = useCallback(
    (axis: 'x' | 'y' | 'z', value: number) => {
      if (selectedElementId) {
        const element = design.elements.find((el) => el.id === selectedElementId);
        if (element) {
          updateElement(selectedElementId, {
            position: { ...element.position, [axis]: value },
          });
        }
      }
    },
    [selectedElementId, design.elements, updateElement]
  );

  const handleRotationChange = useCallback(
    (axis: 'x' | 'y' | 'z', value: number) => {
      if (selectedElementId) {
        const element = design.elements.find((el) => el.id === selectedElementId);
        if (element) {
          updateElement(selectedElementId, {
            rotation: { ...element.rotation, [axis]: value },
          });
        }
      }
    },
    [selectedElementId, design.elements, updateElement]
  );

  const handleScaleChange = useCallback(
    (axis: 'x' | 'y' | 'z', value: number) => {
      if (selectedElementId) {
        const element = design.elements.find((el) => el.id === selectedElementId);
        if (element) {
          updateElement(selectedElementId, {
            scale: { ...element.scale, [axis]: value },
          });
        }
      }
    },
    [selectedElementId, design.elements, updateElement]
  );

  const handleDeselect = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  if (!selectedElement) {
    return (
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">点击球拍部件进行编辑</p>
          <p className="text-xs mt-1">选择后可修改颜色、位置等属性</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedElement.name}
          </h3>
          <button
            onClick={handleDeselect}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          类型: {selectedElement.type}
        </p>
      </div>

      {/* Color section */}
      <div className="p-4 border-b border-gray-200">
        <ColorPicker
          elementId={selectedElement.id}
          currentColor={selectedElement.color}
          onColorChange={handleColorChange}
        />
      </div>

      {/* Visibility & Opacity */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">可见性</label>
          <button
            onClick={handleVisibilityToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              selectedElement.visible ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                selectedElement.visible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            透明度: {Math.round(selectedElement.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedElement.opacity}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Position */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">位置</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis}>
              <label className="text-xs text-gray-500 block mb-1">
                {axis.toUpperCase()}
              </label>
              <input
                type="number"
                step="0.1"
                value={selectedElement.position[axis]}
                onChange={(e) =>
                  handlePositionChange(axis, parseFloat(e.target.value) || 0)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">旋转</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis}>
              <label className="text-xs text-gray-500 block mb-1">
                {axis.toUpperCase()} (°)
              </label>
              <input
                type="number"
                step="1"
                value={Math.round((selectedElement.rotation[axis] * 180) / Math.PI)}
                onChange={(e) =>
                  handleRotationChange(
                    axis,
                    ((parseFloat(e.target.value) || 0) * Math.PI) / 180
                  )
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">缩放</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis}>
              <label className="text-xs text-gray-500 block mb-1">
                {axis.toUpperCase()}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={selectedElement.scale[axis]}
                onChange={(e) =>
                  handleScaleChange(axis, parseFloat(e.target.value) || 1)
                }
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
