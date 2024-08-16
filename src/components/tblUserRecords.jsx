import React, { useState, useRef, useEffect } from 'react';
import './styles/tblUserRecords.css';
import { FaEdit, FaEye, FaPrint } from 'react-icons/fa';
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
  const roles = [
    'GIS Specialist', 'Communications Officer', 'IT Specialist', 'Program Coordinator',
    'Software Engineer', 'Data Analyst', 'HR Manager', 'Product Manager', 'Marketing Specialist',
    'Financial Analyst', 'Sales Director', 'Operations Manager', 'Legal Advisor', 'Business Analyst',
    'Administrative Assistant'
  ];
  
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

const users = generateUsers(500);

export const Table = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);

  const toggleEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(!showEditModal);
  };

  const toggleViewModal = (user) => {
    setSelectedUser(user);
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

  /* For Pagination */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={`table-container`}>
      {(showEditModal || showViewModal) && (
        <div className="modal-background-blur"></div>
      )}
      <div className="table-responsive">
        <table className="table table-no-border">
          <thead className="thead">
            <tr>
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
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role}</td>
                <td>{user.password}</td>
                <td>{user.email}</td>
                <td>
                  <span className="actions">
                    <button onClick={() => toggleEditModal(user)} className="action-icon"><FaEdit /></button>
                    <button onClick={() => toggleViewModal(user)} className="action-icon"><FaEye /></button>
                    <button className="action-icon"><FaPrint /></button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && selectedUser && (
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
                    <input type="text" className="form-control" id="firstName" defaultValue={selectedUser.firstName} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" className="form-control" id="lastName" defaultValue={selectedUser.lastName} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>            
                    <select className="form-control" id="role" defaultValue={selectedUser.role}>
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="editor">Editor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" defaultValue={selectedUser.password} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" defaultValue={selectedUser.email} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">SAVE</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>CANCEL</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedUser && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={viewModalRef}>
              <div className="modal-header">
                <h1 className="modal-title">View Record</h1>
              </div>
              <div className="modal-body">
                <h4 className='modal-subtitle'>User Details</h4>
                <form>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" className="form-control" id="firstName" defaultValue={selectedUser.firstName} disabled />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" className="form-control" id="lastName" defaultValue={selectedUser.lastName} disabled />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>            
                    <select className="form-control" id="role" defaultValue={selectedUser.role} disabled>
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                      <option value="editor">Editor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" defaultValue={selectedUser.password} disabled />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" defaultValue={selectedUser.email} disabled />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>CLOSE</button>
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
