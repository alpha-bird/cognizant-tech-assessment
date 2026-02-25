import React, { useCallback, useState } from "react";
import { callOpenAI, callHuggingFace } from "./apis";

type Provider = "openai" | "huggingface";

export const App: React.FC = () => {

  return (
    <div className="app-root">
    </div>
  );
};
