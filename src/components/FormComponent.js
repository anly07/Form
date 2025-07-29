import React, { useState } from "react";
import "./formSubmission.css";

const fields = [
  { name: "name", label: "Full Name", type: "text", validate: val => val.trim().length >= 3 },
  { name: "phone", label: "Phone", type: "tel", validate: val => /^[0-9]{10}$/.test(val) },
  { name: "email", label: "Email", type: "email", validate: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
  { name: "city", label: "City", type: "text", validate: val => val.trim().length >= 3 },
  { name: "sport", label: "Favorite Sport", type: "text", validate: val => val.trim().length > 0 },
  { name: "team", label: "Favorite Team", type: "text", validate: val => val.trim().length > 0 },
  { name: "icon", label: "Favorite Sports Icon", type: "text", validate: val => val.trim().length > 0 }
];

const FormComponent = () => {
  const initialState = Object.fromEntries(fields.map(f => [f.name, ""]));
  const [formData, setFormData] = useState(initialState);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [animateShake, setAnimateShake] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editError, setEditError] = useState({});

  const currentField = fields[step];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const value = formData[currentField.name];

    if (!currentField.validate(value)) {
      setError(`Please enter a valid ${currentField.label.toLowerCase()}.`);
      setAnimateShake(true);
      setFormData(prev => ({ ...prev, [currentField.name]: "" }));
      setTimeout(() => setAnimateShake(false), 500);
      return;
    }

    setError("");
    if (step < fields.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setSubmittedData(formData);
      setSuccessMsg("Form submitted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setStep(0);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditError({});
  };

  const handleSave = () => {
    const newErrors = {};
    fields.forEach(field => {
      if (!field.validate(formData[field.name])) {
        newErrors[field.name] = `Please enter a valid ${field.label.toLowerCase()}.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setEditError(newErrors);
      return;
    }

    setSubmittedData(formData);
    setIsEditing(false);
    setEditError({});
    setSuccessMsg("Form edited and submitted successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="form-wrapper">
      {successMsg && <div className="success-msg">{successMsg}</div>}

      {(!submittedData || isEditing) ? (
        <form className="form-container" onSubmit={handleNext}>
          {isEditing ? (
<div className="grid edit-grid">
  {fields.map((field, index) => (
    <React.Fragment key={index}>
      <div className="data-label">
        <label htmlFor={field.name}>{field.label}:</label>
      </div>
      <div className="data-value">
        <input
          id={field.name}
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          required
        />
        {editError[field.name] && (
          <div style={{ color: "red", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            {editError[field.name]}
          </div>
        )}
      </div>
    </React.Fragment>
  ))}
</div>

          ) : (
            <div className={`form-group ${animateShake ? "shake" : "fade-in"}`}>
              <label htmlFor={currentField.name}>{currentField.label}:</label>
              <input
                id={currentField.name}
                type={currentField.type}
                name={currentField.name}
                value={formData[currentField.name]}
                onChange={handleChange}
                required
              />
              {error && <small className="error">{error}</small>}
            </div>
          )}

          {!isEditing && (
            <button type="submit" className="main-btn">
              {step < fields.length - 1 ? "Next" : "Submit"}
            </button>
          )}

          {isEditing && (
            <div className="action-row">
              <button type="button" className="btn-save" onClick={handleSave}>Save</button>
              <button type="button" className="btn-edit" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
        </form>
      ) : (
        <div className="submitted-data fade-in">
          <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Submitted Data</h3>
          <div className="grid">
            {fields.map((field, index) => (
              <React.Fragment key={index}>
                <div className="data-label">{field.label}:</div>
                <div className="data-value">{submittedData[field.name]}</div>
              </React.Fragment>
            ))}
          </div>
          <div className="action-row">
            <button className="btn-edit" onClick={handleEdit}>Edit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
