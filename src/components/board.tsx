import * as React from "react";
import Person from "./person";
import gameBoardStyles from "./board.module.css";
import { Person as IPerson } from "../typings/gameTypes";

function Board({ gridSize, people, day, children }) {
  return (
    <div className={gameBoardStyles.gameBoard}>
      {people.map((person: IPerson, index) => (
        <Person personData={person} key={person.id} gridSize={gridSize} day={day} />
      ))}
      {children}
    </div>
  );
}

export default Board;
