/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from "react"
import { GameProvider } from "./src/context/gameProvider"

export const wrapRootElement = ({ element }) => (
  <GameProvider>{element}</GameProvider>
)
