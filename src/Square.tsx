import React, { useContext } from "react";
import Piece from "./Piece";
import { GSContext } from "./App";
import { change_piece, same_position } from "./functions_board";

type Props = {
  piece: PieceId;
  type: SquareType;
  position: Position;
};

const Square: React.FC<Props> = ({ piece, type, position }) => {
  const { state, dispatch } = useContext(GSContext);

  const selected = same_position(state.selected, position);

  const handleClick = () => {
    if (type === "river" || type === "bridge") return;

    // mode: READY
    if (state.mode === "READY") {
      if (state.selected === null) {
        const validSelect =
          piece !== 0 && (type === "normal" || type === "base");
        validSelect && dispatch({ type: "selectPiece", payload: position });
      } else if (selected) {
        dispatch({ type: "selectPiece", payload: null });
      } else {
        const new_board = change_piece(state.board, state.selected, position);
        dispatch({ type: "setBoard", payload: new_board });
      }
    }

    // mode: WAITING
    else if (state.mode === "WAITING") {
      return;
    }
  };

  return (
    <div className="gs-square" data-type={type} onClick={handleClick}>
      <Piece piece={piece} selected={selected} />
    </div>
  );
};

export default Square;
