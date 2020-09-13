import { checkInfected, shuffleArray } from "../utils/utils";
import { Location, State, Person, ChangeableTypes } from "../typings/gameTypes";
import { PeopleList } from "./PeopleList";
import { MOVES_PER_DAY, PEOPLE_DENSITY, GRID_SIZE } from "./constants";

export const initialState: State = {
  day: 0,
  movesToday: 0,
  people: [],
  historicalInfectedCount: [{ day: 0, count: 0 }],
  gridSize: GRID_SIZE,
  boardSize: 500,
  peopleDensity: PEOPLE_DENSITY,
  topOfTheCurve: 0,
  demographicPercentages: { isMasked: 10, isSociallyDistanced: 10 },
};

interface UpdatePersonBehaviorPayload {
  propertyName: ChangeableTypes;
  propertyValue: number | boolean;
  percentToTurnOn: number;
}

type Action =
  | { type: "MOVE_PEOPLE" }
  | { type: "INCREMENT_DAY" }
  | { type: "UPDATE_PERSON_BEHAVIOR"; payload: UpdatePersonBehaviorPayload }
  | { type: "RESTART" };

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case "INCREMENT_DAY": {
      const peopleList = new PeopleList([...state.people], state.gridSize);
      let newDayNumber = state.day;
      let newMovesToday = state.movesToday;
      let newHistoricalInfectedCount = state.historicalInfectedCount;

      peopleList.move().infect(state.day);
      newMovesToday += 1;

      const newInfectedPeopleCount = peopleList.peopleList.filter(checkInfected).length;

      if (newMovesToday === MOVES_PER_DAY) {
        newDayNumber = state.day + 1;
        newMovesToday = 0;

        newHistoricalInfectedCount = [
          ...state.historicalInfectedCount,
          { day: newDayNumber, count: newInfectedPeopleCount },
        ];

        peopleList.quarantine(newDayNumber).recover(newDayNumber);
      }

      const infectedPercentage = (newInfectedPeopleCount / state.people.length) * 100;

      return {
        ...state,
        day: newDayNumber,
        movesToday: newMovesToday,
        people: peopleList.peopleList,
        historicalInfectedCount: newHistoricalInfectedCount,
        topOfTheCurve:
          infectedPercentage > state.topOfTheCurve ? infectedPercentage : state.topOfTheCurve,
      };
    }

    case "UPDATE_PERSON_BEHAVIOR": {
      const {
        payload: { propertyName, propertyValue, percentToTurnOn },
      } = action;
      const newPeopleList = new PeopleList([...state.people], state.gridSize);
      newPeopleList.clearPropertyFromAllPeople(propertyName).setPropertyForPercentageOfPeople({
        propertyName,
        propertyValue,
        percentage: percentToTurnOn,
      }).peopleList;

      return {
        ...state,
        people: newPeopleList.peopleList,
        demographicPercentages: {
          ...state.demographicPercentages,
          [propertyName]: percentToTurnOn,
        },
      };
    }
    case "RESTART":
      return init({ initialState, currentState: state });
    default:
      return state;
  }
}

export function init({ initialState, currentState }: { initialState: State; currentState: State }) {
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
          isMasked: false,
          isCured: false,
          isSociallyDistanced: false,
          isQuarantined: false,
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

  function coordinatesAreInTheMiddleArea(person: Person) {
    return (
      person.location.x <= gridSize * 0.75 &&
      person.location.y <= gridSize * 0.75 &&
      person.location.x >= gridSize * 0.25 &&
      person.location.y >= gridSize * 0.25
    );
  }

  const initialPeople = generateInitialPeople();
  const peopleInTheMiddle = initialPeople.filter(coordinatesAreInTheMiddleArea);
  const indexToInfect = peopleInTheMiddle
    ? peopleInTheMiddle[Math.floor(Math.random() * peopleInTheMiddle.length)].id
    : initialPeople[Math.floor(Math.random() * initialPeople.length)].id;
  initialPeople[indexToInfect].infectedDay = 0;
  const finalList = new PeopleList([...initialPeople], gridSize)
    .setPropertyForPercentageOfPeople({
      propertyName: "isSociallyDistanced",
      propertyValue: true,
      percentage: currentState.demographicPercentages.isSociallyDistanced,
    })
    .setPropertyForPercentageOfPeople({
      propertyName: "isMasked",
      propertyValue: true,
      percentage: currentState.demographicPercentages.isMasked,
    }).peopleList;
  return {
    ...initialState,
    people: finalList,
    demographicPercentages: currentState.demographicPercentages,
  };
}
