import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Scene from '../components/Editor3D/Scene';
import PropertiesPanel from '../components/Editor3D/PropertiesPanel';
import { useEditorStore } from '../stores/editorStore';
import { designService } from '../services/design';

const PRESET_COLORS = [
  { name: '经典白', color: '#ffffff' },
  { name: '酷炫黑', color: '#1a1a1a' },
  { name: '火焰红', color: '#e53e3e' },
  { name: '皇家蓝', color: '#3182ce' },
  { name: '活力橙', color: '#dd6b20' },
  { name: '森林绿', color: '#38a163' },
  { name: '神秘紫', color: '#805ad5' },
  { name: '樱花粉', color: '#d53f8c' },
  { name: '柠檬黄', color: '#d69e2e' },
  { name: '星空灰', color: '#718096' },
];

const QUICK_STYLES = [
  { name: '专业竞技', colors: ['#1a1a1a', '#e53e3e', '#ffffff'] },
  { name: '清新活力', colors: ['#38a163', '#d69e2e', '#ffffff'] },
  { name: '经典配色', colors: ['#3182ce', '#ffffff', '#1a1a1a'] },
  { name: '炫彩个性', colors: ['#805ad5', '#d53f8c', '#dd6b20'] },
];

export default function Editor() {
  const design = useEditorStore((state) => state.design);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const updateElement = useEditorStore((state) => state.updateElement);
  const selectElement = useEditorStore((state) => state.selectElement);
  const setDesign = useEditorStore((state) => state.setDesign);
  const [isSaving, setIsSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCourt, setShowCourt] = useState(false);

  const selectedElement = design.elements.find(el => el.id === selectedElementId);

  // 获取部件颜色的辅助函数
  const getElementColor = useCallback((id: string) => {
    const el = design.elements.find(e => e.id === id);
    return el?.color || '#cccccc';
  }, [design.elements]);

  const handleQuickColor = useCallback((color: string) => {
    if (selectedElementId) {
      updateElement(selectedElementId, { color });
    }
  }, [selectedElementId, updateElement]);

  const handleQuickStyle = useCallback((colors: string[]) => {
    // 应用到所有拍框段
    const frameIds = [
      'frame_top', 'frame_upper_left', 'frame_upper_right',
      'frame_left', 'frame_right',
      'frame_lower_left', 'frame_lower_right', 'frame_throat'
    ];
    
    // 拍框颜色
    frameIds.forEach(id => {
      updateElement(id, { color: colors[0] });
    });
    // 中杆颜色
    updateElement('shaft', { color: colors[1] || colors[0] });
    // 手柄颜色
    updateElement('handle', { color: colors[2] || colors[0] });
  }, [updateElement]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      if (design.id) {
        await designService.updateDesign(design.id, {
          title: design.title,
          description: design.description,
          designData: design,
        });
      } else {
        const result = await designService.createDesign({
          title: design.title,
          description: design.description,
          designData: design,
          status: 'draft',
        });
        setDesign({ id: result.id });
      }
      alert('保存成功！');
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存失败');
    } finally {
      setIsSaving(false);
    }
  }, [design, setDesign]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-semibold text-gray-900">Demon Badminton</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <input
              type="text"
              value={design.title}
              onChange={(e) => setDesign({ title: e.target.value })}
              className="text-lg font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              placeholder="设计名称"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              保存
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              导出
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧工具栏 */}
        <div className="w-72 bg-white border-r overflow-y-auto">
          {/* 拍框可视化选择器 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">球拍部件</h3>
            
            {/* 拍框图示 */}
            <div className="relative w-48 h-64 mx-auto mb-4">
              <svg viewBox="0 0 200 280" className="w-full h-full">
                {/* 拍框外框 */}
                <ellipse cx="100" cy="90" rx="70" ry="85" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                
                {/* 拍框各段 - 可点击 */}
                {/* 顶部 */}
                <path 
                  d="M 60 20 A 70 85 0 0 1 140 20" 
                  fill={getElementColor('frame_top')}
                  stroke={selectedElementId === 'frame_top' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_top')}
                />
                {/* 右上 */}
                <path 
                  d="M 140 20 A 70 85 0 0 1 170 90" 
                  fill={getElementColor('frame_upper_right')}
                  stroke={selectedElementId === 'frame_upper_right' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_upper_right')}
                />
                {/* 右侧 */}
                <path 
                  d="M 170 90 A 70 85 0 0 1 140 160" 
                  fill={getElementColor('frame_right')}
                  stroke={selectedElementId === 'frame_right' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_right')}
                />
                {/* 右下 */}
                <path 
                  d="M 140 160 A 70 85 0 0 1 100 175" 
                  fill={getElementColor('frame_lower_right')}
                  stroke={selectedElementId === 'frame_lower_right' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_lower_right')}
                />
                {/* 喉部 */}
                <path 
                  d="M 100 175 A 70 85 0 0 1 60 160" 
                  fill={getElementColor('frame_throat')}
                  stroke={selectedElementId === 'frame_throat' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_throat')}
                />
                {/* 左下 */}
                <path 
                  d="M 60 160 A 70 85 0 0 1 30 90" 
                  fill={getElementColor('frame_lower_left')}
                  stroke={selectedElementId === 'frame_lower_left' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_lower_left')}
                />
                {/* 左侧 */}
                <path 
                  d="M 30 90 A 70 85 0 0 1 60 20" 
                  fill={getElementColor('frame_left')}
                  stroke={selectedElementId === 'frame_left' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_left')}
                />
                {/* 左上 */}
                <path 
                  d="M 60 20 A 70 85 0 0 0 30 90" 
                  fill={getElementColor('frame_upper_left')}
                  stroke={selectedElementId === 'frame_upper_left' ? '#3b82f6' : 'transparent'}
                  strokeWidth="3"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('frame_upper_left')}
                />
                
                {/* 中杆 */}
                <rect 
                  x="95" y="170" width="10" height="70" rx="3"
                  fill={getElementColor('shaft')}
                  stroke={selectedElementId === 'shaft' ? '#3b82f6' : 'transparent'}
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('shaft')}
                />
                
                {/* 手柄 */}
                <rect 
                  x="88" y="235" width="24" height="40" rx="4"
                  fill={getElementColor('handle')}
                  stroke={selectedElementId === 'handle' ? '#3b82f6' : 'transparent'}
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => selectElement('handle')}
                />
              </svg>
              
              {/* 部件标签 */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 pointer-events-none">顶</div>
              <div className="absolute top-12 right-2 text-[10px] text-gray-400 pointer-events-none">右上</div>
              <div className="absolute top-1/2 right-0 text-[10px] text-gray-400 pointer-events-none">右</div>
              <div className="absolute bottom-20 right-4 text-[10px] text-gray-400 pointer-events-none">右下</div>
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 pointer-events-none">喉</div>
              <div className="absolute bottom-20 left-4 text-[10px] text-gray-400 pointer-events-none">左下</div>
              <div className="absolute top-1/2 left-0 text-[10px] text-gray-400 pointer-events-none">左</div>
              <div className="absolute top-12 left-2 text-[10px] text-gray-400 pointer-events-none">左上</div>
            </div>

            {/* 其他部件列表 */}
            <div className="space-y-1">
              {design.elements.filter(el => !el.id.startsWith('frame_')).map((element) => (
                <button
                  key={element.id}
                  onClick={() => selectElement(element.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                    selectedElementId === element.id
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: element.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{element.name}</span>
                  {selectedElementId === element.id && (
                    <svg className="w-4 h-4 text-blue-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 颜色选择 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">
              {selectedElement ? `${selectedElement.name} - 颜色` : '选择部件后修改颜色'}
            </h3>
            {selectedElement ? (
              <>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() => handleQuickColor(preset.color)}
                      className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                        selectedElement.color === preset.color
                          ? 'border-blue-500 shadow-md scale-110'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) => handleQuickColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedElement.color}
                    onChange={(e) => {
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        handleQuickColor(e.target.value);
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                点击上方部件选择
              </p>
            )}
          </div>

          {/* 快速样式 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">快速配色方案</h3>
            <div className="space-y-2">
              {QUICK_STYLES.map((style) => (
                <button
                  key={style.name}
                  onClick={() => handleQuickStyle(style.colors)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex gap-1">
                    {style.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 透明度控制 */}
          {selectedElement && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">透明度</h3>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedElement.opacity}
                onChange={(e) => updateElement(selectedElementId!, { opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-500 mt-1">
                {Math.round(selectedElement.opacity * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* 3D 视口 */}
        <div className="flex-1 relative">
          <Scene className="w-full h-full" useCourtBackground={showCourt} />
          
          {/* 场景控制 */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => setShowCourt(!showCourt)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                showCourt 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              {showCourt ? '🏸 场地模式' : '🏸 显示场地'}
            </button>
          </div>
          
          {/* 操作提示 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-4">
            <span>🖱️ 左键旋转</span>
            <span>🔍 滚轮缩放</span>
            <span>✋ 右键平移</span>
            <span>👆 点击部件选中</span>
          </div>

          {/* 选中提示 */}
          {selectedElement && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg border-2 border-white shadow-sm"
                  style={{ backgroundColor: selectedElement.color }}
                />
                <span className="font-medium text-gray-900">已选中: {selectedElement.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* 右侧属性面板 */}
        <PropertiesPanel />
      </div>

      {/* 导出弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">导出设计</h3>
            <p className="text-sm text-gray-500 mb-6">选择导出格式</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { format: 'PNG', desc: '高清图片', icon: '🖼️', color: 'bg-blue-50 hover:bg-blue-100' },
                { format: 'SVG', desc: '矢量图形', icon: '📐', color: 'bg-green-50 hover:bg-green-100' },
                { format: 'PDF', desc: '打印文档', icon: '📄', color: 'bg-orange-50 hover:bg-orange-100' },
                { format: 'GLTF', desc: '3D模型', icon: '🎮', color: 'bg-purple-50 hover:bg-purple-100' },
              ].map((item) => (
                <button
                  key={item.format}
                  onClick={() => {
                    setShowExportModal(false);
                    alert(`${item.format} 导出功能开发中...`);
                  }}
                  className={`flex flex-col items-center p-4 rounded-xl transition-colors ${item.color}`}
                >
                  <span className="text-3xl mb-2">{item.icon}</span>
                  <span className="font-semibold text-gray-900">{item.format}</span>
                  <span className="text-xs text-gray-500">{item.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
