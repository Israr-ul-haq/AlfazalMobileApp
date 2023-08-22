import React, { createContext, useState } from "react";

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [isWelcomeScreen, setIsWelcomeScreen] = useState(false);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartData, setCartData] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        grandTotal,
        setGrandTotal,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
