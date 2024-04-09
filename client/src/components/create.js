import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Create() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const navigate = useNavigate();
  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };
    await fetch("http://localhost:5001/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
      .catch(error => {
        window.alert(error);
        return;
      });
    setForm({ name: "", position: "", level: "" });
    navigate("/");
  }
  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <div id="container" class="d-flex">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="row border rounded-3 p-3 bg-white shadow box-area">
            <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
              <div
                className="nav-link p-3 mb-2 bg-dark text-white "
                id="tab-login"
                data-mdb-pill-init
                href="#pills-login"
                role="tab"
                aria-controls="pills-login"
                aria-selected="true"
              > UTILISATEUR</div>
            </ul>
            <form onSubmit={onSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={form.username}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="usernamepassword">Mot de passe</label>
                <input
                  type="text"
                  className="form-control"
                  id="usernamepassword"
                  value={form.usernamepassword}
                  onChange={(e) => updateForm({ position: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4 d-flex justify-content-center ">
                <input
                  type="submit"
                  value="Créer"
                  className="btn btn-dark"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="row border rounded-3 p-3 bg-white shadow box-area">
            <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
              <div
                className="nav-link p-3 mb-2 bg-dark text-white"
                id="tab-login"
                data-mdb-pill-init
                href="#pills-login"
                role="tab"
                aria-controls="pills-login"
                aria-selected="true"
              >TATOUEUR</div>
            </ul>
            <form onSubmit={onSubmit}>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="name">Nom de tatoueur</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="password">Mot de passe</label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  value={form.password}
                  onChange={(e) => updateForm({ password: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="address">Adresse</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  value={form.address}
                  onChange={(e) => updateForm({ address: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="website">Site web</label>
                <input
                  type="text"
                  className="form-control"
                  id="website"
                  value={form.website}
                  onChange={(e) => updateForm({ website: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4 d-flex justify-content-center ">
                <input
                  type="submit"
                  value="Créer"
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