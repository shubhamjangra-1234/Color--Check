import React, { useState, useEffect } from 'react';
import { useColorBlindnessSimulation } from '../../hooks/useColorBlindnessSimulation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const ColorBlindnessSimulator = ({ colors }) => {
  const {
    simulationMode,
    setSimulationMode,
    isProcessing,
    simulateColors,
    getModeDescription,
    availableModes
  } = useColorBlindnessSimulation(colors);

  const [simulatedResults, setSimulatedResults] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);

  const handleSimulate = async () => {
    const results = await simulateColors();
    setSimulatedResults(results);
  };

  const copyToClipboard = async (color) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  // Auto-simulate when mode changes and colors are available
  useEffect(() => {
    if (colors.length > 0) {
      if (simulationMode === 'normal') {
        // Show original colors in normal mode
        setSimulatedResults(colors.map(color => ({
          original: color,
          simulated: color,
          mode: 'normal'
        })));
      } else {
        // Simulate for other modes
        handleSimulate();
      }
    }
  }, [simulationMode, colors]);

  return (
    <TooltipProvider>
      <div className="bg-zinc-800 rounded-lg p-2 shadow-xl">
        <div className="flex flex-col gap-2 justify-between mb-6">
          <h3 className="text-xl font-semibold text-zinc-100">
            👁️ Color Blindness Simulator
          </h3>
          <div className="text-zinc-400 text-sm max-w-md">
            {getModeDescription(simulationMode)}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-zinc-300 text-sm font-medium mb-3">
            Simulation Mode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            {availableModes.map(mode => (
              <button
                key={mode}
                onClick={() => setSimulationMode(mode)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${simulationMode === mode
                    ? 'border-violet-500 bg-violet-600 text-zinc-100'
                    : 'border-zinc-600 bg-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-600'
                  }`}
              >
                <div className="text-sm font-medium capitalize">{mode}</div>
                <div className="text-xs text-zinc-400 mt-1">
                  {mode === 'normal' ? 'Standard Vision' :
                    mode === 'protanopia' ? 'Red Blind' :
                      mode === 'deuteranopia' ? 'Green Blind' :
                        mode === 'tritanopia' ? 'Blue Blind' :
                          'Monochrome'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Simulation Results */}
        {isProcessing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-zinc-200 mx-auto mb-4"></div>
            <div className="text-zinc-400">Simulating {simulationMode} vision...</div>
          </div>
        )}

        {simulatedResults && !isProcessing && (
          <div className="space-y-4">
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-lg font-medium text-zinc-100 mb-4">
                {simulationMode === 'normal' ? 'Original Colors' : 'Simulation Results'}
              </h4>
              <div className="text-zinc-400 text-sm mb-4">
                {simulationMode === 'normal'
                  ? 'Displaying original extracted colors from your image.'
                  : 'Preview how colors appear to users with different types of color vision deficiencies.'
                }
              </div>

              {/* Color Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {simulatedResults.map((result, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="text-center mb-3">
                      <div className="text-sm font-medium text-zinc-300 capitalize mb-2">
                        {result.mode}
                      </div>
                      <div className="flex justify-center space-x-4">
                        <div className="text-center relative group">
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-zinc-600 mb-2"
                            style={{ backgroundColor: result.original }}
                          ></div>
                          <div className="text-xs text-zinc-400">Original</div>
                          <div className="font-mono text-zinc-400 text-xs">{result.original}</div>
                          {/* <Tooltip>
                            <TooltipTrigger>
                              <div
                                className="absolute top-0 right-0 p-1 cursor-pointer rounded"
                                onClick={() => copyToClipboard(result.original)}
                              > */}
                                {/* <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2v-4a2 2 0 012-2h2m0 0v4a2 2 0 002 2h2m-6 0l6 6" />
                                </svg> */}
                                {/* <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#1C274C" stroke-width="1.5"></path> <path opacity="0.5" d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#1C274C" stroke-width="1.5"></path> </g></svg>
                                {copiedColor === result.original && (
                                  <div className="absolute -top-8 left-0 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                    Copied!
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to copy {result.original}</p>
                            </TooltipContent>
                          </Tooltip> */}
                        </div>
                        {simulationMode !== 'normal' && (
                          <div className="text-center relative group">
                            <div
                              className="w-12 h-12 rounded-lg border-2 border-zinc-600 mb-2"
                              style={{ backgroundColor: result.simulated }}
                            ></div>
                            <div className="text-xs text-zinc-400">Simulated</div>
                            <div className="font-mono text-zinc-400 text-xs">{result.simulated}</div>
                            {/* <Tooltip>
                              <TooltipTrigger>
                                <div
                                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1 cursor-pointer bg-zinc-900/80 hover:bg-zinc-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => copyToClipboard(result.simulated)}
                                >
                                  <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier"> 
                                      <path d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z" stroke="#ffffff" stroke-width="1.5"></path> 
                                      <path opacity="0.5" d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5" stroke="#ffffff" stroke-width="1.5"></path> 
                                    </g>
                                  </svg>
                                  {copiedColor === result.simulated && (
                                    <div className="absolute -top-8 left-0 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                      Copied!
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to copy {result.simulated}</p>
                              </TooltipContent>
                            </Tooltip> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mode Information */}
            <div className="bg-zinc-900 rounded-lg p-4">
              <h4 className="text-lg font-medium text-zinc-100 mb-4">Color Vision Information</h4>
              <div className="space-y-3 text-sm text-zinc-300">
                <div>
                  <strong>Normal Vision:</strong> Full color spectrum perception
                </div>
                <div>
                  <strong>Protanopia:</strong> Difficulty distinguishing red colors (~1% of males)
                </div>
                <div>
                  <strong>Deuteranopia:</strong> Difficulty distinguishing green colors (~1% of males)
                </div>
                <div>
                  <strong>Tritanopia:</strong> Difficulty distinguishing blue colors (rare)
                </div>
                <div>
                  <strong>Achromatopsia:</strong> Complete color blindness (very rare)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ColorBlindnessSimulator;
