import { Gamepad2 } from 'lucide-react';

const BmoCharacter = ({ active, onToggle, screenText }) => {
  return (
    <div className="lg:w-1/2 flex justify-center">
      <div className="relative">
        <div
          className={`relative w-80 h-80 rounded-3xl border-8 ${active ? 'border-green-500' : 'border-gray-400'} bg-gradient-to-br from-green-100 to-yellow-100 shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105`}
          onClick={onToggle}
        >
          {/* BMO Screen */}
          <div className="absolute inset-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-4 border-green-300 flex flex-col items-center justify-center p-6">
            {/* BMO Face */}
            <div className="mb-6">
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src="/bmo-character.png"
                  alt="BMO Character"
                  className={`w-full h-full object-contain transition-all duration-500 ${
                    active
                      ? 'opacity-100 scale-110 animate-bounce'
                      : 'opacity-70 scale-100 grayscale'
                  }`}
                />
                {active && (
                  <>
                    <div className="absolute top-8 left-8 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute top-8 right-8 w-3 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
                  </>
                )}
              </div>
              <div className="mt-4">
                <div
                  className={`w-24 h-2 rounded-full mx-auto ${active ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} mb-2`}
                ></div>
                <div
                  className={`w-20 h-2 rounded-full mx-auto ${active ? 'bg-green-500 animate-pulse delay-100' : 'bg-gray-400'}`}
                ></div>
              </div>
            </div>

            {/* Text Display */}
            <div className="bg-green-900/90 rounded-lg p-4 w-full max-w-xs">
              <div className="font-mono text-green-300 text-center min-h-[60px] flex items-center justify-center">
                {active ? (
                  <span className="animate-pulse">{screenText}</span>
                ) : (
                  'Click me to wake up! ⚡'
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <div
                className={`w-6 h-6 rounded-full ${active ? 'bg-yellow-400 animate-bounce' : 'bg-gray-400'}`}
              ></div>
              <div
                className={`w-6 h-6 rounded-full ${active ? 'bg-red-400 animate-bounce delay-100' : 'bg-gray-400'}`}
              ></div>
              <div
                className={`w-6 h-6 rounded-full ${active ? 'bg-blue-400 animate-bounce delay-200' : 'bg-gray-400'}`}
              ></div>
            </div>
          </div>

          {/* BMO Logo */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Exchain OS v1.0
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default BmoCharacter;
