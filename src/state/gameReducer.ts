import { checkInfected, shuffleArray } from "../utils/utils";
import { PeopleList } from "./PeopleList";
import { Mobility } from "../typings/gameTypes";

export const initialState = {
  day: 0,
  people: [],
  historicalInfectedCount: [{ day: 0, count: 0 }],
  gridSize: 19,
  boardSize: 500,
  peopleDensity: 0.3,
  topOfTheCurve: 0,
};

interface State {
  day: number;
  people: Person[];
  historicalInfectedCount: DailyStat[];
  gridSize: number;
  boardSize: number;
  peopleDensity: number;
  topOfTheCurve: number;
}

export interface Person {
  id: number;
  location: Location;
  infectedDay: number;
  isCured: boolean;
  mobility: Mobility;
}

interface DailyStat {
  day: number;
  count: number;
}

export interface Location {
  x: number;
  y: number;
}

export default function reducer(state: State, { type, payload }) {
  switch (type) {
    case "INCREMENT_DAY": {
      const newDayNumber = state.day + 1;

      const peopleList = new PeopleList([...state.people], state.gridSize);

      peopleList.move().recover(state.day).infect(state.day);
      const newInfectedPeopleCount = peopleList.peopleList.filter(checkInfected).length;
      const infectedPercentage = (newInfectedPeopleCount / state.people.length) * 100;

      return {
        ...state,
        day: newDayNumber,
        people: peopleList.peopleList,
        historicalInfectedCount: [
          ...state.historicalInfectedCount,
          { day: newDayNumber, count: newInfectedPeopleCount },
        ],
        topOfTheCurve:
          infectedPercentage > state.topOfTheCurve ? infectedPercentage : state.topOfTheCurve,
      };
    }

    case "UPDATE_PERSON_MOBILITY": {
      const newPeople = [...state.people];
      const personIndex = newPeople.findIndex((person) => person.id === payload.id);
      newPeople[personIndex].mobility = payload.mobility;

      return { ...state, people: newPeople };
    }
    case "RESTART": {
      return init(initialState);
    }
    default: {
      return state;
    }
  }
}

export function init(initialState: State) {
  const { gridSize, peopleDensity } = initialState;
  const numberOfPeople = Math.floor(gridSize * gridSize * peopleDensity) || 4;
  const generateInitialPeople = () => {
    const allPositions = generateAllPositions();
    let shuffledLocations = shuffleArray(allPositions);
    const people = shuffledLocations
      .slice(0, numberOfPeople)
      .map((location: Location, index: number) => {
        return {
          id: index,
          location,
          infectedDay: -1,
          isCured: false,
          mobility: "FREE",
        };
      });
    return people;
  };

  function generateAllPositions() {
    let positionList = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        positionList.push({ x, y });
      }
    }
    return positionList;
  }

  function coordinatesAreInTheMiddleArea(person) {
    return (
      person.location.x <= gridSize * 0.75 &&
      person.location.y <= gridSize * 0.75 &&
      person.location.x >= gridSize * 0.25 &&
      person.location.y >= gridSize * 0.25
    );
  }

  const initialPeople = generateInitialPeople();
  const peopleInTheMiddle = initialPeople.filter(coordinatesAreInTheMiddleArea);
  const indexToInfect = peopleInTheMiddle[Math.floor(Math.random() * peopleInTheMiddle.length)].id;
  initialPeople[indexToInfect].infectedDay = 0;
  return { ...initialState, people: initialPeople };
}

export function getSurroundingCells(location: Location, gridSize: number) {
  const { x, y } = location;
  let surroundingCells = [
    { direction: "N", coordinates: { x: x + 0, y: y + 1 } },
    { direction: "NE", coordinates: { x: x + 1, y: y + 1 } },
    { direction: "E", coordinates: { x: x + 1, y: y + 0 } },
    { direction: "SE", coordinates: { x: x + 1, y: y - 1 } },
    { direction: "S", coordinates: { x: x + 0, y: y - 1 } },
    { direction: "SW", coordinates: { x: x - 1, y: y - 1 } },
    { direction: "W", coordinates: { x: x - 1, y: y + 0 } },
    { direction: "NW", coordinates: { x: x - 1, y: y + 1 } },
  ];

  if (isOnLeftEdge(location))
    surroundingCells = surroundingCells.filter(
      (move) => !["NW", "W", "SW"].includes(move.direction)
    );
  if (isOnBottomEdge(location))
    surroundingCells = surroundingCells.filter(
      (move) => !["SW", "S", "SE"].includes(move.direction)
    );
  if (isOnRightEdge(location))
    surroundingCells = surroundingCells.filter(
      (move) => !["SE", "E", "NE"].includes(move.direction)
    );
  if (isOnTopEdge(location))
    surroundingCells = surroundingCells.filter(
      (move) => !["NE", "N", "NW"].includes(move.direction)
    );

  return surroundingCells;

  function isOnLeftEdge(location: Location) {
    return location.x === 0;
  }
  function isOnBottomEdge(location: Location) {
    return location.y === 0;
  }
  function isOnRightEdge(location: Location) {
    return location.x === gridSize - 1;
  }
  function isOnTopEdge(location: Location) {
    return location.y === gridSize - 1;
  }
}
