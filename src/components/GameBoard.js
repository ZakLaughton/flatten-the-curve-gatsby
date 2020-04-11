import React from "react";
import Person from "./Person";
import styled from "styled-components";

function GameBoard({ boardSize, gridSize, people, dispatch, day, children }) {
  return (
    <Board
      boardSize={boardSize}
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
    </Board>
  );
}

const Board = styled.div`
  width: 100vw;
  height: 100vw;
  max-width: ${(props) => `${props.boardSize}px`};
  max-height: ${(props) => `${props.boardSize}px`};
  background-color: #b7b7b7;
  position: relative;
  margin: auto;
`;

export default GameBoard;
