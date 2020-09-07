import * as React from "react";
import Person from "./simulatorPerson";
import gameBoardStyles from "./gameBoard.module.css";
import { Person as IPerson } from "../typings/gameTypes";

function SimulatorBoard({ gridSize, people, day, dispatch, children }) {
  return (
    <div
      className={gameBoardStyles.gameBoard}
      onContextMenu={(e) => {
        e.preventDefault();
        // setInterval(movePeople, 400);
        dispatch({ type: "INCREMENT_DAY" });
      }}
    >
      {people.map((person: IPerson, index) => (
        <Person personData={person} key={index} gridSize={gridSize} day={day} />
      ))}
      {children}
    </div>
  );
}

export default SimulatorBoard;
