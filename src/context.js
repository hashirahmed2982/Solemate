import React, { useState, useContext } from "react";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [navCheck, setNavCheck] = useState(true);

  return (
    <AppContext.Provider
      value={{
        navCheck,
        setNavCheck,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

// import AppProvider in index.js
