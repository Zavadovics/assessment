import { useEffect, useState } from "react";
import { useParams } from "react-router";
import UserForm from "../components/UserForm";

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    //     AttractionRepository.getOneById(id).then((atr) => {
    //       setUser(atr);
    //     });
    setUser("whatever");
  }, [id]);

  return (
    <main className="container">
      <h3>Edit user</h3>
      {user && <UserForm type={"edit"} user={user} />}
    </main>
  );
};

export default EditUser;
