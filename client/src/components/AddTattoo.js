import React, { useState, useEffect } from "react";
import styles from "./content.module.css";

export default function AddTattoo() {
  const [form, setForm] = useState({
    name: "",
    description: "",
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
