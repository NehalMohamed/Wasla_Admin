import React, { useEffect } from "react";
import { Container, Table, Button, Accordion } from "react-bootstrap";
import { FaSearch, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setSearchRole,
  fetchUsersWithRoles,
} from "../../slices/usersSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../shared/popup/PopUp";
import "./Users.scss";
import { FiDelete, FiEdit, FiX } from "react-icons/fi";

function UsersComp() {
  const dispatch = useDispatch();
  // Get users data and status from Redux store
  const { UsersList, loading, error, searchRole } = useSelector(
    (state) => state.users
  );
  // State for popup management
  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("");
  const [popupType, setPopupType] = React.useState("alert");

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchUsersWithRoles())
      .unwrap()
      .catch((error) => {
        setPopupMessage(error || "Failed to fetch users");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [dispatch]);

  // Filter users by role if searchRole is specified
  const filteredUsers = searchRole
    ? UsersList &&
      UsersList.filter((user) =>
        (user.roles || "").toLowerCase().includes(searchRole.toLowerCase())
      )
    : UsersList;

  // Show loading spinner if data is loading
  if (loading) {
    return <LoadingPage />;
  }
  return (
    <Container className="users-page">
      {/* PopUp for displaying error messages */}
      <PopUp
        show={showPopup}
        closeAlert={() => setShowPopup(false)}
        msg={popupMessage}
        type={popupType}
        autoClose={popupType === "error" ? 5000 : null}
      />

      {/* Header section with title and role search */}
      <h2 className="mb-4 questions-heading">Users Management</h2>
      <div className="d-flex justify-content-between align-items-center">
        <div className="mb-4 position-relative" style={{ width: "250px" }}>
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
          <input
            type="text"
            className="form-control ps-6"
            placeholder="Search By Role ..."
            value={searchRole}
            onChange={(e) => dispatch(setSearchRole(e.target.value))}
            style={{ paddingLeft: "30px" }}
          />
        </div>
        <div className="mb-4 position-relative">
          {" "}
          <Button className="purbleBtn">
            {" "}
            <FaPlus className="me-1" /> Add User
          </Button>
        </div>
      </div>

      <div className="result_list">
        {UsersList &&
          UsersList?.filter((item) =>
            item.roles.toLowerCase().includes(searchRole.toLowerCase())
          ).map((row, index) => (
            <Accordion key={index} defaultActiveKey={index}>
              <Accordion.Item eventKey={index}>
                <Accordion.Header>
                  {row.roles} - ({row.count}) users
                </Accordion.Header>
                <Accordion.Body>
                  {row && row.users && row.users.length > 0 ? (
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Email Confirmed</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {row.users.map((user, key) => (
                          <tr key={key}>
                            <td>{`${user.firstName} ${user.lastName}`}</td>
                            <td>{user.email}</td>
                            <td>
                              {user.emailConfirmed ? (
                                <FaCheck className="text-success" />
                              ) : (
                                <FaTimes className="text-danger" />
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-info me-2 red-btn"
                                disabled={loading}
                              >
                                <FiX />
                              </button>
                              <button
                                className="btn btn-sm btn-warning me-2 yellow-btn"
                                disabled={loading}
                              >
                                <FiEdit />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p> No Users</p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
      </div>
    </Container>
  );
}

export default UsersComp;
