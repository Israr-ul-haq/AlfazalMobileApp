import React, { createContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(false);
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartData, setCartData] = useState([]);

  return (
    <AppContext.Provider
      value={{
        isWelcomeScreen,
        setIsWelcomeScreen,
        user,
        setUser,
        data,
        setData,
        cartCount,
        setCartCount,
        cartData,
        setCartData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
