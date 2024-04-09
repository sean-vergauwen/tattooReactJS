import React from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

export default function Navbar() {
  return (
    <nav  className="navbar navbar-expand-lg text-light bg-dark ">
      <div className="container">
        <NavLink className="navbar-brand text-light text-uppercase" to="/">
          AppTattoo
        </NavLink>
        <button
          className="navbar-toggler "
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-around" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item border rounded border-light mx-3">
              <a aria-current="page" class="nav-link text-light active btn" href="/">
                Accueil
              </a>
            </li>
            <li class="nav-item border rounded border-light mx-3">
              <a class="nav-link text-light btn" href="/favoris">
                Mes Favoris
              </a>
            </li>
            <li class="nav-item border rounded border-light mx-3">
              <a class="nav-link text-light btn " href="/carte">
                Carte
              </a>
            </li>
            <li class="nav-item border rounded border-light mx-3">
              <a class="nav-link text-light btn" href="/connect">
                Se connecter
              </a>
            </li>
            <li class="nav-item border rounded border-light mx-3">
              <a class="nav-link text-light btn" href="/create">
                Créer un compte
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
