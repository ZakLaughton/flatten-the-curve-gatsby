import React, { useEffect, useState, useReducer } from "react";
import indexStyles from "./index.module.css";
import GameBoard from "../components/gameBoard";
import Graph from "../components/graph";
import { checkInfected } from "../utils/utils";
import "../styles/global.css";
import ReactGA from "react-ga";
import { Backdrop, Button, Fade, Modal, IconButton } from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Help } from "@material-ui/icons";
import { useLocation } from "@reach/router";
import reducer, { initialState } from "../state/simulatorReducer";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#454545",
    },
    secondary: {
      main: "#0008ff",
    },
  },
  spacing: 8,
});

const useStyles = makeStyles((theme) => ({
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
}));

const ARRAY_SEARCH_RESULT_NOT_FOUND = -1;

function initializeReactGA() {
  if (document.location.hostname.search(`zaklaughton.dev`) !== ARRAY_SEARCH_RESULT_NOT_FOUND) {
    ReactGA.initialize(`UA-67511792-5`);
    ReactGA.pageview(`/`);
  }
}
function Game() {
  const { pathname } = useLocation();

  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleStart = () => {
    setInterval(() => {
      dispatch({ type: "INCREMENT_DAY" });
    }, 800);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    initializeReactGA();
    dispatch({ type: "RESTART" });
  }, [dispatch]);

  const {
    day,
    people,
    historicalInfectedCount,
    gridSize,
    boardSize,
    peopleDensity,
    topOfTheCurve,
  } = state;

  const gameMetrics = { gridSize, boardSize, peopleDensity };

  const infectedPeopleCount = people.filter(checkInfected).length;
  const symptomaticCount = people.filter(
    ({ isCured, infectedDay }) => !isCured && infectedDay >= 0 && day - infectedDay >= 5
  ).length;
  const totalPeopleCount = people.length;
  const curedPeopleCount = people.filter((person) => person.isCured).length;

  return (
    <ThemeProvider theme={theme}>
      <main className={indexStyles.gameGrid}>
        <h1
          style={{
            fontSize: `2rem`,
            textAlign: `center`,
            marginBottom: 5,
            color: `white`,
          }}
        >
          FLATTEN THE CURVE
        </h1>
        <h2 style={{ fontSize: `1rem`, textAlign: `center` }}>
          Keep the curve as low as possible!
        </h2>
        <div className={indexStyles.mainStats}>
          <div>Top of the curve: {Math.floor(topOfTheCurve)}%</div>
          <Button
            color='primary'
            variant='contained'
            onClick={() => {
              dispatch({ type: "RESTART" });
            }}
          >
            Reset
          </Button>
          <IconButton
            type='button'
            variant='outlined'
            onClick={handleModalOpen}
            color='secondary'
            style={{ backgroundColor: `white` }}
            size='small'
            edge={false}
          >
            <Help />
          </IconButton>
        </div>
        <div className={indexStyles.stats}>
          <div>
            <span style={{ color: `rgba(255, 0, 0, 0.8)` }}>{infectedPeopleCount}</span> infected (
            <span style={{ color: `#448844` }}>{symptomaticCount}</span>{" "}
            {symptomaticCount > 1 || symptomaticCount === 0 ? "have" : "has"} symptoms)
          </div>
          <div>
            <span style={{ color: `#57c1ff` }}>{curedPeopleCount}</span> recovered
          </div>
        </div>
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
        <button onClick={handleStart}>Start</button>
        <Modal
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
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
              <h2 style={{ textAlign: `center`, marginBottom: `1rem` }}>Rules</h2>
              <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
                GOAL: Reduce the amount of people infected at any one time through social
                distancing!
              </p>
              <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
                One person starts infected. Symptoms appear 5 moves after infection.
              </p>
              <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
                Click or tap healthy people to social distance (lower chance of infection).
              </p>
              <p style={{ fontSize: `1.3rem`, textAlign: `center` }}>
                Click or tap symptomatic people to quarantine (no chance of infecting others).
              </p>
            </div>
          </Fade>
        </Modal>
      </main>
    </ThemeProvider>
  );
}

export default Game;
