import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import UserList from "./components/UserList";
import NewUser from "./components/NewUser";
import EditUser from "./components/EditUser";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav className="navbar">
          <Link className="navlink" to="/">
            List Users
          </Link>
          <Link className="navlink" to="/new">
            New User
          </Link>
          <Link className="navlink" to="/edit/:id">
            Edit User
          </Link>
        </nav>
        <h1 className="my-5">User List Application</h1>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/new" element={<NewUser />} />
          <Route path="/edit/:id" element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
