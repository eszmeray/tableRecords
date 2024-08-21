import React, { useState, useRef, useEffect } from 'react';
import './styles/tblUserRecords.css';
import { FaEdit, FaEye } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const generateRandomPassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

const generateRandomEmail = (firstName, lastName) => {
  const domains = ['example.com', 'demo.com', 'sample.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

const generateUsers = (num) => {
  const roles = ['Admin', 'Bantay Dagat'];
  const firstNames = ['Elena', 'Patricia', 'Roberto', 'Alejandro', 'Jessica', 'Michael', 'Linda', 'James', 'Emily', 'Daniel', 'Samantha', 'David', 'Sophia', 'William', 'Olivia'];
  const lastNames = ['Rodriguez', 'Castro', 'Perez', 'Morales', 'Smith', 'Johnson', 'Lee', 'Brown', 'Davis', 'Wilson', 'Miller', 'Garcia', 'Martinez', 'Rodriguez', 'Harris'];

  const users = [];

  for (let i = 0; i < num; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const email = generateRandomEmail(firstName, lastName);
    const password = generateRandomPassword();

    users.push({
      firstName,
      lastName,
      role,
      password,
      email
    });
  }
   
  return users;
};

const initialUsers = generateUsers(500);

export const Table = () => {
  const [users, setUsers] = useState(initialUsers);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);

  const roles = ['Admin', 'Bantay Dagat'];

  const toggleEditModal = (index) => {
    const user = users[index];
    setSelectedUserIndex(index);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      password: user.password,
      email: user.email,
    });
    setShowEditModal(!showEditModal);
  };

  const toggleViewModal = (index) => {
    setSelectedUserIndex(index);
    setShowViewModal(!showViewModal);
  };

  const handleClickOutside = (event) => {
    if (editModalRef.current && !editModalRef.current.contains(event.target)) {
      setShowEditModal(false);
    }
    if (viewModalRef.current && !viewModalRef.current.contains(event.target)) {
      setShowViewModal(false);
    }
  };

  useEffect(() => {
    if (showEditModal || showViewModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('modal-open');
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('modal-open');
    };
  }, [showEditModal, showViewModal]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      const updatedUsers = [...users];
      updatedUsers[selectedUserIndex] = {
        ...formData,
      };
      setUsers(updatedUsers);
      setSuccessMessage('Data has been updated successfully.');
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (index) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
      return newSelectedRows;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const newSelectedRows = new Set();
      users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach((_, index) => {
        newSelectedRows.add(index);
      });
      setSelectedRows(newSelectedRows);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const allRowsSelected = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).every((_, index) => selectedRows.has(index));
    setSelectAll(allRowsSelected);
  }, [selectedRows, page, rowsPerPage, users]);

  return (
    <div className={`table-container`}>
      {(showEditModal || showViewModal) && (
        <div className="modal-background-blur"></div>
      )}

      {successMessage && (
        <div className="message-box success-message">
          {successMessage}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-no-border">
          <thead className="thead">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Password</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role}</td>
                <td>{user.password}</td>
                <td>{user.email}</td>
                <td>
                  <span className="actions">
                    <button onClick={() => toggleEditModal(index)} className="action-button edit"><FaEdit />Edit</button>
                    <button onClick={() => toggleViewModal(index)} className="action-button view"><FaEye />View</button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={editModalRef}>
              <div className="modal-header">
                <h1 className="modal-title">Edit Record</h1>
              </div>
              <div className="modal-body">
                <h4 className='modal-subtitle'>User Details</h4>
                <form>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      className={`form-control ${formErrors.role ? 'is-invalid' : ''}`}
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Role</option>
                      {roles.map((role, idx) => (
                        <option key={idx} value={role}>{role}</option>
                      ))}
                    </select>
                    {formErrors.role && <div className="invalid-feedback">{formErrors.role}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveClick}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedUserIndex !== null && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={viewModalRef}>
              <div className="modal-header">
                <h1 className="modal-title">User Details</h1>
              </div>
              <div className="modal-body">
                <h4 className='modal-subtitle'>User Information</h4>
                <p><strong>First Name:</strong> {users[selectedUserIndex].firstName}</p>
                <p><strong>Last Name:</strong> {users[selectedUserIndex].lastName}</p>
                <p><strong>Role:</strong> {users[selectedUserIndex].role}</p>
                <p><strong>Password:</strong> {users[selectedUserIndex].password}</p>
                <p><strong>Email:</strong> {users[selectedUserIndex].email}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pagination-container">
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};
