import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblHatcheryRecords.css';
import { IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useTable } from './TableContext';

export const Buttons = () => {
  const { eggs } = useTable();
  const [filterCriteria, setFilterCriteria] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleErrors, setRoleErrors] = useState('');
  const [applyMessage, setApplyMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [statusErrors, setStatusErrors] = useState('');
  const [dateRangeErrors, setDateRangeErrors] = useState('');
  const [barangayErrors, setBarangayErrors] = useState('');
  const [minEggs, setMinEggs] = useState('');
  const [maxEggs, setMaxEggs] = useState('');
  const [eggCountErrors, setEggCountErrors] = useState('');
  const [minHatchlings, setMinHatchlings] = useState('');
  const [maxHatchlings, setMaxHatchlings] = useState('');
  const [hatchlingsCountErrors, setHatchlingsCountErrors] = useState('');
  const [minReleased, setMinReleased] = useState('');
  const [maxReleased, setMaxReleased] = useState('');
  const [releasedCountErrors, setReleasedCountErrors] = useState('');
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



  const handleMinChange = (value) => {
    setMinEggs(value);
    console.log('Min Eggs:', value);
  };

  const handleMaxChange = (value) => {
    setMaxEggs(value);
    console.log('Max Eggs:', value);
  };

  const handleMinHatchlingsChange = (value) => {
    setMinHatchlings(value);
    console.log('Min Hatchlings:', value);
  };

  const handleMaxHatchlingsChange = (value) => {
    setMaxHatchlings(value);
    console.log('Max Hatchlings:', value);
  };


  const handleMinReleased = (value) => {
    setMinReleased(value);
    console.log('Min Hatchlings:', value);
  };

  const handleMaxReleased = (value) => {
    setMaxReleased(value);
    console.log('Max Hatchlings:', value);
  };



  const handleFilterChange = (criteria, isSelectAll = false) => {
    if (isSelectAll) {
      setSelectAll(criteria);
      const checkboxes = document.querySelectorAll('.dropdown-menu .form-check-input[data-category="barangay"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = criteria;
      });
    } else {
      setFilterCriteria(criteria);
    }
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

  const handleDateChange = (event) => {
    const { id, value } = event.target;
    const [year, month, day] = value.split('-');
    const currentYear = new Date().getFullYear();

    if (id === 'dateFrom' || id === 'dateTo') {
      if (year) {
        const yearNumber = parseInt(year, 10);

        if (yearNumber < 1000 || yearNumber > currentYear) {
          setDateRangeErrors(`Year must be between 1000 and ${9999}.`);
          return;
        } else {
          setDateRangeErrors('');
        }
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));

    };

    handleFilterChange(`${id}:${value}`);
  };


  const handleApplyClick = () => {
    if (validateDropdownFilters()) {
      setApplyMessage('Filters have been applied successfully.');
      setTimeout(() => setApplyMessage(''), 3000);
      handleReset();
    }
  };



  const validateDropdownFilters = () => {
    let isValid = true;


    const fromDate = document.getElementById("dateFrom").value;
    const toDate = document.getElementById("dateTo").value;

    if (new Date(fromDate) > new Date(toDate)) {
      setDateRangeErrors('The end date must be on or after the start date.');
      isValid = false;
    } else {
      setDateRangeErrors('');
    }


    return isValid;
  };

  const validateEggCount = (minEggs, maxEggs) => {
    let isValid = true;
    let errorMsg = '';


    if (!Number.isInteger(parseFloat(minEggs)) || !Number.isInteger(parseFloat(maxEggs))) {
      errorMsg = 'The input must be a whole number.';
      isValid = false;
    }
    else if (parseInt(minEggs, 10) < 0 || parseInt(maxEggs, 10) < 0) {
      errorMsg = 'Number of eggs must be 0 or greater.';
      isValid = false;
    }
    else if (parseInt(minEggs, 10) > parseInt(maxEggs, 10)) {
      errorMsg = 'Max value should be greater.';
      isValid = false;
    }
    else {
      errorMsg = '';
    }

    setEggCountErrors(errorMsg);
    return isValid;
  };

  const validateHatchlingsCount = (minHatchlings, maxHatchlings) => {
    let isValid = true;
    let errorMsg = '';
  
    if (!Number.isInteger(parseFloat(minHatchlings)) || !Number.isInteger(parseFloat(maxHatchlings))) {
      errorMsg = 'The input must be a whole number.';
      isValid = false;
    } else if (parseInt(minHatchlings, 10) < 0 || parseInt(maxHatchlings, 10) < 0) {
      errorMsg = 'Number of hatchlings must be 0 or greater.';
      isValid = false;
    } else if (parseInt(minHatchlings, 10) > parseInt(maxHatchlings, 10)) {
      errorMsg = 'Max value should be greater.';
      isValid = false;
    } else {
      errorMsg = '';
    }
  
    setHatchlingsCountErrors(errorMsg);
    return isValid;
  };

  const validateReleasedCount = (minReleased, maxReleased) => {
    let isValid = true;
    let errorMsg = '';
  
    if (!Number.isInteger(parseFloat(minReleased)) || !Number.isInteger(parseFloat(maxReleased))) {
      errorMsg = 'The input must be a whole number.';
      isValid = false;
    } else if (parseInt(minReleased, 10) < 0 || parseInt(maxReleased, 10) < 0) {
      errorMsg = 'Number of hatchlings must be 0 or greater.';
      isValid = false;
    } else if (parseInt(minReleased, 10) > parseInt(maxReleased, 10)) {
      errorMsg = 'Max value should be greater.';
      isValid = false;
    } else {
      errorMsg = '';
    }
  
    setReleasedCountErrors(errorMsg);
    return isValid;
  };
  


  const handleReset = () => {
    setFilterCriteria('');
    setFormData({
      status: '',
      date: '',
      barangay: '',
      noOfEggs: '',
      noOfHatchlingsEmerged: '',
    });
    setMinEggs('');
    setMaxEggs('');
    setMinHatchlings('');
    setMaxHatchlings('');
    setMinReleased('');
    setMaxReleased('');

    setFormErrors({
      status: '',
      date: '',
      barangay: '',
      noOfEggs: '',
      noOfHatchlingsEmerged: '',

    });
    setStatusErrors('');
    setDateRangeErrors('');
    setBarangayErrors('');
    setEggCountErrors('');
    setHatchlingsCountErrors('');
    setReleasedCountErrors('');
    
    const checkboxes = document.querySelectorAll('.dropdown-menu .form-check-input');
    checkboxes.forEach(checkbox => checkbox.checked = false);
  
    document.getElementById("dateFrom").value = '';
    document.getElementById("dateTo").value = '';
  
    document.getElementById("hatchlingsDateFrom").value = '';
    document.getElementById("hatchlingsDateTo").value = '';
  
    document.getElementById("eggFilterFrom").value = '';
    document.getElementById("eggFilterTo").value = '';
  
    document.getElementById("hatchlingsFilterFrom").value = '';
    document.getElementById("hatchlingsFilterTo").value = '';

    document.getElementById("releasedFilterFrom").value = '';
    document.getElementById("releasedFilterTo").value = '';
  
    setSelectAll(false);
  
    console.log('Filters have been reset');
  };
  


  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) {
      errors.firstName = 'First Name is required';
    } else if (!/^[\p{L}\s]+$/u.test(formData.firstName)) {
      errors.firstName = 'First Name must only contain letters, spaces, and special characters';
    } else if (/^\s*$/.test(formData.firstName)) {
      errors.firstName = 'First Name must contain at least one letter';
    }

    if (!formData.lastName) {
      errors.lastName = 'Last Name is required';
    } else if (!/^[\p{L}\s]+$/u.test(formData.lastName)) {
      errors.lastName = 'Last Name must only contain letters, spaces, and special characters';
    } else if (/^\s*$/.test(formData.lastName)) {
      errors.lastName = 'Last Name must contain at least one letter';


    } if (!formData.barangay) errors.barangay = 'Barangay is required';
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
    if (!formData.dummyDropdown) errors.dummyDropdown = 'dummyDropdown is required';


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
    {/* Filter Button */}
    <button
      className="btn btn-filter dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded={dropdownOpen}
    >
      <FaSlidersH className='funnel-icon' /> Sorting Options
    </button>

    <div className={`dropdown-menu p-3 ${dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
      <h5 className='filterTitle'>Sort by Category</h5>

      <div className="dropdown-item">
  <h6 className='filterSubtitle'>Status</h6>
  <hr />
  <div className="row">
    <div className="col-6">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          data-category="status"
          id="foundBy"
        />
        <label className="form-check-label" htmlFor="foundBy">Found by MENRO</label>
      </div>
    </div>
    <div className="col-6">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          data-category="status"
          id="surrenderedTo"
        />
        <label className="form-check-label" htmlFor="surrenderedTo">Surrendered to MENRO</label>
      </div>
    </div>
  </div>
  {statusErrors && <p className="text-danger">{statusErrors}</p>}
</div>


      <div className="dropdown-item">
        <h6 className="filterSubtitle">Egg Transplant Date Range</h6>
        <hr />
        <div className="row">
          <div className="col-6">
            <input
              type="date"
              id="dateFrom"
              className="form-control"
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="col-6">
            <input
              type="date"
              id="dateTo"
              className="form-control"
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        {dateRangeErrors && <p className="text-danger">{dateRangeErrors}</p>}
      </div>

      <div className="dropdown-item">
        <h6 className='filterSubtitle'>Barangay (Nesting Site)</h6>
        <hr />
        <div className="row">
          <div className="col-md-6">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Anak Dagat')} id="anakDagat" />
              <label className="form-check-label" htmlFor="anakDagat">Anak Dagat</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Maugihan')} id="maugihan" />
              <label className="form-check-label" htmlFor="maugihan">Maugihan</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Mataas na Bayan')} id="mataasNaBayan" />
              <label className="form-check-label" htmlFor="mataasNaBayan">Mataas na Bayan</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Maligaya')} id="maligaya" />
              <label className="form-check-label" htmlFor="maligaya">Maligaya</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Nonong Casto')} id="nonongCasto" />
              <label className="form-check-label" htmlFor="nonongCasto">Nonong Casto</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Sambal Ibaba')} id="sambalIbaba" />
              <label className="form-check-label" htmlFor="sambalIbaba">Sambal Ibaba</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Sambal Ilaya')} id="sambalIlaya" />
              <label className="form-check-label" htmlFor="sambalIlaya">Sambal Ilaya</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Talaga')} id="wawaIbaba" />
              <label className="form-check-label" htmlFor="wawaIbaba">Wawa Ibaba</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" data-category="barangay" onChange={() => handleFilterChange('Wawa Ilaya')} id="wawaIlaya" />
              <label className="form-check-label" htmlFor="wawaIlaya">Wawa Ilaya</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="selectAllBarangays" checked={selectAll} onChange={handleSelectAllChange} />
              <label className="form-check-label" htmlFor="selectAllBarangays">Select All</label>
            </div>
          </div>
          {barangayErrors && <p className="text-danger">{barangayErrors}</p>}
        </div>
      </div>

      <div className="dropdown-item">
        <h6 className="filterSubtitle">No. of Eggs Transplanted</h6>
        <hr />
        <div className="row">
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              id="eggFilterFrom"
              placeholder="Min"
              value={minEggs}
              onChange={(e) => {
                handleMinChange(e.target.value);
                validateEggCount(e.target.value, maxEggs);
              }}
              min="0"
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              id="eggFilterTo"
              placeholder="Max"
              value={maxEggs}
              onChange={(e) => {
                handleMaxChange(e.target.value);
                validateEggCount(minEggs, e.target.value);
              }}
              min="0"
            />
          </div>
        </div>
        {eggCountErrors && <p className="text-danger mt-2">{eggCountErrors}</p>}
      </div>

      <div className="dropdown-item">
        <h6 className="filterSubtitle">Hatchlings Emergence Date Range</h6>
        <hr />
        <div className="row">
          <div className="col-6">
            <input
              type="date"
              id="hatchlingsDateFrom"
              className="form-control"
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="col-6">
            <input
              type="date"
              id="hatchlingsDateTo"
              className="form-control"
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        {dateRangeErrors && <p className="text-danger">{dateRangeErrors}</p>}
      </div>

      <div className="dropdown-item">
        <h6 className="filterSubtitle">No. of Hatchlings Emerged</h6>
        <hr />
        <div className="row">
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              id="hatchlingsFilterFrom"
              placeholder="Min"
              value={minHatchlings}
              onChange={(e) => {
                handleMinHatchlingsChange(e.target.value);
                validateHatchlingsCount(e.target.value, maxHatchlings);
              }}
              min="0"
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              id="hatchlingsFilterTo"
              placeholder="Max"
              value={maxHatchlings}
              onChange={(e) => {
                handleMaxHatchlingsChange(e.target.value);
                validateHatchlingsCount(maxHatchlings, e.target.value);
              }}
              min="0"
            />
          </div>
        </div>
        {hatchlingsCountErrors && <p className="text-danger mt-2">{hatchlingsCountErrors}</p>}
      </div>

      <div className="dropdown-item">
        <h6 className="filterSubtitle">No. of Hatchlings Released</h6>
        <hr />
        <div className="row">
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              id="releasedFilterFrom"
              placeholder="Min"
              value={minReleased}
              onChange={(e) => {
                handleMinReleased(e.target.value);
                validateReleasedCount(e.target.value, maxReleased);
              }}
              min="0"
            />
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              id="releasedFilterTo"
              placeholder="Max"
              value={maxReleased}
              onChange={(e) => {
                handleMaxReleased(e.target.value);
                validateReleasedCount(maxReleased, e.target.value);
              }}
              min="0"
            />
          </div>
        </div>
        {releasedCountErrors && <p className="text-danger mt-2">{releasedCountErrors}</p>}
      </div>


<br></br>

              <div className="filter-btn-grp d-flex justify-content-between">
                <button className="btn btn-secondary cancel" onClick={handleReset}>CANCEL</button>
                <button className="btn btn-primary apply" onClick={handleApplyClick}>APPLY</button>
              </div>

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
      {applyMessage && (
        <div className="apply-message">
          {applyMessage}
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

                    <div className="row justify-content-end">
                      <div className="col-auto">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="flexRadioDefaultFirstName" id="flexRadioDefault1" />
                          <label className="form-check-label-source" htmlFor="flexRadioDefault1">Found by MENRO</label>
                        </div>
                      </div>
                      <div className="col-auto">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="flexRadioDefaultFirstName" id="flexRadioDefault2" />
                          <label className="form-check-label-source" htmlFor="flexRadioDefault2">Surrendered to MENRO</label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                        id="firstName"
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />

                      {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="firstName">Last Name</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                        id="lastName"
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />

                      {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                    </div>

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
                      <label htmlFor="noOfEggs">No. of Eggs Transplanted</label>
                      <input
                        type="number"
                        className={`form-control ${formErrors.noOfEggs ? 'is-invalid' : ''}`}
                        id="noOfEggs"
                        placeholder="Enter Number of Eggs"
                        value={formData.noOfEggs}
                        onChange={handleInputChange}
                        min="0"

                      />
                      {formErrors.noOfEggs && <div className="invalid-feedback">{formErrors.noOfHatchlingsEmerged}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="noOfHatchlingsEmerged">No. of Hatchlings Emerged</label>
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
                      <label htmlFor="noOfHatchlingsReleased">No. of Hatchlings Released</label>
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
                      <label htmlFor="dummy">Panget</label>
                      <select
                        id="dummy"
                        className={`form-control ${formErrors.dummy ? 'is-invalid' : ''}`}
                        onChange={handleInputChange}
                      >
                        <option value="">Select your Pangit Agent</option>
                        <option value="ewan">Panget 1</option>
                        <option value="ewan">Panget 2</option>
                        <option value="ewan">Panget 3</option>
                      </select>

                      {formErrors.dummy && (
                        <small className="text-danger">{formErrors.dummy}</small>
                      )}
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
