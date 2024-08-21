import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblHatcheryRecords.css';
import { IoIosFunnel, IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export const Buttons = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    island: '',
    barangay: '',
    municipality: '',
    province: '',
    date: '',
    nestCode: '',
    noOfEggs: '',
    noOfHatchlingsEmerged: '',
    noOfHatchlingsReleased: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState({
    island: '',
    barangay: '',
    municipality: '',
    province: '',
    date: '',
    nestCode: '',
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

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
  };

  const handleSearchClick = () => {
  };

  const toggleModal = useCallback(() => {
    if (showModal) {
      setFormData({
        island: '',
        barangay: '',
        municipality: '',
        province: '',
        date: '',
        nestCode: '',
        noOfEggs: '',
        noOfHatchlingsEmerged: '',
        noOfHatchlingsReleased: '',
        remarks: ''
      });
      setFormErrors({
        island: '',
        barangay: '',
        municipality: '',
        province: '',
        date: '',
        nestCode: '',
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
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.island) errors.island = 'Island is required';
    if (!formData.barangay) errors.barangay = 'Barangay is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.nestCode) errors.nestCode = 'Nest code is required';
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
          <p className='totalRec'>90 total records</p>
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
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('sitio')}>Island/Sitio</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('barangay')}>Barangay</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('municipality')}>Municipality</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('province')}>Province</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('date')}>Date</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('nestcode')}>Nest Code</a>
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
                      <label htmlFor="island">Island/Sitio</label>
                      <select
                        type="text"
                        className={`form-control ${formErrors.island ? 'is-invalid' : ''}`}
                        id="island"
                        placeholder="Enter island"
                        value={formData.island}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Island/Sitio</option>
                        <option value="anakdagat">Island 1</option>
                        <option value="maguihan">Island 2</option>     
                        <option value="maguihan">Island 3</option>                     
                      </select>
                      {formErrors.island && <div className="invalid-feedback">{formErrors.island}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="barangay">Barangay</label>
                      <select
                        type="text"
                        className={`form-control ${formErrors.barangay ? 'is-invalid' : ''}`}
                        id="barangay"
                        placeholder="Enter barangay"
                        value={formData.barangay}
                        onChange={handleInputChange}
                      
                        >
                        <option value="">Select Barangay</option>
                        <option value="anakdagat">Anak Dagat</option>
                        <option value="maguihan">Maguihan</option>
                        <option value="mataasnabayan">Mataas na Bayan</option>
                        <option value="maligaya">Maligaya</option>
                        <option value="nonongcasto">Nonong Casto</option>
                        <option value="sambalibaba">Sambal Ibaba</option>
                        <option value="sambalilaya">Sambal Ilaya</option>
                        <option value="wawaibaba">Wawa Ibaba</option>
                        <option value="wawailaya">Wawa Ilaya</option>                      
                      </select>
                      {formErrors.barangay && <div className="invalid-feedback">{formErrors.barangay}</div>}
                    </div>
                    <div className="form-group">
                    <label htmlFor="municipality">Municipality</label>
                    <input
                      type="text"
                      className={`form-control read-only-field ${formErrors.municipality ? 'is-invalid' : ''}`}
                      id="municipality"
                      placeholder="Lemery"
                      value={formData.municipality}
                      onChange={handleInputChange}
                      readOnly
                    />
                    {formErrors.municipality && <div className="invalid-feedback">{formErrors.municipality}</div>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="province">Province</label>
                    <input
                      type="text"
                      className={`form-control read-only-field ${formErrors.province ? 'is-invalid' : ''}`}
                      id="province"
                      placeholder="Batangas"
                      value={formData.province}
                      onChange={handleInputChange}
                      readOnly
                    />
                    {formErrors.province && <div className="invalid-feedback">{formErrors.province}</div>}
                  </div>

                    <div className="form-group">
                      <label htmlFor="date">Date</label>
                      <input
                        type="date"
                        className={`form-control ${formErrors.date ? 'is-invalid' : ''}`}
                        id="date"
                        value={formData.date}
                        onChange={handleInputChange}
                      />
                      {formErrors.date && <div className="invalid-feedback">{formErrors.date}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="nestCode">Nest Code</label>
                      <select
                        className={`form-control ${formErrors.nestCode ? 'is-invalid' : ''}`}
                        id="nestCode"
                        value={formData.nestCode}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Nest Code</option>
                        <option value="code">NC1</option>
                        <option value="code">NC2</option>
                        <option value="code">NC3</option>
                      </select>
                      {formErrors.nestCode && <div className="invalid-feedback">{formErrors.nestCode}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="noOfEggs">Number of Eggs Transplanted</label>
                      <input
                        type="number"
                        className={`form-control ${formErrors.noOfEggs ? 'is-invalid' : ''}`}
                        id="noOfEggs"
                        placeholder="Enter number of eggs"
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
                        placeholder="Enter number of hatchlings emerged"
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
                        placeholder="Enter number of hatchlings released"
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
                        placeholder="Enter remarks"
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
