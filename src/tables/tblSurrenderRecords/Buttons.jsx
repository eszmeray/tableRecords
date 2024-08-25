import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblSurrenderRecords.css';
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
    barangay: '',
    date: '',
    noOfEggs: '',
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    barangay: '',
    date: '',
    noOfEggs: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
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
        lastName: '',
        barangay: '',
        date: '',
        noOfEggs: '',
      });
      setFormErrors({
        firstName: '',
        lastName: '',
        barangay: '',
        date: '',
        noOfEggs: '',
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
  
    if (id === "date") {
      const parts = value.split("-");
      const year = parts[0];
  
      if (year.length > 4) {
        parts[0] = year.slice(0, 4);
        event.target.value = parts.join("-");
      }
  
      if (parseInt(year, 10) < 1000 || parseInt(year, 10) > 9999) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          date: "Year must be between 1000 and 9999",
        }));
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          date: "", 
        }));
      }
    }
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: event.target.value,
    }));
  };

  const handleYearInput = (event) => {
    const value = event.target.value;
    const parts = value.split("-");
    const year = parts[0];
  
    if (year.length > 4) {
      event.target.value = `${year.slice(0, 4)}${parts[1] ? '-' + parts[1] : ''}${parts[2] ? '-' + parts[2] : ''}`;
    }
  };
  

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.barangay) errors.barangay = 'Barangay is required';
    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const year = parseInt(formData.date.split("-")[0], 10);
      if (year < 1000 || year > 9999) {
        errors.date = 'Year must be between 1000 and 9999';
      }
    }    if (formData.noOfEggs === '' || formData.noOfEggs < 0) {
      errors.noOfEggs = 'Number of Eggs is required and must be 0 or greater';
  }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddClick = () => {
    if (validateForm()) {
      console.log('Form Data:', formData);
      setSuccessMessage('Data has been added successfully.');
      toggleModal(); 
      setTimeout(() => setSuccessMessage(''), 3000); 
    }
  };

  return (
    <div className="container my-12">
      <div className="row-btn d-flex justify-content-between align-items-center mb-3">
        <h2 className='titleList'>List of Surrendering Individuals
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
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('barangay')}>Barangay</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('date')}>Date Surrender</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('noOfEggs')}>No. of Eggs</a>
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
              
                <div className="modal-body">
                <h2 className="modal-title">New Record</h2>
                <h6 className='modal-subtitle'>Who’s surrendering next? Add details of the person surrendering the eggs here!</h6>
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
                    <label htmlFor="barangay">Barangay</label>
                    <select
                      id="barangay"
                      className="form-control"
                      value={formData.barangay}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Barangay</option>
                      <option value="Anak Dagat">Anak Dagat</option>
                      <option value="Maguihan">Maguihan</option>
                      <option value="Mataas na Bayan">Mataas na Bayan</option>
                      <option value="Maligaya">Maligaya</option>
                      <option value="Nonong Casto">Nonong Casto</option>
                      <option value="Sambal Ibaba">Sambal Ibaba</option>
                      <option value="Sambal Ilaya">Sambal Ilaya</option>
                      <option value="Wawa Ibaba">Wawa Ibaba</option>
                      <option value="Wawa Ilaya">Wawa Ilaya</option>
                    </select>
                    {formErrors.barangay && (
                      <small className="text-danger">{formErrors.barangay}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      className={`form-control ${formErrors.date ? 'is-invalid' : ''}`}
                      value={formData.date}
                      placeholder="YYYY-MM-DD"
                      onChange={handleInputChange}
                      onInput={handleYearInput}
                    />
                    {formErrors.date && (
                      <div className="invalid-feedback">{formErrors.date}</div>
                    )}
                  </div>


                  <div className="form-group">
                    <label htmlFor="noOfEggs">No. of Eggs Surrendered</label>
                    <input
                      type="number"
                      id="noOfEggs"
                      className="form-control"
                      value={formData.noOfEggs}
                      onChange={handleInputChange}
                      min="0" 
                    />
                    {formErrors.noOfEggs && (
                      <small className="text-danger">{formErrors.noOfEggs}</small>
                    )}
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
  );
};
