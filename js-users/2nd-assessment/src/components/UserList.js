import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import DeleteModal from "./DeleteModal";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [userToBeDeleted, setUserToBeDeleted] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const deleteModalRef = useRef();

  useEffect(() => {
    fetch("https://assessment-users-backend.herokuapp.com/users", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.status < 200 || res.status >= 300) {
          const response = res.json();
          throw new Error(response?.message);
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setIsLoaded(true);
      })
      .catch((err) => {
        setAlert({ alertType: "danger", message: err.message });
      });
  }, [users]);

  const editUser = (cellContent, row) => {
    return (
      <Link to={`/edit/${row.id}`}>
        <button type="button" className="btn btn-sm btn-warning">
          Edit User
        </button>
      </Link>
    );
  };

  const toggleActivation = (cellContent, row) => {
    if (row.status === "active") {
      return (
        <button
          type="button"
          onClick={changeActivationStatus}
          id={row.id}
          className="btn btn-sm btn-primary"
        >
          Lock
        </button>
      );
    } else {
      return (
        <button
          type="button"
          onClick={changeActivationStatus}
          id={row.id}
          className="btn btn-sm btn-primary"
        >
          Activate
        </button>
      );
    }
  };

  const changeActivationStatus = (e) => {
    const id = e.target.id;
    const user = users.find((user) => user.id === parseInt(id));
    let newStatus = "";
    user.status === "locked" ? (newStatus = "active") : (newStatus = "locked");

    fetch(`https://assessment-users-backend.herokuapp.com/users/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((res) => {
        if (res.status < 200 || res.status >= 300) {
          const response = res.json();
          throw new Error(response?.message);
        }
        return res.json();
      })
      .then(() => {
        const updatedUsers = users.map((user) => user.id !== id);
        updatedUsers.push(user);
        setUsers(updatedUsers);
      })
      .catch((err) => {
        setAlert({ alertType: "danger", message: err.message });
      });
  };

  const handleDeleteConfirm = () => {
    const user = users.find((user) => user.id === parseInt(userToBeDeleted));
    fetch(`https://assessment-users-backend.herokuapp.com/users/${user.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status < 200 || res.status >= 300) {
          const response = res.json();
          throw new Error(response?.message);
        }
        return res.json();
      })
      .then(() => {
        setAlert({
          alertType: "success",
          message: "User has been deleted",
        });
        setUserToBeDeleted("");
      })
      .catch((err) => {
        setAlert({ alertType: "danger", message: err.message });
      });
  };

  const handleDeleteOnClick = (e) => {
    setUserToBeDeleted(e.target.dataset.id);
  };

  const deleteUser = (cellContent, row) => {
    return (
      <button
        type="button"
        onClick={handleDeleteOnClick}
        data-id={row.id}
        className="btn btn-sm btn-danger"
        data-bs-target="#myModal"
        data-bs-toggle="modal"
      >
        Delete
      </button>
    );
  };

  const columns = [
    { dataField: "id", text: "ID", sort: true },
    { dataField: "status", text: "Status" },
    { dataField: "first_name", text: "First Name", sort: true },
    { dataField: "last_name", text: "Last Name", sort: true },
    { dataField: "created_at", text: "Created At", sort: true },
    {
      dataField: "edit",
      text: "Edit",
      formatter: editUser,
    },
    {
      dataField: "activate",
      text: "Activate/Lock",
      formatter: toggleActivation,
    },
    {
      dataField: "delete",
      text: "Delete",
      formatter: deleteUser,
    },
  ];

  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];

  const rowStyle = (row) =>
    row.status === "locked"
      ? { textDecoration: "line-through" }
      : { textDecoration: "none" };

  const pagination = paginationFactory({
    page: 2,
    sizePerPage: 5,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function () {},
    onSizePerPageChange: function () {},
  });

  return !isLoaded ? (
    <div>Fetching data for you...</div>
  ) : (
    <main className="container">
      <div className="alert-cont">
        {alert && (
          <p className={`alert alert-${alert.alertType}`}>{alert.message}</p>
        )}
      </div>
      <BootstrapTable
        bootstrap4
        keyField="id"
        data={users}
        columns={columns}
        defaultSorted={defaultSorted}
        pagination={pagination}
        rowStyle={rowStyle}
      />
      <DeleteModal
        handleDeleteConfirm={handleDeleteConfirm}
        deleteModalRef={deleteModalRef}
      />
    </main>
  );
};

export default UserList;
