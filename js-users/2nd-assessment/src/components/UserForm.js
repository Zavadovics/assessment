import { useState, useRef } from "react";
import InputField from "../components/InputField";

const UserForm = ({ type, user }) => {
  //   const id = type === "edit" ? user.id : null;

  //   console.log("type", type);
  //   console.log("user", user);
  //   console.log("id", id);

  const [formData, setFormData] = useState(
    type === "edit"
      ? {
          firstName: user.first_name,
          lastName: user.last_name,
        }
      : {
          firstName: "",
          lastName: "",
        }
  );

  //   const messageTypes = Object.freeze({
  //     success: "Sikeres mentés!",
  //     fail: "Sikertelen mentés",
  //   });

  const [formWasValidated, setFormWasValidated] = useState(false);

  const references = {
    firstName: useRef(),
    lastName: useRef(),
  };

  const formErrorTypes = Object.freeze({
    required: "This field can not be empty",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
  });

  const [alert, setAlert] = useState(null);

  const isNotEmpty = (value) => {
    return value !== "";
  };

  const validators = {
    firstName: {
      required: isNotEmpty,
    },
    lastName: {
      required: isNotEmpty,
    },
  };

  const validateField = (fieldName) => {
    const value = formData[fieldName];
    let isValid = true;
    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
    references[fieldName].current.setCustomValidity("");

    if (validators[fieldName] !== undefined) {
      for (const [validationType, validatorFn] of Object.entries(
        validators[fieldName]
      )) {
        if (isValid !== false) {
          isValid = validatorFn(value);
          if (!isValid) {
            const errorText = formErrorTypes[validationType];
            setFormErrors((prev) => ({
              ...prev,
              [fieldName]: errorText,
            }));
            references[fieldName].current.setCustomValidity(errorText);
          }
        }
      }
    }
    return isValid;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const fieldName = e.target.name;

    e.target.setCustomValidity("");

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleBlur = (e) => {
    const name = e.target.name;
    validateField(name);
  };

  const isFormValid = () => {
    let isFormValid = true;
    for (const fieldName of Object.keys(formData)) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
    return isFormValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.persist();

    setAlert(null);
    setFormErrors({
      firstName: "",
      lastName: "",
    });
    setFormWasValidated(false);
    const isValid = isFormValid();

    if (isValid) {
      if (type === "new") {
        await fetch(`https://assessment-users-backend.herokuapp.com/users`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            status: "active",
          }),
        })
          .then(async (res) => {
            console.log("res", res);
            if (res.status !== 201) {
              const response = await res.json();
              throw new Error(response?.message);
            }
            return res.json();
          })
          .then(() => {
            setAlert({
              alertType: "success",
              message: "New user has been saved",
            });
            setFormData({
              firstName: "",
              lastName: "",
            });
            e.target.reset();
          })
          .catch((err) => {
            setAlert({ alertType: "danger", message: err.message });
          });
      }
      if (type === "edit") {
        await fetch(
          `https://assessment-users-backend.herokuapp.com/users/${user.id}`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: formData.firstName,
              last_name: formData.lastName,
            }),
          }
        )
          .then(async (res) => {
            console.log("res", res);
            if (res.status !== 204) {
              const response = await res.json();
              throw new Error(response?.message);
            }
            return res.json();
          })
          .then((res) => {
            console.log("user details updated", res);
            setAlert({
              alertType: "success",
              message: "User details have been updated",
            });
          })
          .catch((err) => {
            console.log(err.message);
            setAlert({ alertType: "danger", message: err.message });
          });
      }
      setFormWasValidated(false);
    } else {
      setFormWasValidated(true);
    }
  };

  return (
    <section className="container-md mt-4">
      <form
        onSubmit={handleSubmit}
        noValidate={true}
        className={`needs-validation ${formWasValidated && "was-validated"}`}
      >
        <InputField
          id="firstName"
          name="firstName"
          labelText="First Name"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          reference={references["firstName"]}
          error={formErrors.firstName}
        />

        <InputField
          id="lastName"
          name="lastName"
          labelText="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          reference={references["lastName"]}
          error={formErrors.lastName}
        />

        {type === "edit" ? (
          <button type="submit" className="btn btn-primary m-2">
            Update
          </button>
        ) : (
          <button type="submit" className="btn btn-primary m-2">
            Add
          </button>
        )}

        {alert && (
          <div className={`alert alert-${alert.alertType}`}>
            {alert.message}
          </div>
        )}
      </form>
    </section>
  );
};

export default UserForm;
