import React, { useState, useRef, useEffect } from 'react';
import './styles/tblSurrenderRecords.css';
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
const generateSurrenderers = (num) => {
  const barangays = ['Anak Dagat', 'Maguihan', 'Mataas na Bayan', 'Maligaya', 'Nonong Casto', 'Sambal Ibaba', 'Sambal Ilaya', 'Wawa Ibaba', 'Wawa Ilaya'];
  const firstNames = ['Elena', 'Patricia', 'Roberto', 'Alejandro', 'Jessica', 'Michael', 'Linda', 'James', 'Emily', 'Daniel', 'Samantha', 'David', 'Sophia', 'William', 'Olivia'];
  const lastNames = ['Rodriguez', 'Castro', 'Perez', 'Morales', 'Smith', 'Johnson', 'Lee', 'Brown', 'Davis', 'Wilson', 'Miller', 'Garcia', 'Martinez', 'Rodriguez', 'Harris'];
  const surrenderers = [];

  for (let i = 0; i < num; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const barangay = barangays[Math.floor(Math.random() * barangays.length)];
    const date = formatDate(new Date());
    const noOfEggs = Math.floor(Math.random() * 100) + 1;

    surrenderers.push({
      firstName,
      lastName,
      barangay,
      date,
      noOfEggs
    });
  }
   
  return surrenderers;
};

const initialSurrenderers = generateSurrenderers(500);

export const Table = () => {
  const [surrenderers, setSurrenderers] = useState(initialSurrenderers);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSurrenderersIndex, setSelectedSurrenderersIndex] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    barangay: '',
    date: '',
    noOfEggs: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);
  
  const toggleEditModal = (index) => {
    const globalIndex = page * rowsPerPage + index; 
    const selectedSurrenderer = surrenderers[globalIndex];
    
    setSelectedSurrenderersIndex(globalIndex);
    setFormData({
      firstName: selectedSurrenderer.firstName,
      lastName: selectedSurrenderer.lastName,
      barangay: selectedSurrenderer.barangay,
      date: selectedSurrenderer.date,
      noOfEggs: selectedSurrenderer.noOfEggs,
    });
    setShowEditModal(!showEditModal);
  };
  
  const toggleViewModal = (index) => {
    const globalIndex = page * rowsPerPage + index; 
    
    setSelectedSurrenderersIndex(globalIndex);
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
    }
    if (formData.noOfEggs === '' || formData.noOfEggs < 0) {
      errors.noOfEggs = 'Number of Eggs is required and must be 0 or greater';
    }
  
    setFormErrors(errors);
  
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveClick = () => {
    if (validateForm()) {
      const updatedSurrenderers = [...surrenderers];
      updatedSurrenderers[selectedSurrenderersIndex] = {
        ...formData,
      };
      setSurrenderers(updatedSurrenderers);
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
      surrenderers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).forEach((_, index) => {
        newSelectedRows.add(index);
      });
      setSelectedRows(newSelectedRows);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const allRowsSelected = surrenderers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).every((_, index) => selectedRows.has(index));
    setSelectAll(allRowsSelected);
  }, [selectedRows, page, rowsPerPage, surrenderers]);

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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Barangay</th>
              <th>Date Surrender</th>
              <th>No. Of Eggs</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {surrenderers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((surrenderer, index) => (
    <tr key={index}>
      <td>
        <input
          type="checkbox"
          checked={selectedRows.has(page * rowsPerPage + index)}
          onChange={() => handleCheckboxChange(page * rowsPerPage + index)}
        />
      </td>
      <td>{surrenderer.firstName}</td>
      <td>{surrenderer.lastName}</td>
      <td>{surrenderer.barangay}</td>
      <td>{surrenderer.date}</td>
      <td>{surrenderer.noOfEggs}</td>
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
                <h6 className='modal-subtitle'>Updating information? Enter the new details here</h6>
                <br></br>          
                      <form>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>CLOSE</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveClick}>SAVE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedSurrenderersIndex !== null && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" ref={viewModalRef}>
          
              <div className="modal-body">
              <h2 className="modal-title">View Record</h2>
              <h6 className='modal-subtitle'>Want to review this surrenderer? Check out their details here</h6> 
              <br></br>
                <p><strong>First Name:</strong> {surrenderers[selectedSurrenderersIndex].firstName}</p>
                <p><strong>Last Name:</strong> {surrenderers[selectedSurrenderersIndex].lastName}</p>
                <p><strong>Barangay:</strong> {surrenderers[selectedSurrenderersIndex].barangay}</p>
                <p><strong>Date Surrender:</strong> {surrenderers[selectedSurrenderersIndex].date}</p>
                <p><strong>No. Of Eggs Surrendered:</strong> {surrenderers[selectedSurrenderersIndex].noOfEggs}</p>
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
          count={surrenderers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};
