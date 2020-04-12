import React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"

function Person({ gridSize, personData, dispatch, day }) {
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

  const sociallyDistancedSquareStyle = {
    height: `${cellSizeInPercent}%`,
    width: `${cellSizeInPercent}%`,
    position: `absolute`,
    left: `${cellSizeInPercent * location.x}%`,
    bottom: `${cellSizeInPercent * location.y}%`,
    border: `3px dashed #595959`,
    boxSizing: `border-box`,
    zIndex: 10,
  }

  const quarantinedSquareStyle = {
    height: `${cellSizeInPercent}%`,
    width: `${cellSizeInPercent}%`,
    position: `absolute`,
    left: `${cellSizeInPercent * location.x}%`,
    bottom: `${cellSizeInPercent * location.y}%`,
    border: `3px ridge #4c0000`,
    boxSizing: `border-box`,
    zIndex: 10,
  }

  return (
    <>
      <StyledPerson
        cellSizeInPercent={cellSizeInPercent}
        isCured={isCured}
        isSymptomatic={isSymptomatic}
        location={location}
        positionTransition={{ duration: 0.4 }}
        onClick={handleClick}
      />
      {/* {personData.mobility === "SOCIALLY_DISTANCED" && (
        <motion.div
          positionTransition={{ duration: 0.4 }}
          style={sociallyDistancedSquareStyle}
        />
      )}
      {personData.mobility === "QUARANTINED" && (
        <motion.div
          positionTransition={{ duration: 0.4 }}
          style={quarantinedSquareStyle}
        />
      )}*/}
      <PersonShadow
        positionTransition={{ duration: 0.4 }}
        location={location}
        cellSizeInPercent={cellSizeInPercent}
      />
    </>
  )
}

const StyledPerson = styled(motion.span).attrs(props => ({
  style: {
    height: `${props.cellSizeInPercent}%`,
    width: `${props.cellSizeInPercent}%`,
    backgroundColor: props.isCured
      ? "#57c1ff"
      : props.isSymptomatic
      ? "#448844"
      : "white",
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

const PersonShadow = styled(motion.span).attrs(props => ({
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
  z-index: 5;
  content: "";
  box-shadow: #0000009c 4px 3px 6px 0px;
  z-index: 4;
`

export default Person
