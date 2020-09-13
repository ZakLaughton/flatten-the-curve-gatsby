import React from "react";
import personStyles from "./person.module.css";
import { useStaticQuery, graphql } from "gatsby";
import { Person as IPerson } from "../typings/gameTypes";

function Person({
  personData,
  gridSize,
  day,
}: {
  personData: IPerson;
  gridSize: number;
  day: number;
}) {
  const data = useStaticQuery(graphql`
    {
      file(name: { eq: "mask" }) {
        publicURL
      }
    }
  `);

  const { infectedDay, isCured, location } = personData;
  const isInfected = !isCured && infectedDay >= 0;
  const isSymptomatic = !isCured && infectedDay >= 0 && day - infectedDay >= 5;

  const cellSizeInPercent = 98 / gridSize;

  const className = `${personStyles.person} ${isCured ? personStyles.cured : ""} ${
    isInfected ? personStyles.infected : ""
  } ${isSymptomatic ? personStyles.symptomatic : ""}`;

  const style = {
    height: `${cellSizeInPercent}%`,
    width: `${cellSizeInPercent}%`,
    left: `${cellSizeInPercent * location.x + 1}%`,
    bottom: `${cellSizeInPercent * location.y + 1}%`,
  };

  return (
    <div className={className} style={style}>
      {personData.isSociallyDistanced && <div className={personStyles.sociallyDistancedSquare} />}
      {personData.isQuarantined && <div className={personStyles.quarantinedSquare} />}
      {personData.isMasked && <img src={data.file.publicURL} alt='mask' />}
      <div className={personStyles.personShadow} />
    </div>
  );
}

export default Person;
