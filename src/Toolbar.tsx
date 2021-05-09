import React, { useContext } from "react";
import { GSContext } from "./App";
import { random_board, ready_board } from "./check_board";

const Toolbar = () => {
  const { state, dispatch } = useContext(GSContext);

  const startBtnEnabled = state.mode === "READY" && ready_board(state.board);
  const isReadyMode = state.mode === "READY";

  const handleClickRandomSet = () => {
    const new_board = random_board();
    dispatch({ type: "setBoard", payload: new_board });
  };

  return (
    <div className="gs-toolbar">
      <button disabled={!startBtnEnabled}>START</button>
      <button disabled={!isReadyMode} onClick={handleClickRandomSet}>
        Random Set
      </button>
    </div>
  );
};

export default Toolbar;
