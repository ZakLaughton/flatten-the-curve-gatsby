import React, { useReducer } from "react";
import reducer, { initialState } from "./gameReducer";

export const GameContext = React.createContext(null);

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GameContext.Provider value={[state, dispatch]}>
      {children}
    </GameContext.Provider>
  );
};
