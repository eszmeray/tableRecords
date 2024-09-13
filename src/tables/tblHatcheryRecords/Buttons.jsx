import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblHatcheryRecords.css';
import { IoIosFunnel, IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useTable } from './TableContext'; 

export const Buttons = () => {
  const { eggs } = useTable();
  const [filterCriteria, setFilterCriteria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    barangay: '',
    location: '',
    noOfEggs: '',
    noOfHatchlingsEmerged: '',
    noOfHatchlingsReleased: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState({
    date: '',
    barangay: '',
    location: '',
    noOfEggs: '',
    noOfHatchlingsEmerged: '',
    noOfHatchlingsReleased: '',
    remarks: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
  };


  
  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    handleFilterChange(isChecked, true);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
  };

  const handleSearchClick = () => {
  };

  const toggleModal = useCallback(() => {
    if (showModal) {
      setFormData({
        date: '',
        barangay: '',
        location: '',
        noOfEggs: '',
        noOfHatchlingsEmerged: '',
        noOfHatchlingsReleased: '',
        remarks: ''
      });
      setFormErrors({
        date: '',
        barangay: '',
        location: '',
        noOfEggs: '',
        noOfHatchlingsEmerged: '',
        noOfHatchlingsReleased: '',
        remarks: ''
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

    if (!formData.barangay) errors.barangay = 'Barangay is required';
    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const year = parseInt(formData.date.split("-")[0], 10);
      if (year < 1000 || year > 9999) {
        errors.date = 'Year must be between 1000 and 9999';
      }
    }   
    if (formData.noOfEggs === '' || formData.noOfEggs < 0) {
      errors.noOfEggs = 'Number of Eggs is required and must be 0 or greater';
  }
  
  if (formData.noOfHatchlingsEmerged === '' || formData.noOfHatchlingsEmerged < 0) {
      errors.noOfHatchlingsEmerged = 'Number of Hatchlings Emerged is required and must be 0 or greater';
  }
  
  if (formData.noOfHatchlingsReleased === '' || formData.noOfHatchlingsReleased < 0) {
      errors.noOfHatchlingsReleased = 'Number of Hatchlings Released is required and must be 0 or greater';
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
        <h2 className='titleList'>List of Hatchery Eggs
        <p className='totalRec'>{eggs.length} total records</p>
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
            <a className="dropdown-item" href="#" onClick={() => handleFilterChange('date')}>Date Transplanted</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('barangay')}>Barangay & Nest Code</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('location')}>Location</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('transplant')}>No. of Transplanted Eggs</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('emerge')}>No. of Hatchlings Emerged</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('release')}>No. of Hatchlings Released</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('remarks')}>Remarks</a>
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
                <h6 className='modal-subtitle'>Ready to create something new? Enter the hatchery info here!</h6>
                <br></br>
                  <form>
                  <div className="form-group">
                      <label htmlFor="date">Date Transplanted</label>
                      <input
                      type="date"
                      id="date"
                      className={`form-control ${formErrors.date ? 'is-invalid' : ''}`}
                      value={formData.date}
                      placeholder="YYYY-MM-DD"
                      onChange={handleInputChange}
                      onInput={handleYearInput}
                    />
                      {formErrors.date && <div className="invalid-feedback">{formErrors.date}</div>}
                    </div>

                  <div className="form-group">
                    <label htmlFor="barangay">Barangay & Nest Code</label>
                    <select
                      id="barangay"
                      className={`form-control ${formErrors.barangay ? 'is-invalid' : ''}`}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Nest Code</option>
                      <option value="NC-01">NC-01</option>
                      <option value="NC-02">NC-02</option>
                      <option value="NC-03">NC-03</option>
                    </select>

                    {formErrors.barangay && (
                      <small className="text-danger">{formErrors.barangay}</small>
                    )}
                  </div>

                    <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      className={`form-control read-only-field ${formErrors.location ? 'is-invalid' : ''}`}
                      id="location"
                      placeholder="Lemery, Batangas"
                      value={formData.location}
                      onChange={handleInputChange}
                      readOnly
                    />
                    {formErrors.location && <div className="invalid-feedback">{formErrors.location}</div>}
                  </div>
                 
                 
                    <div className="form-group">
                      <label htmlFor="noOfEggs">Number of Eggs Transplanted</label>
                      <input
                        type="number"
                        className={`form-control ${formErrors.noOfEggs ? 'is-invalid' : ''}`}
                        id="noOfEggs"
                        placeholder="Enter Number of Eggs"
                        value={formData.noOfEggs}
                        onChange={handleInputChange}
                        min="0" 

                      />
                      {formErrors.noOfEggs && <div className="invalid-feedback">{formErrors.noOfEggs}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="noOfHatchlingsEmerged">Number of Hatchlings Emerged</label>
                      <input
                        type="number"
                        className={`form-control ${formErrors.noOfHatchlingsEmerged ? 'is-invalid' : ''}`}
                        id="noOfHatchlingsEmerged"
                        placeholder="Enter Number of Hatchlings Emerged"
                        value={formData.noOfHatchlingsEmerged}
                        onChange={handleInputChange}
                        min="0"

                      />
                      {formErrors.noOfHatchlingsEmerged && <div className="invalid-feedback">{formErrors.noOfHatchlingsEmerged}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="noOfHatchlingsReleased">Number of Hatchlings Released</label>
                      <input
                        type="number"
                        className={`form-control ${formErrors.noOfHatchlingsReleased ? 'is-invalid' : ''}`}
                        id="noOfHatchlingsReleased"
                        placeholder="Enter Number of Hatchlings Released"
                        value={formData.noOfHatchlingsReleased}
                        onChange={handleInputChange}
                        min="0" 

                      />
                      {formErrors.noOfHatchlingsReleased && <div className="invalid-feedback">{formErrors.noOfHatchlingsReleased}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="remarks">Remarks</label>
                      <textarea
                        className={`form-control ${formErrors.remarks ? 'is-invalid' : ''}`}
                        id="remarks"
                        placeholder="Enter Remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                      />
                      {formErrors.remarks && <div className="invalid-feedback">{formErrors.remarks}</div>}
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
