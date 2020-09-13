import React, { useEffect, useState, useReducer } from "react";
import indexStyles from "./index.module.scss";
import Board from "../components/board";
import SimulatorSettingsForm from "../components/simulatorSettingsForm/simulatorSettingsForm";
import Graph from "../components/graph";
import { checkInfected } from "../utils/utils";
import "../styles/global.css";
import ReactGA from "react-ga";
import { Backdrop, Fade, Modal, IconButton, Typography } from "@material-ui/core";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { Help, Pause, PlayArrow, Replay } from "@material-ui/icons";
import reducer, { initialState } from "../state/reducer";
import { TIME_BETWEEN_MOVES_IN_MS } from "../state/constants";

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
  const [isPlaying, setIsPlaying] = useState(false);

  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    day,
    people,
    historicalInfectedCount,
    gridSize,
    boardSize,
    peopleDensity,
    topOfTheCurve,
    demographicPercentages,
  } = state;

  const gameMetrics = { gridSize, boardSize, peopleDensity };

  const infectedPeopleCount = people.filter(checkInfected).length;

  useEffect(() => {
    const playingInterval = setInterval(() => {
      if (!isPlaying || infectedPeopleCount === 0) {
        clearInterval(playingInterval);
        return;
      }
      dispatch({ type: "INCREMENT_DAY" });
    }, TIME_BETWEEN_MOVES_IN_MS);
    return () => {
      clearInterval(playingInterval);
    };
  }, [isPlaying, infectedPeopleCount]);

  const handlePlay = () => {
    setIsPlaying(true);
  };
  const handlePause = () => {
    setIsPlaying(false);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    initializeReactGA();
  });

  useEffect(() => {
    dispatch({ type: "RESTART" });
  }, [dispatch]);

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
          See how mask usage and social distancing help keep the curve as low as possible!
        </h2>
        <div className={indexStyles.mainStats}>
          <div>Day: {day}</div>
          <div>Top of the curve: {Math.floor(topOfTheCurve)}%</div>
          {isPlaying ? (
            <IconButton
              type='button'
              color='primary'
              style={{ backgroundColor: `white` }}
              size='small'
              edge={false}
              onClick={handlePause}
              disabled={infectedPeopleCount === 0}
            >
              <Pause />
            </IconButton>
          ) : (
            <IconButton
              type='button'
              color='primary'
              style={{ backgroundColor: `white` }}
              size='small'
              edge={false}
              onClick={handlePlay}
            >
              <PlayArrow />
            </IconButton>
          )}

          <IconButton
            type='button'
            color='primary'
            style={{ backgroundColor: `white` }}
            size='small'
            edge={false}
            onClick={() => {
              setIsPlaying(false);
              dispatch({ type: "RESTART" });
            }}
          >
            <Replay />
          </IconButton>
        </div>
        <div className={indexStyles.stats}>
          <div>
            <span style={{ color: `rgba(255, 0, 0, 0.8)` }}>{infectedPeopleCount}</span> infected
          </div>
          <div>
            <span style={{ color: `#57c1ff` }}>{curedPeopleCount}</span> recovered
          </div>
        </div>
        <div className={indexStyles.boardWrapper}>
          <div className={indexStyles.boardBackground} />
          <Graph
            historicalInfectedCount={historicalInfectedCount}
            totalPeopleCount={totalPeopleCount}
          />
          <Board {...gameMetrics} people={people} day={day} gridSize={gridSize} />
        </div>

        <SimulatorSettingsForm
          dispatch={dispatch}
          demographicPercentages={demographicPercentages}
        />
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
