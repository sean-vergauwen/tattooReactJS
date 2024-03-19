import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          AppTattoo
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" exact>
                Accueil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/favoris">
                Mes Favoris
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/carte">
                La Carte
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/compte">
                Compte
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
