//@ts-nocheck
import { useState } from 'react';
import { 
  usePublisher, 
  useCellValues, 
  currentBlockType$,
  applyBlockType$
} from '@mdxeditor/editor';

const BlockTypeSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const applyBlockType = usePublisher(applyBlockType$);
  const [currentBlockType] = useCellValues(currentBlockType$);

  const blockTypes = [
    { 
      type: 'paragraph', 
      label: 'Paragraph', 
      icon: '¶'
    },
    { 
      type: 'heading', 
      label: 'Heading 1',
      level: 1,
      icon: 'H1'
    },
    { 
      type: 'heading', 
      label: 'Heading 2',
      level: 2, 
      icon: 'H2'
    },
    { 
      type: 'heading', 
      label: 'Heading 3',
      level: 3,
      icon: 'H3'
    },
    { 
      type: 'quote', 
      label: 'Quote', 
      icon: '"'
    },
    { 
      type: 'code', 
      label: 'Code Block', 
      icon: '</>'
    }
  ];

  const getCurrentBlockType = () => {
    if (!currentBlockType) return blockTypes[0]; // default to paragraph
    
    if (currentBlockType.type === 'heading') {
      return blockTypes.find(bt => 
        bt.type === 'heading' && bt.level === currentBlockType.level
      ) || blockTypes[1]; // default to H1 if level not found
    }
    
    return blockTypes.find(bt => bt.type === currentBlockType.type) || blockTypes[0];
  };

  const selectedBlockType = getCurrentBlockType();

  const handleSelect = (blockType) => {
    setIsOpen(false);
    
    if (blockType.type === 'heading') {
      applyBlockType({ type: 'heading', level: blockType.level });
    } else {
      applyBlockType({ type: blockType.type });
    }
  };

  const isActive = (blockType) => {
    if (!currentBlockType) return blockType.type === 'paragraph';
    
    if (blockType.type === 'heading') {
      return currentBlockType.type === 'heading' && currentBlockType.level === blockType.level;
    }
    
    return currentBlockType.type === blockType.type;
  };

  return (
    <div className="relative">
      {/* Main selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm whitespace-nowrap"
        style={{ minWidth: '120px' }}
      >
        <span className="font-mono text-gray-600 text-xs">
          {selectedBlockType.icon}
        </span>
        <span className="font-medium text-gray-700 truncate">
          {selectedBlockType.label}
        </span>
        <span className={`text-gray-400 transition-transform duration-150 text-xs ml-auto ${
          isOpen ? 'rotate-180' : ''
        }`}>▼</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-full">
            {blockTypes.map((blockType, index) => (
              <button
                key={`${blockType.type}-${blockType.level || index}`}
                onClick={() => handleSelect(blockType)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t last:rounded-b transition-colors ${
                  isActive(blockType) ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span className="text-xs font-mono flex-shrink-0 w-6 text-center">
                  {blockType.icon}
                </span>
                <span className="text-sm font-medium truncate">
                  {blockType.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BlockTypeSelect;