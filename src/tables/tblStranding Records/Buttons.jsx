import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblStrandingRecords.css';
import { IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export const Buttons = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');
  const [dateRangeErrors, setDateRangeErrors] = useState('');
  const [minTurtles, setMinTurtles] = useState('');
  const [maxTurtles, setMaxTurtles] = useState('');
  const [turtleCountErrors, setTurtleCountErrors] = useState('');
  const [minLatitude, setMinLatitude] = useState('');
  const [maxLatitude, setMaxLatitude] = useState('');
  const [latitudeRangeErrors, setLatitudeRangeErrors] = useState('');
  const [minLongitude, setMinLongitude] = useState('');
  const [maxLongitude, setMaxLongitude] = useState('');
  const [longitudeRangeErrors, setLongitudeRangeErrors] = useState('');
  const [minCarapaceLength, setMinCarapaceLength] = useState('');
  const [maxCarapaceLength, setMaxCarapaceLength] = useState('');
  const [carapaceLengthRangeErrors, setCarapaceLengthRangeErrors] = useState('');
  const [minCarapaceWidth, setMinCarapaceWidth] = useState('');
  const [maxCarapaceWidth, setMaxCarapaceWidth] = useState('');
  const [carapaceWidthRangeErrors, setCarapaceWidthRangeErrors] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    date: '',
    species: '',
    noOfTurtle: '',
    sex: '',
    location: '',
    latitude: '',
    longitude: '',
    condition: '',
    disposition: '',
    tagNum: '',
    remarks: '',
    length: '',
    width: '',


  });
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    date: '',
    species: '',
    noOfTurtle: '',
    sex: '',
    location: '',
    latitude: '',
    longitude: '',
    condition: '',
    disposition: '',
    tagNum: '',
    remarks: '',
    length: '',
    width: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const modalRef = useRef(null);

  const handleMinChange = (value) => {
    setMinTurtles(value);
    console.log('Min Turtles:', value);
  };

  const handleMaxChange = (value) => {
    setMaxTurtles(value);
    console.log('Max Turtles:', value);
  };



  const handleMinLatitudeChange = (value) => {
    setMinLatitude(value);
    console.log('Min Latitude:', value);
  };

  const handleMaxLatitudeChange = (value) => {
    setMaxLatitude(value);
    console.log('Max Latitude:', value);
  };



  const handleMinLongitudeChange = (value) => {
    setMinLongitude(value);
    console.log('Min Longitude:', value);
  };

  const handleMaxLongitudeChange = (value) => {
    setMaxLongitude(value);
    console.log('Max Longitude:', value);
  };

  const handleMinCarapaceLengthChange = (value) => {
    setMinCarapaceLength(value);
    console.log('Min Carapace Length:', value);
  };

  const handleMaxCarapaceLengthChange = (value) => {
    setMaxCarapaceLength(value);
    console.log('Max Carapace Length:', value);
  };

  const handleMinCarapaceWidthChange = (value) => {
    setMinCarapaceWidth(value);
    console.log('Min Carapace Width:', value);
  };

  const handleMaxCarapaceWidthChange = (value) => {
    setMaxCarapaceWidth(value);
    console.log('Max Carapace Width:', value);
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
        fullName: '',
        date: '',
        species: '',
        noOfTurtle: '',
        sex: '',
        location: '',
        latitude: '',
        longitude: '',
        condition: '',
        disposition: '',
        tagNum: '',
        remarks: '',
        length: '',
        width: '',
      });
      setFormErrors({
        fullName: '',
        date: '',
        species: '',
        noOfTurtle: '',
        sex: '',
        location: '',
        latitude: '',
        longitude: '',
        condition: '',
        disposition: '',
        tagNum: '',
        remarks: '',
        length: '',
        width: '',
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

  const handleReset = () => {
    setFilterCriteria('');
    setFormData({
      date: '',
    });
    setMinTurtles('');
    setMaxTurtles('');
    setMinLatitude('');
    setMaxLatitude('');
    setMinLongitude('');
    setMaxLongitude('');
    setMinCarapaceLength('');
    setMaxCarapaceLength('');
    setMinCarapaceWidth('');
    setMaxCarapaceWidth('');
    setFormErrors({
      date: '',

    });
    setDateRangeErrors('');
    setTurtleCountErrors('');
    setLatitudeRangeErrors('');
    setLongitudeRangeErrors('');
    setCarapaceLengthRangeErrors('');
    setCarapaceWidthRangeErrors('');

    const checkboxes = document.querySelectorAll('.dropdown-menu .form-check-input');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    document.getElementById("dateFrom").value = '';
    document.getElementById("dateTo").value = '';

    setSelectAll(false);


    console.log('Filters have been reset');
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


  const validateTurtleCount = (minTurtles, maxTurtles) => {
    let isValid = true;
    let errorMsg = '';


    if (!Number.isInteger(parseFloat(minTurtles)) || !Number.isInteger(parseFloat(maxTurtles))) {
      errorMsg = 'The input must be a whole number.';
      isValid = false;
    }
    else if (parseInt(minTurtles, 10) < 0 || parseInt(maxTurtles, 10) < 0) {
      errorMsg = 'Number of turtles must be 0 or greater.';
      isValid = false;
    }
    else if (parseInt(minTurtles, 10) > parseInt(maxTurtles, 10)) {
      errorMsg = 'Max value should be greater.';
      isValid = false;
    }
    else {
      errorMsg = '';
    }

    setTurtleCountErrors(errorMsg);
    return isValid;
  };

  const validateLatitudeRange = (minLatitude, maxLatitude) => {
    let isValid = true;
    let errorMsg = '';

    const minLat = parseFloat(minLatitude);
    const maxLat = parseFloat(maxLatitude);

    if (isNaN(minLat) || isNaN(maxLat)) {
      errorMsg = 'Please enter valid numbers for latitude.';
      isValid = false;
    } else if (minLat < -90 || minLat > 90 || maxLat < -90 || maxLat > 90) {
      errorMsg = 'Latitude values must be between -90 and 90.';
      isValid = false;
    } else if (minLat > maxLat) {
      errorMsg = 'Max value should be greater.';
      isValid = false;
    } else {
      errorMsg = '';
    }

    setLatitudeRangeErrors(errorMsg);
    return isValid;
  };


  const validateLongitudeRange = (minLongitude, maxLongitude) => {
    let isValid = true;
    let errorMsg = '';

    const minLong = parseFloat(minLongitude);
    const maxLong = parseFloat(maxLongitude);

    if (isNaN(minLong) || isNaN(maxLong)) {
      errorMsg = 'Please enter valid numbers for longitude.';
      isValid = false;
    } else if (minLong < -180 || minLong > 180 || maxLong < -180 || maxLong > 180) {
      errorMsg = 'Longitude values must be between -180 and 180.';
      isValid = false;
    } else if (minLong > maxLong) {
      errorMsg = 'Max value should be greater.';
      isValid = false;
    } else {
      errorMsg = '';
    }

    setLongitudeRangeErrors(errorMsg);
    return isValid;
  };

  const validateCarapaceLength = (minLength, maxLength) => {
    let isValid = true;
    let errorMsg = '';

    if (isNaN(parseFloat(minLength)) || isNaN(parseFloat(maxLength))) {
      errorMsg = 'Carapace length must be a valid number.';
      isValid = false;
    }
    else if (parseFloat(minLength) < 0 || parseFloat(maxLength) < 0) {
      errorMsg = 'Carapace length must be 0 or greater.';
      isValid = false;
    }
    else if (parseFloat(minLength) > parseFloat(maxLength)) {
      errorMsg = 'Max length must be greater than min.';
      isValid = false;
    }
    else {
      errorMsg = '';
    }

    setCarapaceLengthRangeErrors(errorMsg);
    return isValid;
};


const validateCarapaceWidth = (minWidth, maxWidth) => {
  let isValid = true;
  let errorMsg = '';

  if (isNaN(parseFloat(minWidth)) || isNaN(parseFloat(maxWidth))) {
    errorMsg = 'Carapace width must be a valid number.';
    isValid = false;
  }
  else if (parseFloat(minWidth) < 0 || parseFloat(maxWidth) < 0) {
    errorMsg = 'Carapace width must be 0 or greater.';
    isValid = false;
  }
  else if (parseFloat(minWidth) > parseFloat(maxWidth)) {
    errorMsg = 'Max width must be greater than or equal to the min width.';
    isValid = false;
  }
  else {
    errorMsg = '';
  }

  setCarapaceWidthRangeErrors(errorMsg);
  return isValid;
};


  const validateForm = () => {
    const errors = {};

    if (!formData.fullName) {
      errors.fullName = 'Observer\'s Name is required';
    } else if (!/^[\p{L}\s]+$/u.test(formData.fullName)) {
      errors.fullName = 'Observer\'s Name must only contain letters, spaces, and special characters';
    } else if (/^\s*$/.test(formData.fullName)) {
      errors.fullName = 'Observer\'s Name must contain at least one letter';
    }

    if (!formData.date) errors.date = 'Date is required';
    if (!formData.species) errors.species = 'Species is Required';
    if (!formData.species) errors.species = 'Species is Required';
    if (formData.noOfTurtle === '' || formData.noOfTurtle < 0) {
      errors.noOfTurtle = 'Number of Turtles by Day is required and must be 0 or greater';
    }
    if (!formData.sex) errors.sex = 'Sex of the Species is Required';
    if (!formData.location) errors.location = 'Specific Location is Required';

    if (!formData.latitude) {
      errors.latitude = 'Latitude is required. Please provide a valid latitude.';
    } else if (!/^(-?[1-8]?[0-9]|90)(\.\d+)?$/.test(formData.latitude)) {
      errors.latitude = 'Invalid latitude format. Please enter a number between -90 and 90, with up to 6 decimal places.';
    }

    if (!formData.longitude) {
      errors.longitude = 'Longitude is required. Please provide a valid longitude.';
    } else if (!/^(-?(1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?|180(\.0+)?)$/.test(formData.longitude)) {
      errors.longitude = 'Invalid longitude format. Please enter a number between -180 and 180, with up to 6 decimal places.';
    }

    if (!formData.condition) errors.condition = 'Condition of the Turtle is Required';
    if (!formData.disposition) errors.disposition = 'Final Disposition of the Turtle is Required';
    if (!formData.length) {
      errors.length = 'Curved Carapace Length is required. Please provide a valid measurement.';
    } else if (!/^\d+(\.\d{1,2})$/.test(formData.length)) {
      errors.length = 'Invalid format. Please enter a number with up to two decimal places.';
    }

    if (!formData.width) {
      errors.width = 'Curved Carapace Width is required. Please provide a valid measurement.';
    } else if (!/^\d+(\.\d{1,2})$/.test(formData.width)) {
      errors.width = 'Invalid format. Please enter a number with up to two decimal places.';
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
        <h2 className='titleList'>List of Stranded Pawikan
          <p className='totalRec'>500 total records</p>
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
                <h6 className="filterSubtitle">Observer's Full Name</h6>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultFullName" id="flexRadioDefault1" />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Ascending
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultFullName" id="flexRadioDefault2" />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Descending
                      </label>
                    </div>
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
                <h6 className='filterSubtitle'>Species</h6>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="species" onChange={() => handleFilterChange('greenSea')} id="greenSea" />
                      <label className="form-check-label" htmlFor="greenSea">Green Sea Turtle</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="species" onChange={() => handleFilterChange('hawksBill')} id="hawksBill" />
                      <label className="form-check-label" htmlFor="hawksBill">Hawksbill Turtle</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="species" onChange={() => handleFilterChange('oliveRidley')} id="oliveRidely" />
                      <label className="form-check-label" htmlFor="oliveRidely">Olive Ridely Turtle</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="species" onChange={() => handleFilterChange('loggerHead')} id="loggerHead" />
                      <label className="form-check-label" htmlFor="loggerHead">Loggerhead Turtle</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="species" onChange={() => handleFilterChange('leatherBack')} id="leatherBack" />
                      <label className="form-check-label" htmlFor="leatherBack">Leatherback Turtle</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="species" onChange={() => handleFilterChange('unidentified')} id="unidentified" />
                      <label className="form-check-label" htmlFor="unidentified">Unidentified</label>
                    </div>
                  </div>
                </div>
              </div>


              <div className="dropdown-item">
                <h6 className="filterSubtitle">Turtle Number by Day</h6>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      id="turtleFilterForm"
                      placeholder="Min"
                      value={minTurtles}
                      onChange={(e) => {
                        handleMinChange(e.target.value);
                        validateTurtleCount(e.target.value, maxTurtles);
                      }}
                      min="0"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      id="turtleFilterTo"
                      placeholder="Max"
                      value={maxTurtles}
                      onChange={(e) => {
                        handleMaxChange(e.target.value);
                        validateTurtleCount(minTurtles, e.target.value);
                      }}
                      min="0"
                    />
                  </div>
                </div>
                {turtleCountErrors && <p className="text-danger mt-2">{turtleCountErrors}</p>}
              </div>

              <div className="dropdown-item">
                <h6 className='filterSubtitle'>Sex</h6>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="sex" onChange={() => handleFilterChange('female')} id="female" />
                      <label className="form-check-label" htmlFor="female">Female</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="sex" onChange={() => handleFilterChange('male')} id="male" />
                      <label className="form-check-label" htmlFor="male">Male</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="sex" onChange={() => handleFilterChange('unidentified')} id="unidentified" />
                      <label className="form-check-label" htmlFor="unidentified">Unidentified</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dropdown-item">
                <h6 className='filterSubtitle'>Barangay</h6>
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
                </div>
              </div>


              <div className="dropdown-item">
                <h6 className="filterSubtitle">Latitude Range</h6>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      id="latitudeFilterMin"
                      placeholder="Min Latitude"
                      value={minLatitude}
                      onChange={(e) => {
                        handleMinLatitudeChange(e.target.value);
                        validateLatitudeRange(e.target.value, maxLatitude);
                      }}
                      min="-90"
                      max="90"
                      step="0.0001"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      id="latitudeFilterMax"
                      placeholder="Max Latitude"
                      value={maxLatitude}
                      onChange={(e) => {
                        handleMaxLatitudeChange(e.target.value);
                        validateLatitudeRange(minLatitude, e.target.value);
                      }}
                      min="-90"
                      max="90"
                      step="0.0001"
                    />
                  </div>
                </div>
                {latitudeRangeErrors && <p className="text-danger mt-2">{latitudeRangeErrors}</p>}
              </div>

              <div className="dropdown-item">
                <h6 className="filterSubtitle">Longitude Range</h6>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      id="longitudeFilterMin"
                      placeholder="Min Longitude"
                      value={minLongitude}
                      onChange={(e) => {
                        handleMinLongitudeChange(e.target.value);
                        validateLongitudeRange(e.target.value, maxLongitude);
                      }}
                      min="-180"
                      max="180"
                      step="0.0001"
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      className="form-control"
                      id="longitudeFilterMax"
                      placeholder="Max Longitude"
                      value={maxLongitude}
                      onChange={(e) => {
                        handleMaxLongitudeChange(e.target.value);
                        validateLongitudeRange(minLongitude, e.target.value);
                      }}
                      min="-180"
                      max="180"
                      step="0.0001"
                    />
                  </div>
                </div>
                {longitudeRangeErrors && <p className="text-danger mt-2">{longitudeRangeErrors}</p>}
              </div>


              <div className="dropdown-item">
                <h6 className='filterSubtitle'>Condition</h6>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                   
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="condition" onChange={() => handleFilterChange('alive')} id="alive" />
                      <label className="form-check-label" htmlFor="alive">Alive</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="condition" onChange={() => handleFilterChange('freshDead')} id="freshDead" />
                      <label className="form-check-label" htmlFor="freshDead">Fresh Dead</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="condition" onChange={() => handleFilterChange('moderatelyDecomposed')} id="moderatelyDecomposed" />
                      <label className="form-check-label" htmlFor="moderatelyDecomposed">Moderately Decomposed</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="condition" onChange={() => handleFilterChange('severelyDecomposed')} id="severelyDecomposed" />
                      <label className="form-check-label" htmlFor="severelyDecomposed">Severely Decomposed</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="condition" onChange={() => handleFilterChange('driedCarcass')} id="driedCarcass" />
                      <label className="form-check-label" htmlFor="driedCarcass">Dried Carcass</label>
                    </div>
                  <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="condition" onChange={() => handleFilterChange('skeleton')} id="skeleton" />
                      <label className="form-check-label" htmlFor="skeleton">Skeleton, Bones only</label>
                    </div>
                  </div>
                </div>
              </div>


              
              <div className="dropdown-item">
                <h6 className='filterSubtitle'>Final Disposition</h6>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                  <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="condition" onChange={() => handleFilterChange('alive')} id="alive" />
                      <label className="form-check-label" htmlFor="alive">Alive</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="disposition" onChange={() => handleFilterChange('buried')} id="buried" />
                      <label className="form-check-label" htmlFor="buried">Buried</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="disposition" onChange={() => handleFilterChange('pulledUp')} id="pulledUp" />
                      <label className="form-check-label" htmlFor="pulledUp">Pulled Up</label>
                    </div>
                  <div className="form-check">
                      <input className="form-check-input" type="checkbox" data-category="disposition" onChange={() => handleFilterChange('salvaged')} id="salvaged" />
                      <label className="form-check-label" htmlFor="salvaged">Salvaged</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dropdown-item">
                <h6 className="filterSubtitle">Tag Number</h6>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultFullName" id="flexRadioDefault1" />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Ascending
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefaultFullName" id="flexRadioDefault2" />
                      <label className="form-check-label" htmlFor="flexRadioDefault2">
                        Descending
                      </label>
                    </div>
                  </div>
                </div>
              </div>


              <div className="dropdown-item">
  <h6 className="filterSubtitle">Carapace Length</h6>
  <hr />
  <div className="row">
    <div className="col-6">
      <input
        type="number"
        className="form-control"
        id="carapaceLengthFilterMin"
        placeholder="Min"
        value={minCarapaceLength}
        onChange={(e) => {
          handleMinCarapaceLengthChange(e.target.value);
          validateCarapaceLength(e.target.value, maxCarapaceLength);
        }}
        min="0" 
        step="0.01" 
      />
    </div>
    <div className="col-6">
      <input
        type="number"
        className="form-control"
        id="carapaceLengthFilterMax"
        placeholder="Max"
        value={maxCarapaceLength}
        onChange={(e) => {
          handleMaxCarapaceLengthChange(e.target.value);
          validateCarapaceLength(minCarapaceLength, e.target.value);
        }}
        min="0"
        step="0.01"
      />
    </div>
  </div>
  {carapaceLengthRangeErrors && <p className="text-danger mt-2">{carapaceLengthRangeErrors}</p>}
</div>



<div className="dropdown-item">
  <h6 className="filterSubtitle">Carapace Width</h6>
  <hr />
  <div className="row">
    <div className="col-6">
      <input
        type="number"
        className="form-control"
        id="carapaceWidthFilterMin"
        placeholder="Min"
        value={minCarapaceWidth}
        onChange={(e) => {
          handleMinCarapaceWidthChange(e.target.value);
          validateCarapaceWidth(e.target.value, maxCarapaceWidth);
        }}
        min="0" 
        step="0.01"
      />
    </div>
    <div className="col-6">
      <input
        type="number"
        className="form-control"
        id="carapaceWidthFilterMax"
        placeholder="Max"
        value={maxCarapaceWidth}
        onChange={(e) => {
          handleMaxCarapaceWidthChange(e.target.value);
          validateCarapaceWidth(minCarapaceWidth, e.target.value);
        }}
        min="0"
        step="0.01"
      />
    </div>
  </div>
  {carapaceWidthRangeErrors && <p className="text-danger mt-2">{carapaceWidthRangeErrors}</p>}
</div>
<br />

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
                  <h6 className='modal-subtitle'>What's the Report? Add details of the observer and the stranded pawikan here!</h6>
                  <br></br>
                  <form>
                    <div className="form-group">
                      <label htmlFor="fullName">Observer's Full Name</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                        id="fullName"
                        placeholder="Enter Full Name of the Observer"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />

                      {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="date">Stranding Date</label>
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
                      <label htmlFor="species">Species</label>
                      <select
                        id="species"
                        className={`form-control ${formErrors.species ? 'is-invalid' : ''}`}
                        value={formData.species}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a Species</option>
                        <option value="greenSea">Green Sea Turtle</option>
                        <option value="hawksBill">Hawksbill Turtle</option>
                        <option value="oliveRidley">Olive Ridley Turtle</option>
                        <option value="loggerHead">Loggerhead Turtle</option>
                        <option value="leatherHead">Leatherhead Turtle</option>
                        <option value="unidentified">Unidentified</option>

                      </select>
                      {formErrors.species && (
                        <small className="text-danger">{formErrors.species}</small>
                      )}
                    </div>


                    <div className="form-group">
                      <label htmlFor="noOfTurtle">Turtle Number by Day</label>
                      <input
                        type="number"
                        id="noOfTurtle"
                        className={`form-control ${formErrors.noOfTurtle ? 'is-invalid' : ''}`}
                        placeholder="Enter the Number of Turtles by Day"
                        value={formData.noOfTurtle}
                        onChange={handleInputChange}
                        min="0"
                      />
                      {formErrors.noOfTurtle && (
                        <small className="text-danger">{formErrors.noOfTurtle}</small>
                      )}
                    </div>


                    <div className="form-group">
                      <label htmlFor="sex">Turtle Sex</label>
                      <select
                        id="sex"
                        className={`form-control ${formErrors.sex ? 'is-invalid' : ''}`}
                        value={formData.sex}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Turtle Sex</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>

                      </select>
                      {formErrors.sex && (
                        <small className="text-danger">{formErrors.sex}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">Location (Specific)</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.location ? 'is-invalid' : ''}`}
                        id="location"
                        placeholder="Enter the Specific Location where Turtle is Found"
                        value={formData.location}
                        onChange={handleInputChange}
                      />

                      {formErrors.location && <div className="invalid-feedback">{formErrors.location}</div>}
                    </div>


                    <div className="form-group">
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.latitude ? 'is-invalid' : ''}`}
                        id="latitude"
                        placeholder="Enter Latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        pattern="-?([1-8]?[0-9]|90)\.\d+"  // Regex pattern for latitude
                        title="Enter a valid latitude in decimal degrees, e.g., 37.7749"
                      />
                      {formErrors.latitude && <div className="invalid-feedback">{formErrors.latitude}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.longitude ? 'is-invalid' : ''}`}
                        id="longitude"
                        placeholder="Enter Longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        pattern="-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?|180(\.0+)?)"  // Regex pattern for longitude
                        title="Enter a valid longitude in decimal degrees, e.g., -122.4194"
                      />
                      {formErrors.longitude && <div className="invalid-feedback">{formErrors.longitude}</div>}
                    </div>


                    <div className="form-group">
                      <label htmlFor="condition">Condition</label>
                      <select
                        id="condition"
                        className={`form-control ${formErrors.condition ? 'is-invalid' : ''}`}
                        value={formData.condition}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a Condition</option>
                        <option value="alive">Alive</option>
                        <option value="freshDead">Fresh Dead</option>
                        <option value="decomposedModerate">Moderately Decomposed</option>
                        <option value="decomposedSevere">Severely Decomposed</option>
                        <option value="driedCarcass">Dried Carcass</option>
                        <option value="skeleton">Skeleton, Bones Only</option>

                      </select>
                      {formErrors.condition && (
                        <small className="text-danger">{formErrors.condition}</small>
                      )}
                    </div>


                    <div className="form-group">
                      <label htmlFor="disposition">Final Disposition</label>
                      <select
                        id="disposition"
                        className={`form-control ${formErrors.noOfTurtle ? 'is-invalid' : ''}`}
                        value={formData.disposition}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Final Disposition</option>
                        <option value="buriedBeach">Buried, On Beach</option>
                        <option value="buriedOffBeach">Buried, Off Beach</option>
                        <option value="salvageAll">Salvaged Specimen, All</option>
                        <option value="salvagePart">Salvaged Specimen, Part</option>
                        <option value="pulledBeach">Pulled Up, Beach</option>
                        <option value="pulledDune">Pulled Up, Dune</option>
                        <option value="Alive, Release">Alive, Release</option>

                      </select>
                      {formErrors.disposition && (
                        <small className="text-danger">{formErrors.disposition}</small>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="tagNum">Tag Number</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.tagNum ? 'is-invalid' : ''}`}
                        id="tagNum"
                        placeholder="Enter Tag Number (Optional)"
                        value={formData.tagNum}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="length">Curved Carapace Length (CCL)</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.length ? 'is-invalid' : ''}`}
                        id="length"
                        placeholder="Enter Curved Carapace Length in cm"
                        value={formData.length}
                        onChange={handleInputChange}
                        pattern="\d+(\.\d{1,2})?"  // Allows numbers with up to 2 decimal places
                        title="Enter a valid number with up to two decimal places, e.g., 75.25"
                        required
                      />
                      {formErrors.length && <div className="invalid-feedback">{formErrors.length}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="width">Curved Carapace Width (CCW)</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.width ? 'is-invalid' : ''}`}
                        id="width"
                        placeholder="Enter Curved Carapace Width in cm"
                        value={formData.width}
                        onChange={handleInputChange}
                        pattern="\d+(\.\d{1,2})?"  // Allows numbers with up to 2 decimal places
                        title="Enter a valid number with up to two decimal places, e.g., 45.75"
                        required
                      />
                      {formErrors.width && <div className="invalid-feedback">{formErrors.width}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="remarks">Remarks</label>
                      <textarea
                        className={`form-control ${formErrors.remarks ? 'is-invalid' : ''}`}
                        id="remarks"
                        placeholder="Enter any additional notes or observations about the turtle."
                        value={formData.remarks}
                        onChange={handleInputChange}
                      />
                      <p className="form-text text-muted small-font">
                        Provide details like involvement with tar or oil, gear or debris entanglement, wounds, or other relevant observations.
                      </p>
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
