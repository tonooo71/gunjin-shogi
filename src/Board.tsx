import React, { useContext } from "react";
import Square from "./Square";
import { GSContext } from "./App";

const Board = () => {
  const { state, dispatch } = useContext(GSContext);
  return (
    <div className="gs-board">
      {state.board.map((val1, idx1) => (
        <div className="gs-line" key={idx1}>
          {val1.map((val2, idx2) => {
            const type: SquareType =
              idx1 % 8 === 0 && idx2 === 2
                ? "base"
                : idx1 % 8 === 0 && idx2 === 3
                ? "--base"
                : idx1 === 4 && (idx2 === 1 || idx2 === 4)
                ? "bridge"
                : idx1 === 4
                ? "river"
                : "normal";
            return (
              <Square
                key={idx2}
                piece={val2}
                type={type}
                position={[idx1, idx2]}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
