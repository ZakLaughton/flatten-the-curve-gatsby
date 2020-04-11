import React from "react";
import { VictoryArea } from "victory";
import styled from "styled-components";

export const Graph = ({ historicalInfectedCount, totalPeopleCount }) => {
  return (
    <GraphContainer>
      <VictoryArea
        interpolation='cardinal'
        data={historicalInfectedCount}
        height={700}
        width={700}
        x='day'
        y='count'
        animate={{ duration: 300 }}
        style={{ data: { fill: `rgba(255, 0, 0, 0.6)` } }}
        domain={{ y: [0, totalPeopleCount] }}
        padding={0}
      />
    </GraphContainer>
  );
};

const GraphContainer = styled.div`
  height: 100%;
  width: 100%;
`;

export default Graph;
