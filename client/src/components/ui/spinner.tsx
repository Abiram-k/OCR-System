import React from "react";
import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/50 overflow-hidden backdrop-blur-sm">
      <Hourglass size="40" bgOpacity="0.1" speed="1.75" color="black" />
    </div>
  );
};

export default LoadingScreen;
