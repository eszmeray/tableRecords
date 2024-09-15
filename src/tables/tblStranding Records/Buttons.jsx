import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles/tblStrandingRecords.css';
import { IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch, FaSlidersH} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export const Buttons = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
