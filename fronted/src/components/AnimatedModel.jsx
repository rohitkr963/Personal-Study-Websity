import React, { useEffect } from "react";

// Simple wrapper that lazy-loads model-viewer and shows an animated 3D model.
export default function AnimatedModel({ className = "", style = {} }) {
  useEffect(() => {
    // load the model-viewer script once
    if (typeof window !== "undefined" && !window.customElements?.get("model-viewer")) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = "https://cdn.jsdelivr.net/npm/@google/model-viewer@1.16.0/dist/model-viewer.min.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  // Using a public glb that includes animation and looks friendly.
  const src = "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb";

  return (
    <div className={`rounded-3xl shadow-md bg-white flex items-center justify-center ${className}`} style={style}>
      <model-viewer
        src={src}
        alt="3D animated illustration"
        auto-rotate
        autoplay
        camera-controls
        exposure="1"
        ar
        style={{ width: "20rem", height: "20rem", borderRadius: '1rem' }}
      />
    </div>
  );
}
