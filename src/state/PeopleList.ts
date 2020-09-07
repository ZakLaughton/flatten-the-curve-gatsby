import { Person, Location } from "../typings/gameTypes";
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
        if (["SOCIALLY_DISTANCED", "QUARANTINED"].includes(person.mobility)) return newPeople;
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
        (person) => person.infectedDay !== -1 && !person.isCured && day - person.infectedDay > 19
      )
      .map((person) => person.id);

    this._peopleList = this._peopleList.map((person) => {
      if (peopleToRecover.includes(person.id)) person.isCured = true;
      return person;
    });

    return this;
  }

  infect(day: number) {
    const contagiousPeople = this._peopleList.filter(
      (person) => person.infectedDay >= 0 && !person.isCured && person.mobility !== "QUARANTINED"
    );
    const infectionZones = contagiousPeople
      .map((person) => {
        const neighborLocations = getSurroundingCells(person.location, this._gridSize)
          .filter((location) => ["N", "E", "S", "W"].includes(location.direction))
          .map((surroundingCell) => surroundingCell.coordinates);

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
        const chanceOfGettingInfected = person.mobility === "SOCIALLY_DISTANCED" ? 0.1 : 0.9;
        if (Math.random() <= chanceOfGettingInfected) person.infectedDay = day;
      }
      return person;
    });

    return this;
  }

  quarantine() {
    // Experimental: auto-quarantine symptomatic people
    // movedInfectedPeople = movedInfectedPeople.map(person => {
    //   const { isCured, infectedDay } = person
    //   if (!isCured && infectedDay >= 0 && newDayNumber - infectedDay >= 5) {
    //     person.mobility = "QUARANTINED"
    //   }
    //   return person
    // })
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
