import React from "react";
import { VictoryArea, VictoryContainer } from "victory";

export const Graph = ({ historicalInfectedCount, totalPeopleCount }) => {
  return (
    <VictoryArea
      interpolation='cardinal'
      data={historicalInfectedCount}
      x='day'
      y='count'
      animate={{ duration: 300 }}
      style={{ data: { fill: `rgba(255, 0, 0, 0.6)` } }}
      domain={{ y: [0, totalPeopleCount] }}
      padding={0}
      height={500}
      width={500}
    />
  );
};

export default Graph;
