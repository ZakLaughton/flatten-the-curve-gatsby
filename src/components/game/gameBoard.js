import React from "react";
import Person from "./person";
import gameBoardStyles from "../board.module.css";

function GameBoard({ boardSize, gridSize, people, day, dispatch, children }) {
  return (
    <div
      className={gameBoardStyles.gameBoard}
      onContextMenu={(e) => {
        e.preventDefault();
        // setInterval(movePeople, 400);
        dispatch({ type: "INCREMENT_DAY" });
      }}
    >
      {people.map((person, index) => (
        <Person
          personData={person}
          key={index}
          gridSize={gridSize}
          dispatch={dispatch}
          day={day}
          boardSize={boardSize}
          isClickable={true}
        />
      ))}
      {children}
    </div>
  );
}

export default GameBoard;