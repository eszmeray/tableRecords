import React, { useState, useRef, useEffect } from 'react';
import './styles/tblHatcheryRecords.css';
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


const generateRecords = (num) => {
  const islands = ['Island 1', 'Island 2', 'Island 3'];
  const barangays = ['Anak Dagat', 'Maguihan', 'Mataas na Bayan', 'Maligaya', 'Nonong Casto', 'Sambal Ibaba', 'Sambal Ilaya', 'Wawa Ibaba', 'Wawa Ilaya'];
  const municipalities = ['Lemery'];
  const provinces = ['Batangas'];
  const date = formatDate(new Date());
  const nestCodes = ['NC1', 'NC2', 'NC3'];
  const remarksList = ['Good', 'Moderate', 'Poor'];

  const records = [];

  for (let i = 0; i < num; i++) {
    const island = islands[Math.floor(Math.random() * islands.length)];
    const barangay = barangays[Math.floor(Math.random() * barangays.length)];
    const municipality = municipalities[0];
    const province = provinces[0];
    const nestCode = nestCodes[Math.floor(Math.random() * nestCodes.length)];
    const noOfEggs = Math.floor(Math.random() * 100) + 1;
    const noOfHatchlingsEmerged = Math.floor(Math.random() * noOfEggs);
    const noOfHatchlingsReleased = Math.floor(Math.random() * noOfHatchlingsEmerged);
    const remarks = remarksList[Math.floor(Math.random() * remarksList.length)];
    const date = formatDate(new Date());

    records.push({
      island,
      barangay,
      municipality,
      province,
      date,
      nestCode,
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
  const [eggs, setEggs] = useState(initialEggs);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEggIndex, setSelectedEggIndex] = useState(null);
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

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const editModalRef = useRef(null);
  const viewModalRef = useRef(null);

  const toggleEditModal = (originalIndex) => {
    const egg = eggs[originalIndex];
    setSelectedEggIndex(originalIndex);
    const newFormData = {
      ...egg,
      date: formatDate(new Date(egg.date)) 
    };
    console.log('Setting form data:', newFormData); 
    setFormData(newFormData);
    setShowEditModal(!showEditModal);
  };
  
  const toggleViewModal = (originalIndex) => {
    setSelectedEggIndex(originalIndex);
    setFormData(eggs[originalIndex]);
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
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: id === 'date' ? value : value, 
    }));
  };
  
  const validateForm = () => {
    const errors = {};

    if (!formData.island) errors.island = 'Island/Sitio is required';
    if (!formData.barangay) errors.barangay = 'Barangay is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.nestCode) errors.nestCode = 'Nest Code is required';
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
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </th>
              <th>Island/Sitio</th>
              <th>Barangay</th>
              <th>Municipality</th>
              <th>Province</th>
              <th>Date</th>
              <th>Nest Code</th>
              <th>No. of Eggs<br />Transplanted</th>
              <th>No. of Hatchlings<br />Emerged</th>
              <th>No. of Hatchlings <br />Released</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {eggs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((egg, i) => {
    const originalIndex = page * rowsPerPage + i;
    return (
      <tr key={originalIndex}>
        <td>
          <input
            type="checkbox"
            checked={selectedRows.has(originalIndex)}
            onChange={() => handleCheckboxChange(originalIndex)}
          />
        </td>
        <td>{egg.island}</td>
        <td>{egg.barangay}</td>
        <td>{egg.municipality}</td>
        <td>{egg.province}</td>
        <td>{egg.date}</td>
        <td>{egg.nestCode}</td>
        <td>{egg.noOfEggs}</td>
        <td>{egg.noOfHatchlingsEmerged}</td>
        <td>{egg.noOfHatchlingsReleased}</td>
        <td>{egg.remarks}</td>
        <td>
          <span className="actions">
            <button onClick={() => toggleEditModal(originalIndex)} className="action-button edit"><FaEdit />Edit</button>
            <button onClick={() => toggleViewModal(originalIndex)} className="action-button view"><FaEye />View</button>
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
                    <label htmlFor="island">Island/Sitio</label>
                    <select
                      id="island"
                      className="form-control"
                      value={formData.island}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Island/Sitio</option>
                      <option value="Island 1">Island 1</option>
                      <option value="Island 2">Island 2</option>
                      <option value="Island 3">Island 3</option>
                    </select>
                    {formErrors.island && (
                      <small className="text-danger">{formErrors.island}</small>
                    )}
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
                  </div>

                  <div className="form-group">
                  <input
                      type="text"
                      className={`form-control read-only-field ${formErrors.province ? 'is-invalid' : ''}`}
                      id="province"
                      placeholder="Batangas"
                      value={formData.province}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      className="form-control"
                      value={formData.date}
                      placeholder="YYYY-MM-DD"
                      onChange={handleInputChange}
                    />

                    {formErrors.date && (
                      <small className="text-danger">{formErrors.date}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="nestCode">Nest Code</label>
                      <select
                        id="nestCode"
                        className="form-control"
                        value={formData.nestCode}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Nest Code</option>
                        <option value="NC1">NC1</option>
                        <option value="NC2">NC2</option>
                        <option value="NC3">NC3</option>
                      </select>
                    
                    {formErrors.nestCode && (
                        <small className="text-danger">{formErrors.nestCode}</small>
                        )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="noOfEggs">No. of Eggs Transplanted</label>
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

                  <div className="form-group">
                    <label htmlFor="noOfHatchlingsEmerged">No. of Hatchlings Emerged</label>
                    <input
                      type="number"
                      id="noOfHatchlingsEmerged"
                      className="form-control"
                      value={formData.noOfHatchlingsEmerged}
                      onChange={handleInputChange}
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
                      className="form-control"
                      value={formData.noOfHatchlingsReleased}
                      onChange={handleInputChange}
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
                        placeholder="Enter remarks"
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
                <p><strong>Island/Sitio:</strong> {eggs[selectedEggIndex].island}</p>
                <p><strong>Barangay:</strong> {eggs[selectedEggIndex].barangay}</p>
                <p><strong>Municipality:</strong> {eggs[selectedEggIndex].municipality}</p>
                <p><strong>Province:</strong> {eggs[selectedEggIndex].province}</p>
                <p><strong>Date:</strong> {eggs[selectedEggIndex].date}</p>
                <p><strong>Nest Code:</strong> {eggs[selectedEggIndex].nestCode}</p>
                <p><strong>No. of Eggs Transplanted:</strong> {eggs[selectedEggIndex].noOfEggs}</p>
                <p><strong>No. of Hatchlings Emerged</strong> {eggs[selectedEggIndex].noOfHatchlingsEmerged}</p>
                <p><strong>No. of Hatchlings Released</strong> {eggs[selectedEggIndex].noOfHatchlingsReleased}</p>

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
