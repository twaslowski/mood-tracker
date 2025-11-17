import React from "react";
import { DotLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <DotLoader loading={true} size={32} color="currentColor" />
      <span className={`ml-3`}>Loading</span>
    </div>
  );
}
