import React, { useState, useEffect } from "react";
import styles from "./content.module.css";
import Select from "react-select";

export default function AddTattoo() {
  const options = [
    { value: "Traditionnel", label: "Traditionnel" },
    { value: "Réaliste", label: "Réaliste" },
    { value: "Blackwork", label: "Blackwork" },
    { value: "Dotwork", label: "Dotwork" },
    { value: "Géométrique", label: "Géométrique" },
    { value: "Biomechanical", label: "Biomechanical" },
    { value: "Celtique", label: "Celtique" },
    { value: "Polynésien", label: "Polynésien" },
    { value: "Minimaliste", label: "Minimaliste" },
    { value: "Abstrait", label: "Abstrait" },
    { value: "Mandala", label: "Mandala" },
    { value: "Black & Grey", label: "Black & Grey" },
    { value: "Old School", label: "Old School" },
    { value: "Maori", label: "Maori" },
    { value: "Pointillisme", label: "Pointillisme" },
    { value: "Japonais", label: "Japonais" },
    { value: "Neo traditionnel", label: "Neo traditionnel" },
    { value: "Trash Polka", label: "Trash Polka" },
    { value: "Sketch", label: "Sketch" },
    { value: "Linework", label: "Linework" },
    { value: "Surréaliste", label: "Surréaliste" },
    { value: "Portrait", label: "Portrait" },
    { value: "Tribal", label: "Tribal" },
    { value: "Aquarelle", label: "Aquarelle" },
    { value: "Horreur", label: "Horreur" },
    { value: "Lettering", label: "Lettering" },
  ];
  const [form, setForm] = useState({
    name: "",
    description: "",
    tattooStyle: "",
  });
  const [image, setImage] = useState();
  const [userData, setUserData] = useState();
  useEffect(() => {
    const data = localStorage.getItem("userData");
    const storageData = JSON.parse(data);
    setUserData(storageData);
  }, []);

  const addTattoo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("image", image?.image);
    formData.append("tattooStyle", form?.tattooStyle);

    try {
      const response = await fetch("http://localhost:3000/artist/add-tattoo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData?.data?.token}`,
        },
        body: formData,
      });
      const responseData = await response.json();
      if (responseData.statusCode === 200) {
        setForm({ name: "", description: "", image: "" });
        window.alert("tattoo added succeessfully");
      } else {
        window.alert(responseData?.message);
      }
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  };

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  const handleUploadImage = (e) => {
    const file = e.target.files[0];

    setImage((prevForm) => ({
      ...prevForm,
      image: file,
    }));
  };

  function handleStyleChange(selectedOptions) {
    let selectedStyleIds = "";
    if (Array.isArray(selectedOptions)) {
      selectedStyleIds = selectedOptions
        .map((option) => option.value)
        .join(", ");
    } else {
      // Handle the case where selectedOptions is not an array
      console.error("Selected options is not an array:", selectedOptions);
    }
    setForm((prevForm) => ({
      ...prevForm,
      tattooStyle: selectedOptions?.label,
    }));
  }

  return (
    <div
      className={`my-30 d-flex flex-row justify-content-center allign-items-center `}
    >
      <div
        className={`my-30 flex-fill allign-items-center card p-20 ${styles.contentCard}`}
      >
        <div>
          <h3
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
              alignItems: "center",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Add tattoo
          </h3>
          <form
            onSubmit={addTattoo}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              width: "50vw",
            }}
          >
            <div className="form-group">
              <label htmlFor="name">Name: </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Description: </label>
              <textarea
                type="text"
                className="form-control"
                id="position"
                rows={5}
                value={form.position}
                onChange={(e) => updateForm({ description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Upload Image: </label>
              <input
                type="file"
                className="form-control"
                id="position"
                value={form.image}
                onChange={handleUploadImage}
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Select Tattoo: </label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                defaultValue={options[0]}
                onChange={handleStyleChange}
                name="styles"
                options={options}
              />
            </div>

            <div className="form-group">
              <input
                type="submit"
                value="Add tattoo"
                className="btn btn-primary"
                style={{ marginTop: "20px", marginBottom: "20px" }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
