import React, { useContext } from "react";
import Piece from "./Piece";
import { GSContext } from "./Game";
import { change_piece } from "./utils/functions_board";
import {
  include_piece,
  possible_square,
  same_position,
} from "./utils/functions_piece";

type Props = {
  piece: PieceId;
  type: SquareType;
  position: Position;
};

const Square: React.FC<Props> = ({ piece, type, position }) => {
  const { state, dispatch, referee } = useContext(GSContext);

  const selected = same_position(state.selected, position);
  const candidate = include_piece(position, state.candidates);

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

    // mode: PLAYING
    else if (state.mode === "PLAY" && state.status === "PLAYING") {
      if (state.selected === null) {
        if (piece > 0) {
          const candidates = possible_square(piece, state.board, position);
          dispatch({
            type: "setCandidates",
            payload: candidates,
            payload2: position,
          });
        }
      } else if (selected) {
        dispatch({ type: "selectPiece", payload: null });
      } else {
        if (candidate) {
          referee.current?.movePiece(state.selected, position);
        }
      }
    }
  };

  return (
    <div
      className="gs-square"
      data-type={type}
      data-candidate={candidate}
      onClick={handleClick}
    >
      <Piece piece={piece} selected={selected} />
    </div>
  );
};

export default Square;
