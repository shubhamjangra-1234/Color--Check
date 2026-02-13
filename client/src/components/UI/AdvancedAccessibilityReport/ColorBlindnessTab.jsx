import React from 'react';

const ColorBlindnessTab = ({ report }) => {
  // Function to simulate color blindness transformations
  const simulateColorBlindness = (hexColor, type) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    let newR = r, newG = g, newB = b;

    switch (type) {
      case 'protanopia':
        // Red-blind: Remove red component
        newR = 0.567 * g + 0.433 * b;
        newG = 0.558 * g + 0.442 * b;
        newB = 0.242 * g + 0.758 * b;
        break;
      case 'deuteranopia':
        // Green-blind: Remove green component
        newR = 0.625 * r + 0.375 * b;
        newG = 0.7 * r + 0.3 * b;
        newB = 0.3 * r + 0.7 * b;
        break;
      case 'tritanopia':
        // Blue-blind: Remove blue component
        newR = 0.95 * r + 0.05 * g;
        newG = 0.433 * g + 0.567 * b;
        newB = 0.475 * g + 0.525 * b;
        break;
      case 'achromatopsia':
        // Complete color blindness: Convert to grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        newR = gray;
        newG = gray;
        newB = gray;
        break;
      default:
        // Normal vision
        break;
    }

    // Convert back to hex and clamp values
    const clamp = (value) => Math.min(255, Math.max(0, Math.round(value)));
    return `#${clamp(newR).toString(16).padStart(2, '0')}${clamp(newG).toString(16).padStart(2, '0')}${clamp(newB).toString(16).padStart(2, '0')}`;
  };

  const colorBlindnessTypes = [
    { 
      id: 'normal', 
      name: 'Normal Vision', 
      icon: '👁️',
      description: 'Standard color vision',
      color: 'text-green-400'
    },
    { 
      id: 'protanopia', 
      name: 'Protanopia', 
      icon: '🔴',
      description: 'Red color blindness (1% of males)',
      color: 'text-red-400'
    },
    { 
      id: 'deuteranopia', 
      name: 'Deuteranopia', 
      icon: '🟢',
      description: 'Green color blindness (1% of males)',
      color: 'text-green-400'
    },
    { 
      id: 'tritanopia', 
      name: 'Tritanopia', 
      icon: '🔵',
      description: 'Blue color blindness (rare)',
      color: 'text-blue-400'
    },
    { 
      id: 'achromatopsia', 
      name: 'Achromatopsia', 
      icon: '⚫',
      description: 'Complete color blindness (very rare)',
      color: 'text-zinc-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
        <h4 className="text-lg font-medium text-zinc-100 mb-4 flex items-center gap-2">
          👁️ Color Blindness Simulation
        </h4>
        <div className="text-sm text-zinc-400 mb-6">
          See how your color palette appears to people with different types of color vision deficiency
        </div>
        
        {/* Color Blindness Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {colorBlindnessTypes.map((type) => (
            <div key={type.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-600">
              <div className="text-center mb-3">
                <div className={`text-2xl mb-2 ${type.color}`}>
                  {type.icon}
                </div>
                <div className="font-medium text-zinc-100">{type.name}</div>
              </div>
              <div className="text-xs text-zinc-400">
                {type.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette Simulation */}
      {report.extractedPalette && report.extractedPalette.length > 0 && (
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-700">
          <h4 className="text-lg font-medium text-zinc-100 mb-6">Color Palette Under Different Conditions</h4>
          
          {/* Header row with vision types */}
          <div className="grid grid-cols-5 gap-2 mb-4 text-xs">
            {/* <div className="text-zinc-400 font-medium">Original</div> */}
            {colorBlindnessTypes.map((type) => (
              <div key={type.id} className={`text-center font-medium ${type.color}`}>
                {type.name}
              </div>
            ))}
          </div>

          {/* Color rows */}
          <div className="space-y-3">
            {report.extractedPalette.slice(0, 6).map((color, index) => (
              <div key={index} className="grid grid-cols-5 gap-2">
                {/* Original color */}
                {/* <div className="flex flex-col items-center">
                  <div 
                    className="w-full h-12 rounded-lg border-2 border-zinc-600 mb-2"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="text-xs font-mono text-zinc-400 text-center">{color}</div>
                </div> */}
                
                {/* Simulated colors for each type */}
                {colorBlindnessTypes.map((type) => (
                  <div key={type.id} className="flex flex-col items-center">
                    <div 
                      className="w-full h-12 rounded-lg border-2 border-zinc-600 mb-2"
                      style={{ backgroundColor: simulateColorBlindness(color, type.id) }}
                    ></div>
                    <div className="text-xs font-mono text-zinc-400 text-center">
                      {simulateColorBlindness(color, type.id)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-600">
            <div className="text-sm text-zinc-300 mb-2">💡 Understanding the Simulation:</div>
            <div className="text-xs text-zinc-400 space-y-1">
              <div>• Each row shows how the same color appears under different vision conditions</div>
              <div>• Hex codes show the actual color values perceived by each type</div>
              <div>• This helps identify accessibility issues for color-blind users</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorBlindnessTab;
