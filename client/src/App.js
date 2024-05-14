import React from "react";
// We use Route in order to define the different routes of our application
import { BrowserRouter, Route, Routes } from "react-router-dom";
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Content from "./components/Content";
import Edit from "./components/edit";
import Create from "./components/create";
import Connect from "./components/connect";
import Carte from "./components/carte";
import TatoueurProfil from "./components/TatoueurProfil";
import styles from "./App.module.css";
import "./assets/styles/index.css";
import "./assets/styles/_base.css";
import "./assets/styles/_flex.css";
import "./assets/styles/_themes.css";
import "./assets/styles/_utils.css";
import "./assets/styles/_variables.css";
import AddTattoo from "./components/AddTattoo";
import Favoris from "./components/favoris";
import Protected from "./PrivateRoute";

const App = () => {
  return (
    <div className={`d-flex flex-column ${styles.appContainer}`}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Protected Component={Content} />} />
          <Route path="/edit/:id" element={<Protected Component={Edit} />} />
          <Route
            path="/add-tattoo"
            element={<Protected Component={AddTattoo} />}
          />
          <Route path="/create" element={<Create />} />
          <Route path="/carte" element={<Protected Component={Carte} />} />
          <Route path="/connect" element={<Connect />} />
          <Route
            path="/tatoueur/:id"
            element={<Protected Component={TatoueurProfil} />}
          />
          <Route path="/favoris" element={<Protected Component={Favoris} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
