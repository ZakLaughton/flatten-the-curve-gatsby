import { checkInfected, shuffleArray } from "../utils/utils";
import { Location, State, Person, ChangeableTypes } from "../typings/gameTypes";
import { PeopleList } from "./PeopleList";

export const initialState: State = {
  day: 0,
  people: [],
  historicalInfectedCount: [{ day: 0, count: 0 }],
  gridSize: 30,
  boardSize: 500,
  peopleDensity: 0.4,
  topOfTheCurve: 0,
  maskedPercent: 0,
  sociallyDistancedPercent: 50,
};

interface UpdatePersonBehaviorPayload {
  propertyName: ChangeableTypes;
  propertyValue: string | number | boolean;
  percentToTurnOn: number;
}

type Action =
  | { type: "INCREMENT_DAY" }
  | { type: "UPDATE_PERSON_BEHAVIOR"; payload: UpdatePersonBehaviorPayload }
  | { type: "RESTART" };

export default function reducer(state: State, action: Action) {
  switch (action.type) {
    case "INCREMENT_DAY":
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

      return { ...state, people: newPeopleList.peopleList };
    }
    case "RESTART":
      return init(initialState);
    default:
      return state;
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
          isMasked: false,
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
  const indexToInfect = peopleInTheMiddle[Math.floor(Math.random() * peopleInTheMiddle.length)].id;
  initialPeople[indexToInfect].infectedDay = 0;
  const finalList = new PeopleList([...initialPeople], gridSize).setPropertyForPercentageOfPeople({
    propertyName: "mobility",
    propertyValue: "SOCIALLY_DISTANCED",
    percentage: 50,
  }).peopleList;
  return { ...initialState, people: finalList };
}
