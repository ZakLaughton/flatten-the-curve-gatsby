import * as React from "react";
import Person from "./simulatorPerson";
import gameBoardStyles from "./board.module.css";
import { Person as IPerson } from "../typings/gameTypes";

function SimulatorBoard({ gridSize, people, day, children }) {
  return (
    <div className={gameBoardStyles.gameBoard}>
      {people.map((person: IPerson, index) => (
        <Person personData={person} key={index} gridSize={gridSize} day={day} />
      ))}
      {children}
    </div>
  );
}

export default SimulatorBoard;
