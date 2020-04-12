/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from "react"
import { GameProvider } from "./src/context/gameProvider"

export const wrapRootElement = ({ element }) => (
  <GameProvider>{element}</GameProvider>
)
