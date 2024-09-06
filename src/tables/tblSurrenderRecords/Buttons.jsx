import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblSurrenderRecords.css';
import { IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useTable } from './TableContext'; // Adjust the path as necessary


export const Buttons = () => {
  const { surrenderers } = useTable();

  const [filterCriteria, setFilterCriteria] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false); // Fixed comment
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


  const [minEggs, setMinEggs] = useState('');
  const [maxEggs, setMaxEggs] = useState('');
  const [barangayErrors, setBarangayErrors] = useState('');
  const [dateRangeErrors, setDateRangeErrors] = useState('');
  const [eggCountErrors, setEggCountErrors] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);



  const handleMinChange = (value) => {
    setMinEggs(value);
    // Add your filtering logic here
    console.log('Min Eggs:', value);
  };

  const handleMaxChange = (value) => {
    setMaxEggs(value);
    // Add your filtering logic here
    console.log('Max Eggs:', value);
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
          date: "Year must be between 1000 and 9999.",
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
          return; // Exit the function if the year is out of range
        } else {
          setDateRangeErrors('');
        }
      }

      // Update formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));

    };

    handleFilterChange(`${id}:${value}`);
  };

  const handleReset = () => {
    // Reset the filter criteria and other states related to filtering
    setFilterCriteria('');
    setFormData({
      firstName: '',
      lastName: '',
      barangay: '',
      date: '',
      noOfEggs: '',
    });
    setMinEggs('');
    setMaxEggs('');

    // Clear any form errors
    setFormErrors({
      firstName: '',
      lastName: '',
      barangay: '',
      date: '',
      noOfEggs: '',
    });
    setBarangayErrors('');
    setDateRangeErrors('');
    setEggCountErrors('');

    // Uncheck all checkboxes in the filter dropdown
    const checkboxes = document.querySelectorAll('.dropdown-menu .form-check-input');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    // Reset the date and egg count inputs
    document.getElementById("dateFrom").value = '';
    document.getElementById("dateTo").value = '';
    document.getElementById("eggFilterFrom").value = '';
    document.getElementById("eggFilterTo").value = '';

    // Reset the select all checkbox
    setSelectAll(false);

    console.log('Filters have been reset');
  };




  const validateDropdownFilters = () => {
    let isValid = true;


    // Validate Date Range
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


    // Check if minEggs and maxEggs are whole numbers
    if (!Number.isInteger(parseFloat(minEggs)) || !Number.isInteger(parseFloat(maxEggs))) {
      errorMsg = 'The input must be a whole number.';
      isValid = false;
    }
    // Check if minEggs and maxEggs are non-negative
    else if (parseInt(minEggs, 10) < 0 || parseInt(maxEggs, 10) < 0) {
      errorMsg = 'Number of eggs must be 0 or greater.';
      isValid = false;
    }
    // Check if maxEggs is greater than or equal to minEggs
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
        errors.date = 'Year must be between 1000 and 9999.';
      }
    }
    if (formData.noOfEggs === '' || formData.noOfEggs < 0) {
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


  const handleApplyClick = () => {
    if (validateDropdownFilters()) {
      setApplyMessage('Filters have been applied successfully.');
      setTimeout(() => setApplyMessage(''), 3000); // Hide after 3 seconds
      handleReset(); // Optional: Reset filters after applying
    }
  };



  return (
    <div className="container my-12">
      <div className="row-btn d-flex justify-content-between align-items-center mb-3">
        <h2 className='titleList'>List of Egg Surrenders
        <p className='totalRec'>{surrenderers.length} total records</p>
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
                <div className="row">
                  <div className="col-md-6">
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

                  <div className="col-md-6">
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
                </div>
              </div>



              <div className="dropdown-item">
                <h6 className='filterSubtitle'>Barangay</h6>
                <hr></hr>
                <div className="container">
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
                        <label className="form-check-label" htmlFor="wawa">Wawa Ilaya</label>
                      </div>

                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="selectAllBarangays" checked={selectAll} onChange={handleSelectAllChange} />
                        <label className="form-check-label" htmlFor="selectAllBarangays">Select All</label>
                      </div>
                    </div>
                    {barangayErrors && <p className="text-danger">{barangayErrors}</p>}
                  </div>
                </div>
              </div>

              <div className="dropdown-item">
                <h6 className="filterSubtitle">Date Range</h6>
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
                <h6 className="filterSubtitle">Number of Eggs</h6>
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
                        validateEggCount(e.target.value, maxEggs); // Validate on change
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
                        validateEggCount(minEggs, e.target.value); // Validate on change
                      }}
                      min="0"
                    />
                  </div>
                </div>
                {eggCountErrors && <p className="text-danger mt-2">{eggCountErrors}</p>}
              </div>
              <br></br>

              <button className='btn btn-secondary cancel' onClick={handleReset}>CANCEL</button>
              <button className='btn btn-primary apply' onClick={handleApplyClick}>APPLY</button>
            </div>
          </div>
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
    </div>

  );
};
