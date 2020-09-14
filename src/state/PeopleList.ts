import { Person, Location, ChangeableTypes } from "../typings/gameTypes";
import shuffle from "lodash.shuffle";

export class PeopleList {
  _peopleList: Person[];
  _gridSize: number;

  constructor(peopleList: Person[], gridSize: number) {
    this._peopleList = [...peopleList];
    this._gridSize = gridSize;
  }

  move() {
    this._peopleList = this._peopleList.reduce(
      (newPeople, person, index) => {
        if (person.isQuarantined) return newPeople;
        if (person.isSociallyDistanced) {
          if (Math.random() < 0.9) {
            return newPeople;
          }
        }
        const newLocation = calculateMove(person.location, this._gridSize);

        if (
          newPeople.some(
            (person) => person.location.x === newLocation.x && person.location.y === newLocation.y
          )
        ) {
          newPeople[index] = person;
        } else {
          newPeople[index] = { ...person, location: newLocation };
        }

        return newPeople;

        function calculateMove(location: Location, gridSize: number) {
          const possibleMoves = getSurroundingCells(location, gridSize);
          const newLocation = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

          return newLocation.coordinates;
        }
      },
      [...this._peopleList]
    );
    return this;
  }

  recover(day: number) {
    const peopleToRecover = this._peopleList
      .filter(
        (person) => person.infectedDay !== -1 && !person.isCured && day - person.infectedDay > 14
      )
      .map((person) => person.id);

    this._peopleList = this._peopleList.map((person) => {
      if (peopleToRecover.includes(person.id)) {
        person.isCured = true;
        person.isQuarantined = false;
      }
      return person;
    });

    return this;
  }

  infect(day: number) {
    const contagiousPeople = this._peopleList.filter(
      (person) => person.infectedDay >= 0 && !person.isCured && !person.isQuarantined
    );
    const infectionZones = contagiousPeople
      .map((person) => {
        const neighborLocations = getSurroundingCells(person.location, this._gridSize)
          .filter((location) => ["N", "E", "S", "W"].includes(location.direction))
          .map((surroundingCell) => surroundingCell.coordinates)
          .filter(() => (person.isMasked ? Math.random() < 0.15 : true));

        return neighborLocations;
      })
      .flat();
    this._peopleList = this._peopleList.map((person) => {
      if (
        person.infectedDay === -1 &&
        infectionZones.some(
          (infectionZone) =>
            person.location.x === infectionZone.x && person.location.y === infectionZone.y
        )
      ) {
        const chanceOfGettingInfected = person.isSociallyDistanced ? 0.5 : 0.95;
        if (Math.random() <= chanceOfGettingInfected) person.infectedDay = day;
      }
      return person;
    });

    return this;
  }

  clearPropertyFromAllPeople(propertyName: ChangeableTypes) {
    this._peopleList = this._peopleList.map((person) => ({ ...person, [propertyName]: false }));

    return this;
  }

  resetMobilityOnSociallyDistancedPeople() {
    this._peopleList = this._peopleList.map((person) =>
      person.isSociallyDistanced ? { ...person, isSociallyDistanced: true } : person
    );
    return this;
  }

  setPropertyForPercentageOfPeople({
    propertyName,
    propertyValue,
    percentage,
  }: {
    propertyName: ChangeableTypes;
    propertyValue: number | boolean;
    percentage: number;
  }) {
    const peopleIds = this._peopleList.map((person) => person.id);
    const numberOfPeopleToTurnOn = Math.floor((peopleIds.length * percentage) / 100);
    const idsToTurnOn: number[] = shuffle(peopleIds).slice(0, numberOfPeopleToTurnOn);

    this._peopleList = this._peopleList.map((person) => {
      if (idsToTurnOn.includes(person.id)) {
        return {
          ...person,
          [propertyName]: propertyValue,
        };
      }
      return person;
    });
    return this;
  }

  quarantine(day: number) {
    // Experimental: auto-quarantine symptomatic people
    this._peopleList = this._peopleList.map((person) => {
      const { isCured, infectedDay, doesSelfQuarantine } = person;
      if (doesSelfQuarantine && !isCured && infectedDay >= 0 && day - infectedDay >= 5) {
        person.isQuarantined = true;
        return person;
      }

      person.isQuarantined = false;
      return person;
    });

    return this;
  }

  get peopleList() {
    return this._peopleList;
  }
}

function getSurroundingCells(location: Location, gridSize: number) {
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
