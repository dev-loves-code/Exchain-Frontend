// src/components/ui/Loading.jsx
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = ({ fullScreen = false, text = 'Loading...', showText = true }) => {
  // Fixed big size
  const fixedSize = 'w-48 h-48'; // 12rem x 12rem, big enough

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={fixedSize}>
        <DotLottieReact
          src="https://lottie.host/c1cf8883-7c44-4805-923a-48b057e9bf29/vrTu7ImbRU.lottie"
          loop
          autoplay
        />
      </div>
      {showText && (
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
