import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import GameBoard from "../components/GameBoard"
import Graph from "../components/Graph"
import { getInfectedPeopleCount } from "../utils/utils"
import { GameContext } from "../context/gameProvider"
import "../styles/global.css"
import ReactGA from "react-ga"
import { Backdrop, Button, Fade, Modal, IconButton } from "@material-ui/core"
import { createMuiTheme, makeStyles } from "@material-ui/core/styles"
import { ThemeProvider } from "@material-ui/styles"
import { Help } from "@material-ui/icons"

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

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

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
  const classes = useStyles()
  const [state, dispatch] = useContext(GameContext)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalOpen = () => {
    setIsModalOpen(true)
  }
  const handleModalClose = () => {
    setIsModalOpen(false)
  }

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
        <h1 style={{ fontSize: `2rem`, textAlign: `center`, marginBottom: 5 }}>
          FLATTEN THE CURVE
        </h1>
        <h2 style={{ fontSize: `1rem`, textAlign: `center` }}>
          Keep the curve as low as possible!
        </h2>

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
          <IconButton
            type="button"
            variant="outlined"
            onClick={handleModalOpen}
          >
            <Help />
          </IconButton>
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
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={isModalOpen}
          onClose={handleModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={isModalOpen}>
            <div className={classes.paper}>
              <h2 style={{ textAlign: `center` }}>Rules</h2>
              <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
                One person starts infected. Symptoms 5 moves after being
                infected.
              </p>
              <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
                Click or tap healthy people to social distance (lower chance of
                infection).
              </p>
              <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
                Click or tap symptomatic people to quarantine (no chance of
                infecting others).
              </p>
            </div>
          </Fade>
        </Modal>
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
  font-size: 1.4rem;
  font-weight: 500;
  margin: 8px;
  align-items: center;
  color: white;
`

export default Game
