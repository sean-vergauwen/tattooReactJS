import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

export default function Navbar() {
  const [storageData, setStorageData] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const userData = JSON.parse(data);
    if (userData) {
      setStorageData(userData);
    }
  }, [location.pathname]);

  const handleNavigateConnectPage = async () => {
    // await localStorage.clear();
    await navigate("/connect");
    await window.location.reload();
  };

  const handleNavigateCreateAccPage = async () => {
    // await localStorage.clear();
    await navigate("/create");
    await window.location.reload();
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();

    navigate("/connect");
  };

  return (
    <nav className="navbar navbar-expand-lg text-light bg-dark ">
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
        <div
          class="collapse navbar-collapse justify-content-around"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav mr-auto">
            {storageData && location.pathName !== "connect" && (
              <>
                <li class="nav-item border rounded border-light mx-3">
                  <a
                    aria-current="page"
                    class="nav-link text-light active btn"
                    href="/"
                  >
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
              </>
            )}
            {storageData?.data?.user?.role === "Admin" && (
              <li class="nav-item border rounded border-light mx-3">
                <a class="nav-link text-light btn" href="/add-tattoo">
                  ajouter un tatouage
                </a>
              </li>
            )}
            <li class="nav-item border rounded border-light mx-3">
              <a
                class="nav-link text-light btn"
                onClick={handleNavigateConnectPage}
              >
                Se connecter
              </a>
            </li>
            {/* {storageData == "" && ( */}
            <li class="nav-item border rounded border-light mx-3">
              <a
                class="nav-link text-light btn"
                onClick={handleNavigateCreateAccPage}
              >
                Créer un compte
              </a>
            </li>
            {/* )} */}
            {storageData != "" && (
              <li class="nav-item border rounded border-light mx-3">
                <a class="nav-link text-light btn" onClick={handleLogout}>
                  Se Deconnector
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
