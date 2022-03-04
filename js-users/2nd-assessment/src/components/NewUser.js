import React from "react";
import UserForm from "../components/UserForm";

const NewUser = () => {
  return (
    <main className="container">
      <h3>Add a new user</h3>
      <UserForm type="new" />
    </main>
  );
};

export default NewUser;
