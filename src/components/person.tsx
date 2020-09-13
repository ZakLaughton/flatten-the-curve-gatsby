import React from "react";
import personStyles from "./person.module.scss";
import { useStaticQuery, graphql } from "gatsby";
import { Person as IPerson } from "../typings/gameTypes";

function Person({
  personData,
  gridSize,
  day,
}: {
  personData?: IPerson;
  gridSize: number;
  day: number;
}) {
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
    <div style={style} className={personStyles.personContainer}>
      <div className={className}></div>
      <div className={personStyles.personShadow} />
      {personData?.isMasked && <FaceMask />}
      {personData?.isSociallyDistanced && <SociallyDistancedSquare />}
      {personData?.isQuarantined && <QuarantinedSquare />}
    </div>
  );
}

const SociallyDistancedSquare = () => <div className={personStyles.sociallyDistancedSquare} />;
const QuarantinedSquare = () => <div className={personStyles.quarantinedSquare} />;
const FaceMask = () => {
  const data = useStaticQuery(graphql`
    {
      file(name: { eq: "mask" }) {
        publicURL
      }
    }
  `);
  return <img className={personStyles.faceMask} src={data.file.publicURL} alt='mask' />;
};

/**
 * DEMO PEOPLE FOR FORM ICONS
 */

export const SociallyDistancedPerson = () => (
  <div className={`${personStyles.icon}`}>
    <div className={`${personStyles.person}`}></div>
    <SociallyDistancedSquare />
  </div>
);

export const MaskedPerson = () => (
  <div className={`${personStyles.icon}`}>
    <div className={`${personStyles.person}`}></div>
    <FaceMask />
  </div>
);

export default Person;
