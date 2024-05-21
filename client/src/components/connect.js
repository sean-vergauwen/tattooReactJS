import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Connect() {
  // Notez que l'état initial pour styleId est maintenant un tableau
  const [form, setForm] = useState({
    userName: "",
    password: "",
  });
  const [userLogin, setUserLogin] = useState({
    userName: "",
    password: "",
  });
  const [storageData, setStoragedata] = useState();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    const userData = JSON.parse(data);
    setStoragedata(userData);
  }, []);

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/user/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLogin),
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        localStorage.setItem(
          "token",
          JSON.stringify(responseData?.data?.token)
        );
        setStoragedata(responseData);
        localStorage.setItem("userData", JSON.stringify(responseData));
        navigate("/");
      } else {
        window.alert(responseData?.message);
      }
      setUserLogin({ userName: "", password: "" });
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  };

  const onSubmitArtist = async (e) => {
    e.preventDefault();
    const atristLogin = {
      userName: form?.userName,
      password: form?.password,
    };

    try {
      const response = await fetch(
        "http://localhost:3001/artist/artist-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(atristLogin),
        }
      );
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        localStorage.setItem(
          "token",
          JSON.stringify(responseData?.data?.token)
        );

        localStorage.setItem("userData", JSON.stringify(responseData));
        setStoragedata(responseData);
        navigate("/");
      } else {
        window.alert(responseData?.message);
      }
      setForm({ userName: "", password: "" });
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  };

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <div id="container" class="d-flex">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="row border rounded-3 p-3 bg-white shadow box-area">
            <ul
              className="nav nav-pills nav-justified mb-3"
              id="ex1"
              role="tablist"
            >
              <div
                className="nav-link p-3 mb-2 bg-dark text-white "
                id="tab-login"
                data-mdb-pill-init
                href="#pills-login"
                role="tab"
                aria-controls="pills-login"
                aria-selected="true"
              >
                {" "}
                UTILISATEUR
              </div>
            </ul>
            <form onSubmit={onSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="username">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={userLogin.userName}
                  onChange={(e) =>
                    setUserLogin({ ...userLogin, userName: e.target.value })
                  }
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="usernamepassword">
                  Mot de passe
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="usernamepassword"
                  value={userLogin.password}
                  onChange={(e) =>
                    setUserLogin({ ...userLogin, password: e.target.value })
                  }
                />
              </div>
              <div className="form-outline mb-4 d-flex justify-content-center ">
                <input
                  type="submit"
                  value="Se connecter"
                  className="btn btn-dark"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="row border rounded-3 p-3 bg-white shadow box-area">
            <ul
              className="nav nav-pills nav-justified mb-3"
              id="ex1"
              role="tablist"
            >
              <div
                className="nav-link p-3 mb-2 bg-dark text-white"
                id="tab-login"
                data-mdb-pill-init
                href="#pills-login"
                role="tab"
                aria-controls="pills-login"
                aria-selected="true"
              >
                TATOUEUR
              </div>
            </ul>
            <form onSubmit={onSubmitArtist}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="name">
                  Nom de tatoueur
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={form.userName}
                  onChange={(e) =>
                    setForm({ ...form, userName: e.target.value })
                  }
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="form-outline mb-4 d-flex justify-content-center ">
                <input
                  type="submit"
                  value="Se connecter"
                  className="btn btn-dark"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
