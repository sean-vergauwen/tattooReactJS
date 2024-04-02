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
        <div class="container d-flex justify-content-center align-items-center min-vh-100">
          <div class="row border rounded-3 p-3 bg-white shadow box-area">
            <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                <div
                  class="nav-link p-3 mb-2 bg-dark text-white "
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
                <label class="form-label" htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={form.username}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label class="form-label" htmlFor="usernamepassword">Mot de passe</label>
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

        <div class="container d-flex justify-content-center align-items-center min-vh-100">
          <div class="row border rounded-3 p-3 bg-white shadow box-area">
            <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
                <div
                  class="nav-link p-3 mb-2 bg-dark text-white"
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
                <label class="form-label" htmlFor="tatooname">Nom de tatoueur</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label class="form-label" htmlFor="tatoonamepassword">Mot de passe</label>
                <input
                  type="text"
                  className="form-control"
                  id="tatoonamepassword"
                  value={form.tatoonamepassword}
                  onChange={(e) => updateForm({ position: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label class="form-label" htmlFor="tatoonameaddress">Adresse</label>
                <input
                  type="text"
                  className="form-control"
                  id="tatoonameaddress"
                  value={form.tatoonameaddress}
                  onChange={(e) => updateForm({ position: e.target.value })}
                />
              </div>
              <div className="form-outline mb-4">
                <label class="form-label" htmlFor="tatoonamewebsite">Site web</label>
                <input
                  type="text"
                  className="form-control"
                  id="tatoonamewebsite"
                  value={form.tatoonamewebsite}
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
      </div>
  </div>
 );
}