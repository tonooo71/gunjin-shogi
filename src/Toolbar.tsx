import React, { useContext } from "react";
import { GSContext } from "./Game";
import { random_board, ready_board } from "./functions_board";

const Toolbar = () => {
  const { state, dispatch, referee } = useContext(GSContext);

  const startBtnEnabled = state.mode === "READY" && ready_board(state.board);
  const isReadyMode = state.mode === "READY";

  const handleClickStart = () => {
    referee.current?.initialize(state.board);
  };

  const handleClickRandomSet = () => {
    const new_board = random_board();
    dispatch({ type: "setBoard", payload: new_board });
  };

  const handleClickDebugStart = () => {
    dispatch({ type: "startDebug" });
  };

  return (
    <div className="gs-toolbar">
      <button disabled={!startBtnEnabled} onClick={handleClickStart}>
        START
      </button>
      <button disabled={!isReadyMode} onClick={handleClickRandomSet}>
        Random Set
      </button>
      <button disabled={false} onClick={handleClickDebugStart}>
        DEBUG
      </button>
      <span>
        {state.mode === "PLAY"
          ? state.myturn
            ? "YOUR TURN"
            : "ENEMY's TURN"
          : ""}
      </span>
    </div>
  );
};

export default Toolbar;
