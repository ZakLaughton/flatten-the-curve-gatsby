import React from "react"
import { VictoryArea } from "victory"

export const Graph = ({ historicalInfectedCount, totalPeopleCount }) => {
  return (
    <VictoryArea
      interpolation="cardinal"
      data={historicalInfectedCount}
      x="day"
      y="count"
      animate={{ duration: 300 }}
      style={{ data: { fill: `rgba(255, 0, 0, 0.6)` } }}
      domain={{ y: [0, totalPeopleCount] }}
      padding={0}
      height={800}
      width={800}
    />
  )
}

export default Graph
