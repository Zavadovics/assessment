import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  const editUser = (cellContent, row) => {
    return (
      <Link to={`/edit/${row.id}`}>
        <button type="button" className="btn btn-sm btn-primary">
          Edit User
        </button>
      </Link>
    );
  };

  const changeActivationStatus = async (e) => {
    e.preventDefault();
    const id = e.target.id;
    const user = users.find((user) => user.id === parseInt(id));
    let newStatus = "";
    user.status === "locked" ? (newStatus = "active") : (newStatus = "locked");

    await fetch(`https://assessment-users-backend.herokuapp.com/users/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
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
        const updatedUsers = users.map((user) => user.id !== id);
        updatedUsers.push(user);
        setUsers(updatedUsers);
      })
      .catch((err) => {
        console.log(err.message);
        setAlert({ alertType: "danger", message: err.message });
      });
  };

  const toggleActivation = (cellContent, row) => {
    console.log(row.status);
    // const status = row.status;
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

  const columns = [
    { dataField: "id", text: "ID", sort: true },
    { dataField: "status", text: "Status" },
    { dataField: "first_name", text: "First Name", sort: true },
    { dataField: "last_name", text: "Last Name", sort: true },
    { dataField: "created_at", text: "Created At", sort: true },
    {
      dataField: "toggle",
      text: "Edit",
      formatter: editUser,
    },
    {
      dataField: "activate",
      text: "Activate/Lock",
      formatter: toggleActivation,
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

  const messageTypes = {
    dbProblem: `Database problem`,
  };

  useEffect(() => {
    fetch("https://assessment-users-backend.herokuapp.com/users", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((jsonRes) => {
        setUsers(jsonRes);
      })
      .catch((err) => {
        console.log("err", err);
        console.log("alert", alert);
        setAlert({ alertType: "danger", message: messageTypes.dbProblem });
      });
  }, [users]);

  return (
    <main className="container">
      <BootstrapTable
        bootstrap4
        keyField="id"
        data={users}
        columns={columns}
        defaultSorted={defaultSorted}
        pagination={pagination}
        rowStyle={rowStyle}
      />
    </main>
  );
};

export default UserList;
