import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);

  const linkFormatter = (cellContent, row) => {
    return (
      <Link to={`/edit/${row.id}`}>
        <button type="button" className="btn btn-sm btn-primary">
          Edit User
        </button>
      </Link>
    );
  };

  // const handleToggle = (rowId) => {
  //   <Link to={`/edit/${rowId}`}></Link>;
  //   console.log(rowId);
  // };

  // const handleClick = () => {
  //   <Link className="navlink" to="/new">
  //     New User
  //   </Link>;
  // };

  const columns = [
    { dataField: "id", text: "ID" },
    { dataField: "status", text: "Status" },
    { dataField: "first_name", text: "First Name", sort: true },
    { dataField: "last_name", text: "Last Name", sort: true },
    { dataField: "created_at", text: "Created At", sort: true },
    {
      dataField: "toggle",
      text: "Edit",
      formatter: linkFormatter,
    },
  ];

  const defaultSorted = [
    {
      dataField: "last_name",
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
      />
    </main>
  );
};

export default UserList;
