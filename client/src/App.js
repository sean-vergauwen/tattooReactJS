import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Content from "./components/Content";
import Edit from "./components/edit";
import Create from "./components/create";
import Carte from "./components/carte";
import TatoueurProfil from "./components/TatoueurProfil";
import styles from "./App.module.css";
import "./assets/styles/index.css"
import "./assets/styles/_base.css"
import "./assets/styles/_flex.css"
import "./assets/styles/_themes.css"
import "./assets/styles/_utils.css"
import "./assets/styles/_variables.css"

const App = () => {
  return (
    <div className={`d-flex flex-column ${styles.appContainer}`}>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Content />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/create" element={<Create />} />
        <Route path="/carte" element={<Carte />} />
        <Route path="/tatoueur/:id" element={<TatoueurProfil />} />
      </Routes>

    </div>
  );
};
export default App;