import { useState, useCallback } from 'react';
import { useEditorStore } from '../../stores/editorStore';

interface ToolbarProps {
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function Toolbar({
  onSave,
  onLoad,
  onExport,
  onUndo,
  onRedo,
}: ToolbarProps) {
  const isDirty = useEditorStore((state) => state.isDirty);
  const isLoading = useEditorStore((state) => state.isLoading);
  const design = useEditorStore((state) => state.design);
  const setDesign = useEditorStore((state) => state.setDesign);
  const resetDesign = useEditorStore((state) => state.resetDesign);

  const [showTitleEdit, setShowTitleEdit] = useState(false);
  const [titleInput, setTitleInput] = useState(design.title);

  const handleTitleSave = useCallback(() => {
    setDesign({ title: titleInput });
    setShowTitleEdit(false);
  }, [titleInput, setDesign]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleTitleSave();
      } else if (e.key === 'Escape') {
        setTitleInput(design.title);
        setShowTitleEdit(false);
      }
    },
    [design.title, handleTitleSave]
  );

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left: Title and status */}
        <div className="flex items-center gap-4">
          {showTitleEdit ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                onBlur={handleTitleSave}
                className="px-2 py-1 border border-gray-300 rounded text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleTitleSave}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                保存
              </button>
            </div>
          ) : (
            <h1
              className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => {
                setTitleInput(design.title);
                setShowTitleEdit(true);
              }}
            >
              {design.title}
              {isDirty && (
                <span className="ml-2 text-sm text-orange-500">• 未保存</span>
              )}
            </h1>
          )}
        </div>

        {/* Center: Actions */}
        <div className="flex items-center gap-1">
          <ToolbarButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            }
            label="撤销"
            onClick={onUndo}
          />
          <ToolbarButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 14H11a8 8 0 01-8-8V4m0 0l6 6m-6-6l6 6" />
              </svg>
            }
            label="重做"
            onClick={onRedo}
          />
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <ToolbarButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
            label="加载"
            onClick={onLoad}
          />
          <ToolbarButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            }
            label="保存"
            onClick={onSave}
            primary
          />
          <ToolbarButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            label="导出"
            onClick={onExport}
          />
        </div>

        {/* Right: Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetDesign}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            重置
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <div className="text-sm text-gray-500">
            {isLoading ? '加载中...' : '就绪'}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
}

function ToolbarButton({
  icon,
  label,
  onClick,
  primary = false,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium
        transition-colors duration-150
        ${
          primary
            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300'
            : 'text-gray-700 hover:bg-gray-100 disabled:text-gray-300'
        }
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
