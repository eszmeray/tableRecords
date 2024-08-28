import React, { useState, useRef, useEffect } from 'react';
import './styles/tblStrandingRecords.css';
import { FaEdit, FaEye } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';



const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const generateObservers = (num) => {
  const fullNames = ['Elena Rivera', 'Patricia Rodriguez', 'Roberto Castro', 'Alejandro Quijano', 'Jessica De Guzma', 'Michael Pedro', 'Olivia Riley'];
  const specie = ['Green Sea Turtle', 'Hawksbill Turtle', 'Oliver Ridley Turtle', 'Loggerhead Turtle', 'Leatherback Turtle', 'Unidentified'];
  const turtleSex = ['Female', 'Male'];
  const locations =  ['Taal Lake Shoreline', 'Matabungkay Beach', 'Kay Reyna Beach', 'Sampaguita Beach', 'Submarine Garden', 'Bagong Silang Beach', 'Nonong Casto Shoreline'];
  const conditions =  ['Alive', 'Fresh Dead', 'Moderately Decomposed', 'Severely Decomposed', 'Dried Carcass', 'Skeleton, Bones Only'];
  const dispositions =  ['Buried, On Beach', 'Buried, Off Beach', 'Salvaged Specimen, All', 'Salvaged Specimen, Part', 'Pulled Up, Beach', 'Pulled Up, Dune', 'Alive, Release'];
  const tagNumbers = ['T1234','T2468'];
  const remarks = ['Involvement with Tar', 'Oil on Shell', 'Gear Entanglement'];
  const observers = [];

  for (let i = 0; i < num; i++) {
    const fullName = fullNames[Math.floor(Math.random() * fullNames.length)];
    const date = formatDate(new Date());
    const species = specie[Math.floor(Math.random() * specie.length)];
    const noOfTurtle = Math.floor(Math.random() * 100) + 1;
    const sex = turtleSex[Math.floor(Math.random() * turtleSex.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const latitude = (Math.random() * (13.95 - 13.85) + 13.85).toFixed(6); 
    const longitude = (Math.random() * (120.93 - 120.85) + 120.85).toFixed(6); 
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const disposition = dispositions[Math.floor(Math.random() * dispositions.length)];
    const tagNum = tagNumbers[Math.floor(Math.random() * tagNumbers.length)];
    const curvedCarapaceLength = (Math.random() * (120 - 50) + 50).toFixed(2); 
    const curvedCarapaceWidth = (Math.random() * (80 - 30) + 30).toFixed(2);  
    const remark = remarks[Math.floor(Math.random() * remarks.length)];

    observers.push({
      fullName,
      date,
      species,
      noOfTurtle,
      sex,
      location,
      latitude,
      longitude,
      condition,
      disposition,
      tagNum,
      curvedCarapaceLength,
      curvedCarapaceWidth,
      remark,
    });
  }
   
  return observers;
};


const initialObservers = generateObservers(500);

export const Table = () => {
  const [observers, setObservers] = useState(initialObservers);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedObserversIndex, setSelectedObserversIndex] = useState(null);
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
    curvedCarapaceLength: '',
    curvedCarapaceWidth: '',
    remark: '',


  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);
  
  const toggleEditModal = (index) => {
    const globalIndex = page * rowsPerPage + index; 
    const selectedObserver = observers[globalIndex];
    
    setSelectedObserversIndex(globalIndex);
    setFormData({
      fullName: selectedObserver.fullName,
      date: selectedObserver.date,
      species: selectedObserver.species, // Correct key here
      noOfTurtle: selectedObserver.noOfTurtle,
      sex: selectedObserver.sex,  // Ensure the correct field is set
      location: selectedObserver.location,
      latitude: selectedObserver.latitude,
      longitude: selectedObserver.longitude,
      condition: selectedObserver.condition,
      disposition: selectedObserver.disposition, // Ensure this is set correctly
      tagNum: selectedObserver.tagNum,
      curvedCarapaceLength: selectedObserver.curvedCarapaceLength,
      curvedCarapaceWidth: selectedObserver.curvedCarapaceWidth,
      remark: selectedObserver.remark,
    });
    setShowEditModal(!showEditModal);
  };

  const toggleViewModal = (index) => {
    const globalIndex = page * rowsPerPage + index; 
    
    setSelectedObserversIndex(globalIndex);
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
      [id]: value,
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
    if (!formData.curvedCarapaceLength) {
      errors.curvedCarapaceLength = 'Curved Carapace Length is required. Please provide a valid measurement.';
    } else if (!/^\d+(\.\d{1,2})$/.test(formData.curvedCarapaceLength)) {
      errors.curvedCarapaceLength = 'Invalid format. Please enter a number with up to two decimal places.';
    }
    
    if (!formData.curvedCarapaceWidth) {
      errors.curvedCarapaceWidth = 'Curved Carapace Width is required. Please provide a valid measurement.';
    } else if (!/^\d+(\.\d{1,2})$/.test(formData.curvedCarapaceWidth)) {
      errors.curvedCarapaceWidth = 'Invalid format. Please enter a number with up to two decimal places.';
    }
    
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
};
  
  const handleSaveClick = () => {
    if (validateForm()) {
      const updatedObservers = [...observers];
      updatedObservers[selectedObserversIndex] = {
        ...formData,
      };
      setObservers(updatedObservers);
      setSuccessMessage('Data has been updated successfully.');
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000); 
    }
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (globalIndex) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(globalIndex)) {
        newSelectedRows.delete(globalIndex);
      } else {
        newSelectedRows.add(globalIndex);
      }
      return newSelectedRows;
    });
  };
  

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const newSelectedRows = new Set();
      observers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach((_, index) => {
        newSelectedRows.add(index);
      });
      setSelectedRows(newSelectedRows);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const allRowsSelected = observers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).every((_, index) => selectedRows.has(index));
    setSelectAll(allRowsSelected);
  }, [selectedRows, page, rowsPerPage, observers]);

  return (
    <div className={`table-container`}>
      {(showEditModal || showViewModal) && (
        <div className="modal-background-blur"></div>
      )}

      {successMessage && (
        <div className="message-box success-message">
          {successMessage}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-no-border">
          <thead className="thead">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th>Observer's<tr></tr>Full Name</th>
              <th>Stranding<tr></tr> Date</th>
              <th>Species</th>
              <th>Turtle Number<tr></tr>by Day</th>
              <th>Sex</th>
              <th>Location</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Condition</th>
              <th>Final<tr></tr>Disposition</th>
              <th>Tag Number</th>
              <th>Curved Carapace<tr></tr> Length</th>
              <th>Curved Carapace<tr></tr> Width</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {observers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((observer, index) => (
    <tr key={index}>
      <td>
        <input
          type="checkbox"
          checked={selectedRows.has(page * rowsPerPage + index)}
          onChange={() => handleCheckboxChange(page * rowsPerPage + index)}
        />
      </td>
      <td>{observer.fullName}</td>
      <td>{observer.date}</td>
      <td>{observer.species}</td>
      <td>{observer.noOfTurtle}</td>
      <td>{observer.sex}</td>
      <td>{observer.location}</td>
      <td>{observer.latitude}</td>
      <td>{observer.longitude}</td>
      <td>{observer.condition}</td>
      <td>{observer.disposition}</td>
      <td>{observer.tagNum}</td>
      <td>{observer.curvedCarapaceLength}</td>
      <td>{observer.curvedCarapaceWidth}</td>
      <td>{observer.remark}</td>

      <td>
        <span className="actions">
          <button onClick={() => toggleEditModal(index)} className="action-button edit"><FaEdit />Edit</button>
          <button onClick={() => toggleViewModal(index)} className="action-button view"><FaEye />View</button>
        </span>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>

      {showEditModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={editModalRef}>
             
              <div className="modal-body">
              <h2 className="modal-title">Edit Record</h2>
                <h6 className='modal-subtitle'>Need to update details? Make changes to the observer and stranded pawikan information here!</h6>
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
                      className={`form-control ${formErrors.curvedCarapaceWidth ? 'is-invalid' : ''}`}
                      value={formData.species} // Correct key here
                      onChange={handleInputChange}
                    >
                      <option value="">Select a Species</option>
                      <option value="Green Sea Turtle">Green Sea Turtle</option>
                      <option value="Hawksbill Turtle">Hawksbill Turtle</option>
                      <option value="Olive Ridley Turtle">Olive Ridley Turtle</option>
                      <option value="Loggerhead Turtle">Loggerhead Turtle</option>
                      <option value="Leatherback Turtle">Leatherback Turtle</option>
                      <option value="Unidentified">Unidentified</option>
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
                      value={formData.sex}  // Make sure the value is bound to `formData.sex`
                      onChange={handleInputChange}
                    >
                      <option value="">Select Turtle Sex</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                    {formErrors.sex && <small className="text-danger">{formErrors.sex}</small>}
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
                      <option value="Alive">Alive</option>
                      <option value="Fresh Dead">Fresh Dead</option>
                      <option value="Moderately Decomposed">Moderately Decomposed</option>
                      <option value="Severely Decomposed">Severely Decomposed</option>
                      <option value="Dried Carcass">Dried Carcass</option>
                      <option value="Skeleton">Skeleton, Bones Only</option>
                    </select>
                    {formErrors.condition && (
                      <small className="text-danger">{formErrors.condition}</small>
                    )}
                  </div>


                  <div className="form-group">
                  <label htmlFor="disposition">Final Disposition</label>
                  <select
                    id="disposition"
                    className={`form-control ${formErrors.disposition ? 'is-invalid' : ''}`}
                    value={formData.disposition}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Final Disposition</option>
                    <option value="Buried, On Beach">Buried, On Beach</option>
                    <option value="Buried, Off Beach">Buried, Off Beach</option>
                    <option value="Salvaged Specimen, All">Salvaged Specimen, All</option>
                    <option value="Salvaged Specimen, Part">Salvaged Specimen, Part</option>
                    <option value="Pulled Up, Beach">Pulled Up, Beach</option>
                    <option value="Pulled Up, Dune">Pulled Up, Dune</option>
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
            <label htmlFor="curvedCarapaceLength">Curved Carapace Length (CCL)</label>
            <input
              type="text"
              className={`form-control ${formErrors.curvedCarapaceLength ? 'is-invalid' : ''}`}
              id="curvedCarapaceLength"
              placeholder="Enter Curved Carapace Length in cm"
              value={formData.curvedCarapaceLength}
              onChange={handleInputChange}
              pattern="\d+(\.\d{1,2})?"  // Allows numbers with up to 2 decimal places
              title="Enter a valid number with up to two decimal places, e.g., 75.25"
              required
            />
              {formErrors.curvedCarapaceLength && <div className="invalid-feedback">{formErrors.curvedCarapaceLength}</div>}
            </div>
                    
            <div className="form-group">
            <label htmlFor="curvedCarapaceLength">Curved Carapace Width (CCW)</label>
            <input
              type="text"
              className={`form-control ${formErrors.curvedCarapaceWidth ? 'is-invalid' : ''}`}
              id="curvedCarapaceWidth"
              placeholder="Enter Curved Carapace Length in cm"
              value={formData.curvedCarapaceWidth}
              onChange={handleInputChange}
              pattern="\d+(\.\d{1,2})?"  // Allows numbers with up to 2 decimal places
              title="Enter a valid number with up to two decimal places, e.g., 75.25"
              required
            />
              {formErrors.curvedCarapaceWidth && <div className="invalid-feedback">{formErrors.curvedCarapaceWidth}</div>}
            </div>

                  <div className="form-group">
                    <label htmlFor="remarks">Remarks</label>
                    <textarea
                      className={`form-control ${formErrors.remark ? 'is-invalid' : ''}`}
                      id="remark"
                      placeholder="Enter any additional notes or observations about the turtle."
                      value={formData.remark}
                      onChange={handleInputChange}
                    />
                    <p className="form-text text-muted small-font">
                      Provide details like involvement with tar or oil, gear or debris entanglement, wounds, or other relevant observations.
                    </p>
                    {formErrors.remark && <div className="invalid-feedback">{formErrors.remark}</div>}
                  </div>


                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>CLOSE</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveClick}>SAVE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedObserversIndex !== null && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={viewModalRef}>
          
              <div className="modal-body">
              <h2 className="modal-title">View Record</h2>
              <h6 className='modal-subtitle'>Review the report details for the observer and stranded pawikan here!</h6> 
              <br></br>
                <p><strong>Observer's Full Name:</strong> {observers[selectedObserversIndex].fullName}</p>
                <p><strong>Stranding Date:</strong> {observers[selectedObserversIndex].date}</p>
                <p><strong>Species:</strong> {observers[selectedObserversIndex].species}</p>
                <p><strong>Turtle Number by Day:</strong> {observers[selectedObserversIndex].noOfTurtle}</p>
                <p><strong>Turtle Sex:</strong> {observers[selectedObserversIndex].sex}</p>
                <p><strong>Location:</strong> {observers[selectedObserversIndex].location}</p>
                <p><strong>Latitude:</strong> {observers[selectedObserversIndex].latitude}</p>
                <p><strong>Longitude:</strong> {observers[selectedObserversIndex].longitude}</p>
                <p><strong>Condition:</strong> {observers[selectedObserversIndex].condition}</p>
                <p><strong>Final Disposition:</strong> {observers[selectedObserversIndex].disposition}</p>
                <p><strong>Tag Number:</strong> {observers[selectedObserversIndex].tagNum}</p>
                <p><strong>Curved Carapace Length (CCL):</strong> {observers[selectedObserversIndex].curvedCarapaceLength}</p>
                <p><strong>Curved Carapace Width (CCW):</strong> {observers[selectedObserversIndex].curvedCarapaceWidth}</p>
                <p><strong>Remarks:</strong> {observers[selectedObserversIndex].remark}</p>

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
          count={observers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};
