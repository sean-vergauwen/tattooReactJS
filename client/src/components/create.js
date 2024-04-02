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
    <h3>Ajouter nouveau tatoueur</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Nom</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="position">Addresse</label>
         <input
           type="text"
           className="form-control"
           id="position"
           value={form.position}
           onChange={(e) => updateForm({ position: e.target.value })}
         />
       </div>
      <div className="form-group">
        <label htmlFor="website">Site Web</label> 
          <input
          type="text"
          className="form-control"
          id="positionIntern"
          value={form.level}
          onChange={(e) => updateForm({ level: e.target.value })}
          />
      </div>
       <div className="form-group">
         <input
           type="submit"
           value="Ajouter"
           className="btn btn-primary"
         />
       </div>

     </form>
   </div>
 );
}