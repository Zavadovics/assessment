import { useEffect, useState } from "react";
import { useParams } from "react-router";
import UserForm from "../components/UserForm";

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  console.log("user", user);

  useEffect(() => {
    fetch(`https://assessment-users-backend.herokuapp.com/users/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((jsonRes) => {
        setUser(jsonRes);
      });
  }, [id]);

  return (
    <main className="container">
      <h3>Edit user</h3>
      {user && <UserForm type={"edit"} user={user} />}
    </main>
  );
};

export default EditUser;
