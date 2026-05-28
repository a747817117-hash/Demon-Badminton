import { useState, useCallback } from 'react';

const PRESET_COLORS = [
  // Basic colors
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff',
  
  // Sports colors
  '#e53e3e', '#dd6b20', '#d69e2e', '#38a169', '#3182ce',
  '#805ad5', '#d53f8c', '#2b6cb0', '#2c5282', '#1a365d',
  
  // Pastel colors
  '#fed7d7', '#feebc9', '#fefcbf', '#c6f6d5', '#bee3f8',
  '#e9d8fd', '#fed7e2', '#b2f5ea', '#c6f6d5', '#fefcbf',
  
  // Dark theme
  '#1a202c', '#2d3748', '#4a5568', '#718096', '#a0aec0',
  '#2d3748', '#4a5568', '#718096', '#a0aec0', '#e2e8f0',
  
  // Neon colors
  '#ff006e', '#fb5607', '#ffbe0b', '#3a86ff', '#8338ec',
  '#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93',
];

interface ColorPickerProps {
  elementId: string;
  currentColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPicker({
  currentColor,
  onColorChange,
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(currentColor);
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetClick = useCallback(
    (color: string) => {
      onColorChange(color);
      setCustomColor(color);
    },
    [onColorChange]
  );

  const handleCustomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      setCustomColor(color);
      onColorChange(color);
    },
    [onColorChange]
  );

  return (
    <div className="color-picker">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        颜色选择
      </label>
      
      {/* Current color preview */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-inner"
          style={{ backgroundColor: currentColor }}
        />
        <div>
          <p className="text-sm font-medium text-gray-900">当前颜色</p>
          <p className="text-xs text-gray-500">{currentColor}</p>
        </div>
      </div>

      {/* Preset colors grid */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">预设颜色</p>
        <div className="grid grid-cols-10 gap-1">
          {PRESET_COLORS.map((color, index) => (
            <button
              key={index}
              className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                currentColor === color
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handlePresetClick(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom color input */}
      <div className="mb-4">
        <button
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          onClick={() => setShowCustom(!showCustom)}
        >
          <svg
            className={`w-4 h-4 transition-transform ${showCustom ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          自定义颜色
        </button>
        
        {showCustom && (
          <div className="mt-2 flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={handleCustomChange}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const val = e.target.value;
                setCustomColor(val);
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                  onColorChange(val);
                }
              }}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            />
          </div>
        )}
      </div>

      {/* Recent colors (placeholder) */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2">最近使用</p>
        <div className="flex gap-1">
          {[currentColor].map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-md border border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
