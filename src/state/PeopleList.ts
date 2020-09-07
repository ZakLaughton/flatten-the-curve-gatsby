import { Person, Location, getSurroundingCells } from "./gameReducer";
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
