import { ColorBlindnessToggle, SimulatedPalette } from '../../features/color-blindness';

const ColorDisplay = ({ colors, colorBlindnessMode, setColorBlindnessMode }) => {
  return (
    <div className="w-full  mx-4 px-2 py-4 text-center md:mt-0">
      <h2 className="mb-4 text-2xl font-mono text-zinc-100">
        Extracted Colors
      </h2>
      
      {/* Color Blindness Simulation */}
      <div className="mb-6">
        <ColorBlindnessToggle
          currentMode={colorBlindnessMode}
          onModeChange={setColorBlindnessMode}
          disabled={!colors.length}
        />
      </div>

      {/* Simulated Palette */}
      <SimulatedPalette
        colors={colors}
        mode={colorBlindnessMode}
        showOriginal={colorBlindnessMode !== 'normal'}
      />
    </div>
  );
};

export default ColorDisplay;
