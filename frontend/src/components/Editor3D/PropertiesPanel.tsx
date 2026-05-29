import { useCallback, useRef } from 'react';
import { useEditorStore } from '../../stores/editorStore';

// 预设贴图
const PRESET_TEXTURES = [
  { name: '碳纤维', url: '/textures/carbon-fiber.jpg' },
  { name: '木纹', url: '/textures/wood.jpg' },
  { name: '迷彩', url: '/textures/camo.jpg' },
  { name: '渐变', url: '/textures/gradient.jpg' },
];

export default function PropertiesPanel() {
  const design = useEditorStore((state) => state.design);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const updateElement = useEditorStore((state) => state.updateElement);
  const selectElement = useEditorStore((state) => state.selectElement);
  const resetElementPosition = useEditorStore((state) => state.resetElementPosition);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = design.elements.find(
    (el) => el.id === selectedElementId
  );

  const handleDeselect = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  // 上传贴图
  const handleTextureUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedElementId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      updateElement(selectedElementId, { texture: url });
    };
    reader.readAsDataURL(file);
  }, [selectedElementId, updateElement]);

  // 移除贴图
  const handleRemoveTexture = useCallback(() => {
    if (!selectedElementId) return;
    updateElement(selectedElementId, { 
      texture: undefined,
      textureScale: 1,
      textureOffsetX: 0,
      textureOffsetY: 0,
      textureRotation: 0,
    });
  }, [selectedElementId, updateElement]);

  if (!selectedElement) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">选择部件</h3>
        <p className="text-sm text-gray-500">
          点击左侧部件列表或直接点击3D模型上的部件进行编辑
        </p>
      </div>
    );
  }

  return (
    <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
      {/* 头部 */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border-2 border-white shadow-md"
              style={{ backgroundColor: selectedElement.color }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{selectedElement.name}</h3>
              <p className="text-xs text-gray-500">{selectedElement.type}</p>
            </div>
          </div>
          <button
            onClick={handleDeselect}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 可见性 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">显示部件</span>
          <button
            onClick={() => updateElement(selectedElementId!, { visible: !selectedElement.visible })}
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
      </div>

      {/* 位置调整 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">位置</h4>
          <button
            onClick={() => resetElementPosition(selectedElementId!)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            归位
          </button>
        </div>
        
        {/* X 轴 */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <label className="w-6 text-xs font-bold text-red-500">X</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.01"
              value={selectedElement.positionX}
              onChange={(e) => updateElement(selectedElementId!, { positionX: parseFloat(e.target.value) })}
              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <input
              type="number"
              step="0.1"
              value={selectedElement.positionX}
              onChange={(e) => updateElement(selectedElementId!, { positionX: parseFloat(e.target.value) || 0 })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center font-mono"
            />
          </div>
        </div>

        {/* Y 轴 */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <label className="w-6 text-xs font-bold text-green-500">Y</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.01"
              value={selectedElement.positionY}
              onChange={(e) => updateElement(selectedElementId!, { positionY: parseFloat(e.target.value) })}
              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <input
              type="number"
              step="0.1"
              value={selectedElement.positionY}
              onChange={(e) => updateElement(selectedElementId!, { positionY: parseFloat(e.target.value) || 0 })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center font-mono"
            />
          </div>
        </div>

        {/* Z 轴 */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            <label className="w-6 text-xs font-bold text-blue-500">Z</label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.01"
              value={selectedElement.positionZ}
              onChange={(e) => updateElement(selectedElementId!, { positionZ: parseFloat(e.target.value) })}
              className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <input
              type="number"
              step="0.1"
              value={selectedElement.positionZ}
              onChange={(e) => updateElement(selectedElementId!, { positionZ: parseFloat(e.target.value) || 0 })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center font-mono"
            />
          </div>
        </div>
      </div>

      {/* 颜色 */}
      <div className="p-4 border-b">
        <h4 className="text-sm font-medium text-gray-700 mb-3">颜色</h4>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={selectedElement.color}
            onChange={(e) => updateElement(selectedElementId!, { color: e.target.value })}
            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
          />
          <input
            type="text"
            value={selectedElement.color}
            onChange={(e) => {
              if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                updateElement(selectedElementId!, { color: e.target.value });
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* 贴图 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">贴图</h4>
          {selectedElement.texture && (
            <button
              onClick={handleRemoveTexture}
              className="text-xs text-red-500 hover:text-red-700"
            >
              移除贴图
            </button>
          )}
        </div>

        {/* 贴图预览 */}
        {selectedElement.texture ? (
          <div className="mb-3">
            <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100 border">
              <img
                src={selectedElement.texture}
                alt="贴图预览"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="mb-3 w-full h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
            暂无贴图
          </div>
        )}

        {/* 上传按钮 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleTextureUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          上传贴图
        </button>

        {/* 预设贴图 */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">预设贴图</p>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_TEXTURES.map((tex) => (
              <button
                key={tex.name}
                onClick={() => updateElement(selectedElementId!, { texture: tex.url })}
                className="aspect-square rounded-lg bg-gray-100 border hover:border-blue-500 transition-colors flex items-center justify-center"
                title={tex.name}
              >
                <span className="text-xs text-gray-500">{tex.name.slice(0, 2)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 贴图调整 */}
      {selectedElement.texture && (
        <div className="p-4 border-b">
          <h4 className="text-sm font-medium text-gray-700 mb-3">贴图调整</h4>
          
          {/* 缩放 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">
              缩放: {(selectedElement.textureScale || 1).toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={selectedElement.textureScale || 1}
              onChange={(e) => updateElement(selectedElementId!, { textureScale: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* X 偏移 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">
              X 偏移: {(selectedElement.textureOffsetX || 0).toFixed(2)}
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={selectedElement.textureOffsetX || 0}
              onChange={(e) => updateElement(selectedElementId!, { textureOffsetX: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Y 偏移 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">
              Y 偏移: {(selectedElement.textureOffsetY || 0).toFixed(2)}
            </label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={selectedElement.textureOffsetY || 0}
              onChange={(e) => updateElement(selectedElementId!, { textureOffsetY: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* 旋转 */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 block mb-1">
              旋转: {Math.round(((selectedElement.textureRotation || 0) * 180) / Math.PI)}°
            </label>
            <input
              type="range"
              min="0"
              max={String(Math.PI * 2)}
              step="0.1"
              value={selectedElement.textureRotation || 0}
              onChange={(e) => updateElement(selectedElementId!, { textureRotation: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* 透明度 */}
      <div className="p-4">
        <label className="text-sm font-medium text-gray-700 block mb-3">
          透明度: {Math.round(selectedElement.opacity * 100)}%
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">0%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedElement.opacity}
            onChange={(e) => updateElement(selectedElementId!, { opacity: parseFloat(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-xs text-gray-400">100%</span>
        </div>
      </div>
    </div>
  );
}
