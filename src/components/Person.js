import React, { useContext } from "react"
import { GameContext } from "../context/gameProvider"
import { motion } from "framer-motion"
import styled from "styled-components"

function Person({ personData }) {
  const [state, dispatch] = useContext(GameContext)
  const { gridSize, day } = state
  const { id, infectedDay, isCured, location } = personData
  const isSymptomatic = !isCured && infectedDay >= 0 && day - infectedDay >= 5
  const handleClick = () => {
    const newMobility = isSymptomatic ? "QUARANTINED" : "SOCIALLY_DISTANCED"
    dispatch({
      type: "UPDATE_PERSON_MOBILITY",
      payload: { id, mobility: newMobility },
    })
    dispatch({ type: "INCREMENT_DAY" })
  }

  const cellSizeInPercent = 100 / gridSize

  return (
    <>
      <StyledPerson
        cellSizeInPercent={cellSizeInPercent}
        isCured={isCured}
        isSymptomatic={isSymptomatic}
        location={location}
        positionTransition={{ duration: 0.4 }}
        onClick={handleClick}
        infectedDay={infectedDay}
      />
      {personData.mobility === "SOCIALLY_DISTANCED" && (
        <SociallyDistancedSquare
          positionTransition={{ duration: 0.4 }}
          location={location}
          cellSizeInPercent={cellSizeInPercent}
        />
      )}
      {personData.mobility === "QUARANTINED" && (
        <QuarantinedSquare
          positionTransition={{ duration: 0.4 }}
          location={location}
          cellSizeInPercent={cellSizeInPercent}
        />
      )}
      <PersonShadow
        positionTransition={{ duration: 0.4 }}
        location={location}
        cellSizeInPercent={cellSizeInPercent}
      />
    </>
  )
}

const StyledPerson = styled(motion.div).attrs(props => ({
  style: {
    height: `${props.cellSizeInPercent}%`,
    width: `${props.cellSizeInPercent}%`,
    backgroundColor: props.isCured
      ? "#57c1ff"
      : props.isSymptomatic
      ? "#448844"
      : "white",
    // Show all infected (for debugging):
    // backgroundColor: props.infectedDay >= 0 ? "#448844" : "white",
    left: `${props.cellSizeInPercent * props.location.x}%`,
    bottom: `${props.cellSizeInPercent * props.location.y}%`,
  },
}))`
  border-radius: 50%;
  position: absolute;

  border: 1px solid black;
  box-sizing: border-box;
  z-index: 5;
`

const PersonShadow = styled(motion.div).attrs(props => ({
  style: {
    height: `${props.cellSizeInPercent}%`,
    width: `${props.cellSizeInPercent}%`,
    left: `${props.cellSizeInPercent * props.location.x}%`,
    bottom: `${props.cellSizeInPercent * props.location.y}%`,
  },
}))`
  border-radius: 50%;
  position: absolute;
  box-sizing: border-box;
  content: "";
  box-shadow: #0000009c 4px 3px 6px 0px;
  z-index: 4;
`

const SociallyDistancedSquare = styled(motion.div).attrs(props => ({
  style: {
    height: `${props.cellSizeInPercent}%`,
    width: `${props.cellSizeInPercent}%`,
    left: `${props.cellSizeInPercent * props.location.x}%`,
    bottom: `${props.cellSizeInPercent * props.location.y}%`,
  },
}))`
  position: absolute;
  border: 3px dashed #595959;
  box-sizing: border-box;
  z-index: 10;
`

const QuarantinedSquare = styled(motion.div).attrs(props => ({
  style: {
    height: `${props.cellSizeInPercent}%`,
    width: `${props.cellSizeInPercent}%`,
    left: `${props.cellSizeInPercent * props.location.x}%`,
    bottom: `${props.cellSizeInPercent * props.location.y}%`,
  },
}))`
  border: 3px ridge #4c0000;
  position: absolute;
  box-sizing: border-box;
  z-index: 10;
`

export default Person
