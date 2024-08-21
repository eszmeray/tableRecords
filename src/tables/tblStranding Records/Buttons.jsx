import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblUserRecords.css';
import { IoIosFunnel, IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export const Buttons = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    email: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    // Handle search value change
  };

  const handleSearchClick = () => {
    // Handle search button click
  };

  const toggleModal = useCallback(() => {
    if (showModal) {
      // Clear form data and errors when closing the modal
      setFormData({
        firstName: '',
        lastName: '',
        role: '',
        password: '',
        email: '',
      });
      setFormErrors({
        firstName: '',
        lastName: '',
        role: '',
        password: '',
        email: '',
      });
    }
    setShowModal(prevShowModal => !prevShowModal);
  }, [showModal]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      toggleModal();
    }
  };

  useEffect(() => {
    if (showModal) {
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
  }, [showModal]);

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

  const handleAddClick = () => {
    if (validateForm()) {
      // Handle form submission
      console.log('Form Data:', formData);
      setSuccessMessage('Data has been added successfully.');
      toggleModal(); // Close modal after successful submission
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    }
  };

  return (
    <div className="container my-12">
      <div className="row-btn d-flex justify-content-between align-items-center mb-3">
        <h2 className='titleList'>List of Users
          <p className='totalRec'>25 total records</p>
        </h2>
        <div className='search'>
          <input
            type="text"
            className="form-control custom-search"
            placeholder="Search"
            onChange={handleSearchChange} 
          />
          <button className='search-button' onClick={handleSearchClick}>
            <FaSearch className='search-icon' />
          </button>
        </div>
        <div className='btn-group'>
          <div className="dropdown">
            <button className="btn btn-filter dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Filter by type <IoIosFunnel className='funnel-icon' />
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('firstName')}>First Name</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('lastName')}>Last Name</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('role')}>Role</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('password')}>Password</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('email')}>Email</a>
            </div>
          </div>
          <button className="btn btn-primary" onClick={toggleModal}><IoIosAdd /> NEW RECORD</button>
          <button className="btn btn-primary print"><IoIosPrint /> Print Records</button>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {showModal && (
        <>
          <div className="modal-background-blur"></div>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" ref={modalRef}>
                <div className="modal-header">
                  <h1 className="modal-title">New Record</h1>
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
                        placeholder="Enter first name"
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
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                      {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="role">Role</label>
                      <select
                        className={`form-control ${formErrors.role ? 'is-invalid' : ''}`}
                        id="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="user">Bantay Dagat</option>
                      </select>
                      {formErrors.role && <div className="invalid-feedback">{formErrors.role}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        id="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleAddClick}>ADD</button>
                  <button type="button" className="btn btn-secondary" onClick={toggleModal}>CANCEL</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
