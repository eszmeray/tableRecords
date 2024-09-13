import React, { useState, useRef, useEffect } from 'react';
import './styles/tblHatcheryRecords.css';
import { FaEdit, FaEye } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import TablePagination from '@mui/material/TablePagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useTable } from './TableContext';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const generateRecords = (num) => {
  const date = formatDate(new Date());
  const barangays = ['NC-01', 'NC-02', 'NC-03'];
  const locations = ['Lemery, Batangas'];
  const remarksList = ['Good', 'Moderate', 'Poor'];

  const records = [];

  for (let i = 0; i < num; i++) {
    const date = formatDate(new Date());
    const barangay = barangays[Math.floor(Math.random() * barangays.length)];
    const location = locations[0];
    const noOfEggs = Math.floor(Math.random() * 100) + 1;
    const noOfHatchlingsEmerged = Math.floor(Math.random() * noOfEggs);
    const noOfHatchlingsReleased = Math.floor(Math.random() * noOfHatchlingsEmerged);
    const remarks = remarksList[Math.floor(Math.random() * remarksList.length)];

    records.push({
      date,
      barangay,
      location,
      noOfEggs,
      noOfHatchlingsEmerged,
      noOfHatchlingsReleased,
      remarks
    });
  }

  return records;
};

const initialEggs = generateRecords(500);

export const Table = () => {
  const { eggs, setEggs } = useTable();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEggIndex, setSelectedEggIndex] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    barangay: '',
    location: '',
    noOfEggs: '',
    noOfHatchlingsEmerged: '',
    noOfHatchlingsReleased: '',
    remarks: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);

  const toggleEditModal = (index) => {
    const egg = eggs[index];
    setSelectedEggIndex(index);
    const newFormData = {
      ...egg,
      date: formatDate(new Date(egg.date))
    };
    console.log('Setting form data:', newFormData);
    setFormData(newFormData);
    setShowEditModal(!showEditModal);
  };

  const toggleViewModal = (index) => {
    setSelectedEggIndex(index);
    setFormData(eggs[index]);
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

  const handleSaveClick = () => {
    if (validateForm()) {
      const updatedEggs = [...eggs];
      updatedEggs[selectedEggIndex] = formData;
      setEggs(updatedEggs);
      setSuccessMessage('Data has been updated successfully.');
      setShowEditModal(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (index) => {
    setSelectedRows(prevSelectedRows => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
      return newSelectedRows;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const newSelectedRows = new Set();
      eggs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach((_, index) => {
        newSelectedRows.add(index);
      });
      setSelectedRows(newSelectedRows);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {

    const allRowsSelected = eggs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).every((_, index) => selectedRows.has(index));
    setSelectAll(allRowsSelected);
  }, [selectedRows, page, rowsPerPage, eggs]);

  useEffect(() => {
    setEggs(generateRecords(500));
  }, [setEggs]);


  return (
    <div className="table-container">
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
                  className='form-check-input'
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th>Date Transplanted</th>
              <th>Barangay &<br />Nest Code</th>
              <th>Location</th>
              <th>No. of Eggs<br />Transplanted</th>
              <th>No. of Hatchlings<br />Emerged</th>
              <th>No. of Hatchlings <br />Released</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {eggs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((egg, i) => {
              const index = page * rowsPerPage + i;
              return (
                <tr key={index}>
                  <td>
                  <input
                    className='form-check-input'
                    type="checkbox"
                    checked={selectedRows.has(page * rowsPerPage + index)}
                    onChange={() => handleCheckboxChange(page * rowsPerPage + index)}
                  />
                  </td>
                  <td>{egg.date}</td>
                  <td>{egg.barangay}</td>
                  <td>{egg.location}</td>
                  <td>{egg.noOfEggs}</td>
                  <td>{egg.noOfHatchlingsEmerged}</td>
                  <td>{egg.noOfHatchlingsReleased}</td>
                  <td>{egg.remarks}</td>
                  <td>
                    <span className="actions">
                      <button onClick={() => toggleEditModal(index)} className="action-button edit"><FaEdit />Edit</button>
                      <button onClick={() => toggleViewModal(index)} className="action-button view"><FaEye />View</button>
                      <button className="action-button map"><FaLocationDot />Map</button>

                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>


      {showEditModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={editModalRef}>

              <div className="modal-body">
                <h2 className="modal-title">Edit Record</h2>
                <h6 className='modal-subtitle'>Got changes? Edit the hatchery record to keep it up-to-date</h6>
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

                    {formErrors.date && (
                      <small className="text-danger">{formErrors.date}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="barangay">Barangay & Nest Code</label>
                    <select
                      id="barangay"
                      className={`form-control ${formErrors.barangay ? 'is-invalid' : ''}`}
                      value={formData.barangay}
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
                  </div>


                  <div className="form-group">
                    <label htmlFor="noOfEggs">No. of Eggs Transplanted</label>
                    <input
                      type="number"
                      id="noOfEggs"
                      className={`form-control ${formErrors.noOfEggs ? 'is-invalid' : ''}`}
                      value={formData.noOfEggs}
                      onChange={handleInputChange}
                      placeholder='Enter Number of Eggs'
                      min="0"
                    />
                    {formErrors.noOfEggs && (
                      <small className="text-danger">{formErrors.noOfEggs}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="noOfHatchlingsEmerged">No. of Hatchlings Emerged</label>
                    <input
                      type="number"
                      id="noOfHatchlingsEmerged"
                      className={`form-control ${formErrors.noOfHatchlingsEmerged ? 'is-invalid' : ''}`}
                      value={formData.noOfHatchlingsEmerged}
                      onChange={handleInputChange}
                      placeholder='Enter Number of Hatchlings Emerged'
                      min="0"
                    />
                    {formErrors.noOfHatchlingsEmerged && (
                      <small className="text-danger">{formErrors.noOfHatchlingsEmerged}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="noOfHatchlingsReleased">No. of Hatchlings Released</label>
                    <input
                      type="number"
                      id="noOfHatchlingsReleased"
                      className={`form-control ${formErrors.noOfHatchlingsReleased ? 'is-invalid' : ''}`}
                      value={formData.noOfHatchlingsReleased}
                      onChange={handleInputChange}
                      placeholder='Enter Number of Hatchlings Released'
                      min="0"
                    />
                    {formErrors.noOfHatchlingsReleased && (
                      <small className="text-danger">{formErrors.noOfHatchlingsReleased}</small>
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>CLOSE</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveClick}>SAVE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedEggIndex !== null && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={viewModalRef}>

              <div className="modal-body">
                <h2 className="modal-title">View Record</h2>
                <h6 className='modal-subtitle'>Curious? Explore the details of this hatchery entry</h6>
                <br></br>
                <p><strong>Date Transplanted:</strong> {eggs[selectedEggIndex].date}</p>
                <p><strong>Barangay & Nest Code:</strong> {eggs[selectedEggIndex].barangay}</p>
                <p><strong>Location:</strong> {eggs[selectedEggIndex].location}</p>
                <p><strong>No. of Eggs Transplanted:</strong> {eggs[selectedEggIndex].noOfEggs}</p>
                <p><strong>No. of Hatchlings Emerged:</strong> {eggs[selectedEggIndex].noOfHatchlingsEmerged}</p>
                <p><strong>No. of Hatchlings Released:</strong> {eggs[selectedEggIndex].noOfHatchlingsReleased}</p>
                <p><strong>Remarks:</strong> {eggs[selectedEggIndex].remarks}</p>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>CLOSE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='pagination-container'>
        <TablePagination
          component="div"
          count={eggs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};
