import React from "react";
import { pieces } from "./pieces";

type Props = {
  piece: PieceId;
  selected: boolean;
};

const Piece: React.FC<Props> = ({ piece, selected }) => {
  const validPiece = Math.abs(piece) in pieces;
  if (piece === 0 || !validPiece) return null; // no piece

  const mine = piece > 0; // piece is mine
  const reverse = false && piece < 0; // opponent's piece is reversed ?

  return (
    <>
      <svg
        className="gs-piece"
        data-reverse={!mine}
        data-selected={selected}
        viewBox="-0.5 -0.5 102 102"
      >
        <polygon points="10 20, 50 0, 90 20, 100 100, 0 100" />
      </svg>
      {!reverse && (
        <span className="gs-piece-word">{pieces[Math.abs(piece)]}</span>
      )}
    </>
  );
};

export default Piece;
