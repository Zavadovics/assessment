import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  // console.log(users[0].status);

  const linkFormatter = (cellContent, row) => {
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={() => handleToggle(row.id)}
      >
        Toggle
      </button>
    );
  };

  const rowStyle = (row) =>
    row.status === "locked"
      ? { "text-decoration": "line-through" }
      : { "text-decoration": "none" };

  const handleToggle = (rowId) => {
    console.log(rowId);
  };

  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "status", text: "Status" },
    { dataField: "first_name", text: "First Name", sort: true },
    { dataField: "last_name", text: "Last Name", sort: true },
    { dataField: "created_at", text: "Created At", sort: true },
    {
      dataField: "toggle",
      text: "Activate/Lock",
      formatter: linkFormatter,
    },
  ];

  const defaultSorted = [
    {
      dataField: "last_name",
      order: "asc",
    },
  ];

  const pagination = paginationFactory({
    page: 2,
    sizePerPage: 5,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    alwaysShowAllBtns: true,
    onPageChange: function (page, sizePerPage) {
      console.log("page", page);
      console.log("sizePerPage", sizePerPage);
    },
    onSizePerPageChange: function (page, sizePerPage) {
      console.log("page", page);
      console.log("sizePerPage", sizePerPage);
    },
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
        // console.log(users);
      })
      .catch((err) => {
        console.log("err", err);
        console.log("alert", alert);
        setAlert({ alertType: "danger", message: messageTypes.dbProblem });
      });
  }, []);

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
        // rowStyle={{ "text-decoration": "line-through" }}
      />
    </main>
  );
};

export default UserList;
