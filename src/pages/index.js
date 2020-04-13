import React, { useContext, useEffect } from "react"
import styled from "styled-components"
import GameBoard from "../components/GameBoard"
import Graph from "../components/Graph"
import { getInfectedPeopleCount } from "../utils/utils"
import { GameContext } from "../context/gameProvider"
import "../styles/global.css"
import ReactGA from "react-ga"
import { Button } from "@material-ui/core"
import { createMuiTheme } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/styles"

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#454545",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#00FF00",
    },
  },
  spacing: 8,
})

const ARRAY_SEARCH_RESULT_NOT_FOUND = -1

function initializeReactGA() {
  if (
    document.location.hostname.search(`zaklaughton.dev`) !==
    ARRAY_SEARCH_RESULT_NOT_FOUND
  ) {
    ReactGA.initialize(`UA-67511792-5`)
    ReactGA.pageview(`/`)
  }
}

function Game() {
  const [state, dispatch] = useContext(GameContext)
  useEffect(() => {
    initializeReactGA()
    dispatch({ type: "RESTART" })
  }, [dispatch])

  const {
    day,
    people,
    historicalInfectedCount,
    gridSize,
    boardSize,
    peopleDensity,
    topOfTheCurve,
  } = state

  const gameMetrics = { gridSize, boardSize, peopleDensity }

  const infectedPeopleCount = getInfectedPeopleCount(people)
  const symptomaticCount = people.filter(
    ({ isCured, infectedDay }) =>
      !isCured && infectedDay >= 0 && day - infectedDay >= 5
  ).length
  const totalPeopleCount = people.length
  const curedPeopleCount = people.filter(person => person.isCured).length

  return (
    <ThemeProvider theme={theme}>
      <GameGrid boardSize={boardSize}>
        <h1 style={{ fontSize: `1.3rem`, textAlign: `center` }}>
          FLATTEN THE CURVE (beta) – See how low you can keep the curve!
        </h1>

        <MainStats>
          <div>Top of the curve: {Math.floor(topOfTheCurve)}%</div>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              dispatch({ type: "RESTART" })
            }}
          >
            Reset
          </Button>
        </MainStats>

        <GameBoard
          {...gameMetrics}
          dispatch={dispatch}
          people={people}
          day={day}
          gridSize={gridSize}
          boardSize={boardSize}
        >
          <Graph
            historicalInfectedCount={historicalInfectedCount}
            totalPeopleCount={totalPeopleCount}
          />
        </GameBoard>
        <Stats>
          <div>
            <span style={{ color: `rgba(255, 0, 0, 0.8)` }}>
              {infectedPeopleCount}
            </span>{" "}
            infected (
            <span style={{ color: `#448844` }}>{symptomaticCount}</span>{" "}
            {symptomaticCount > 1 || symptomaticCount === 0 ? "have" : "has"}{" "}
            symptoms)
          </div>
          <div>
            <span style={{ color: `#57c1ff` }}>{curedPeopleCount}</span>{" "}
            recovered
          </div>
        </Stats>
        <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
          One person starts infected. Symptoms show on day 5.
        </p>
        <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
          Click or tap people to social distance (won't move, lower chance of
          infection). Click or tap people with symptoms to quarantine (can't
          move, no chance of infecting others).
        </p>
      </GameGrid>
    </ThemeProvider>
  )
}

const GameGrid = styled.main`
  color: rgba(255, 255, 255, 0.8);
  max-width: 100vw;
  width: ${props => `${props.boardSize}px`};
  margin: auto;
  padding: 3px;
`

const Stats = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  font-size: 1.2rem;
  flex-wrap: wrap;
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 5px;
  padding: 5px;
  margin: 8px 0px;
`

const MainStats = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  font-size: 2rem;
  font-weight: 500;
  margin: 8px;
  align-items: center;
  color: white;
`

export default Game
