import React, { useContext } from "react";
import { GSContext } from "./Game";
import { random_board, ready_board } from "./utils/functions_board";

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

  return (
    <div className="gs-toolbar">
      <button disabled={!startBtnEnabled} onClick={handleClickStart}>
        START
      </button>
      <button disabled={!isReadyMode} onClick={handleClickRandomSet}>
        Random Set
      </button>
      <span style={{ marginLeft: "1em" }}>
        {state.mode === "PLAY"
          ? state.myturn
            ? "YOUR TURN"
            : "ENEMY's TURN"
          : ""}
      </span>
      <span style={{ marginLeft: "1em" }}>
        {state.status === "WIN"
          ? "YOU WIN"
          : state.status === "LOSE"
          ? "YOU LOSE"
          : state.status === "DRAW"
          ? "DRAW"
          : ""}
      </span>
    </div>
  );
};

export default Toolbar;
