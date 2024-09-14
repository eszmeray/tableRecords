import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblUserRecords.css';
import { IoIosFunnel, IoIosAdd } from "react-icons/io";
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export const Buttons = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    role: '',
    email: '',
  });

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
  };


  const handleReset = () => {
    setFilterCriteria('');
    setFormData({
      firstName: '',
      lastName: '',

    });


    setFormErrors({
      firstName: '',
      lastName: '',

    });

    console.log('Filters have been reset');
  };


  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
  };

  const handleSearchClick = () => {
  };

  const toggleModal = useCallback(() => {
    if (showModal) {
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        role: '',
        email: '',
      });
      setFormErrors({
        firstName: '',
        middleName: '',
        lastName: '',
        role: '',
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
    if (!formData.middleName) errors.middleName = 'Middle name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.role) errors.role = 'Role is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateDropdownFilters = () => {
    let isValid = true;

    return isValid;
  };



  const handleAddClick = () => {
    if (validateForm()) {
      console.log('Form Data:', formData);
      setSuccessMessage('Data has been added successfully.');
      toggleModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleApplyClick = () => {
    if (validateDropdownFilters()) {
      setApplyMessage('Filters have been applied successfully.');
      setTimeout(() => setApplyMessage(''), 3000);
      handleReset();
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
            <button className="btn btn-filter dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded={dropdownOpen}>
              <FaSlidersH className='funnel-icon' /> Sorting Options
            </button>
            <div className={`dropdown-menu p-3 ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
              <h5 className='filterTitle'>Sort by Category</h5>


              <div className="dropdown-item">
                    <h6 className="filterSubtitle">First Name</h6>
                    <hr></hr>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultFirstName" id="flexRadioDefault1" />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Ascending
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultFirstName" id="flexRadioDefault2" />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Descending
                      </label>
                    </div>
                  </div>

                  <div className="dropdown-item">
                    <h6 className="filterSubtitle">Last Name</h6>
                    <hr></hr>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultLastName" id="flexRadioDefault3" />
                      <label className="form-check-label" htmlFor="flexRadioDefault3">
                        Ascending
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultLastName" id="flexRadioDefault4" />
                      <label className="form-check-label" htmlFor="flexRadioDefault4">
                        Descending
                      </label>
                    </div>
              </div>
              <div className="filter-btn-grp d-flex justify-content-between">
                <button className="btn btn-secondary cancel" onClick={handleReset}>CANCEL</button>
                <button className="btn btn-primary apply" onClick={handleApplyClick}>APPLY</button>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={toggleModal}><IoIosAdd /> NEW RECORD</button>
        </div>

        {showModal && (
          <>
            <div className="modal-background-blur"></div>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" ref={modalRef}>

                  <div className="modal-body">
                    <h2 className="modal-title">New Record</h2>
                    <h6 className='modal-subtitle'>Who’s joining us next? Create their user profile</h6>
                    <br></br>
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
                        <label htmlFor="firstName">Middle Name</label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.middleName ? 'is-invalid' : ''}`}
                          id="middleName"
                          placeholder="Enter middle name"
                          value={formData.middleName}
                          onChange={handleInputChange}
                        />
                        {formErrors.middleName && <div className="invalid-feedback">{formErrors.middleName}</div>}
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
                    <button type="button" className="btn btn-secondary" onClick={toggleModal}>CANCEL</button>
                    <button type="button" className="btn btn-primary" onClick={handleAddClick}>ADD</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {applyMessage && (
        <div className="apply-message">
          {applyMessage}
        </div>
      )}
    </div>

  );
};
