import React, { useState } from "react";
import Game from "./Game";

const App: React.FC = () => {
  const [mode, setMode] = useState<GameType>("none");

  if (mode === "none") {
    return (
      <div style={{ display: "flex", flexDirection: "column", margin: "auto" }}>
        <h3>Please Select Mode</h3>
        {/* <button onClick={() => setMode("debug")}>Debug Mode</button> */}
        <button onClick={() => setMode("cpu")}>CPU Mode</button>
        {/* <button onClick={() => setMode("wshuman")}>WebSocket Mode</button> */}
      </div>
    );
  }

  return <Game mode={mode} />;
};

export default App;
