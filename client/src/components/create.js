import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Select from 'react-select';

export default function Create() {
  // Notez que l'état initial pour styleId est maintenant un tableau
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
    styleId: [],
  });
  const [records, setRecords] = useState([]);

  const styleOptions = records.map((record) => ({
    value: record._id,
    label: record.nomStyle
  }));

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5001/style/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
  }, []);

  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  // Cette fonction est mise à jour pour gérer les multiples sélections
  function handleStyleChange(selectedOptions) {
    // Mise à jour de 'styleId' avec les identifiants sélectionnés
    const styleIds = selectedOptions.map((option) => option.value);
    updateForm({ styleId: styleIds });
  }

  async function onSubmit(e) {
    e.preventDefault();
    // Ici, la soumission inclut l'ensemble de l'état du formulaire, y compris le tableau des styles sélectionnés
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

    // Réinitialiser le formulaire après la soumission
    setForm({ name: "", position: "", level: "", styleId: [] });
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
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="style">Style de Tatouage</label>
                <Select
      isMulti
      name="styles"
      options={styleOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={handleStyleChange}
      value={styleOptions.filter(option => form.styleId.includes(option.value))}
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