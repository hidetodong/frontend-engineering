import React from "react";
import User from "./User";
import Todos from "./Todos";
import store from "./store";
import StoreContext from "./context";


const App = () => {
  return (
    <StoreContext.Provider value={ store }>
      <User />
      <hr />
      <Todos />
    </StoreContext.Provider>
  );
};

export default App
