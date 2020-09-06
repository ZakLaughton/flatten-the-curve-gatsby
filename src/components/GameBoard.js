import React, { useContext } from "react";
import { GameContext } from "../context/gameProvider";
import Person from "./Person";
import gameBoardStyles from "./gameBoard.module.scss";

function GameBoard({ children }) {
  const [state, dispatch] = useContext(GameContext);
  const { boardSize, gridSize, people, day } = state;

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
        />
      ))}
      {children}
    </div>
  );
}

export default GameBoard;
