import React, { useContext } from "react"
import { GameContext } from "../context/gameProvider"
import Person from "./Person"
import styled from "styled-components"

function GameBoard({ children }) {
  const [state, dispatch] = useContext(GameContext)
  const { boardSize, gridSize, people, day } = state

  return (
    <Board
      boardSize={boardSize}
      onContextMenu={e => {
        e.preventDefault()
        // setInterval(movePeople, 400);
        dispatch({ type: "INCREMENT_DAY" })
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
  )
}

const Board = styled.div`
  width: 100%;
  max-width: ${props => `${props.boardSize}px`};
  height: 0;
  padding-bottom: 100%;
  background-color: #b7b7b7;
  position: relative;
  margin: auto;
  padding-bottom: 100%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: #0000009c 4px 3px 6px 0px;
`

export default GameBoard
