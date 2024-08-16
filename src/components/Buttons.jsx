import React, { useState, useRef, useEffect } from 'react';
import './styles/tblUserRecords.css';
import { IoIosFunnel, IoIosAdd, IoIosPrint } from "react-icons/io";
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export const Buttons = () => {
  const [filterCriteria, setFilterCriteria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    // Handle search value change
  };

  const handleSearchClick = () => {
    // Handle search button click
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
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

  return (
    <div className="container my-12">
      <div className="row-btn d-flex justify-content-between align-items-center mb-3">
        <h2 className='titleList'>List of Users
          <p className='totalRec'>25 total records</p>
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
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('firstName')}>First Name</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('lastName')}>Last Name</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('role')}>Role</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('password')}>Password</a>
              <a className="dropdown-item" href="#" onClick={() => handleFilterChange('email')}>Email</a>
            </div>
          </div>
          <button className="btn btn-primary" onClick={toggleModal}><IoIosAdd /> NEW RECORD</button>
          <button className="btn btn-primary"><IoIosPrint />Print Records</button>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal-background-blur"></div>
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" ref={modalRef}>
                <div className="modal-header">
                  <h1 className="modal-title">New Record</h1>
                </div>
                <div className="modal-body">
                  <h4 className='modal-subtitle'>User Details</h4>
                  <form>
                    <div className="form-group">
                      <label htmlFor="firstName">First Name</label>
                      <input type="text" className="form-control" id="firstName" placeholder="Enter first name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input type="text" className="form-control" id="lastName" placeholder="Enter last name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="role">Role</label>
                      <select className="form-control" id="role">
                        <option value="">Select role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="manager">Manager</option>
                        <option value="editor">Editor</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input type="password" className="form-control" id="password" placeholder="Enter password" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" className="form-control" id="email" placeholder="Enter email" />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary">ADD</button>
                  <button type="button" className="btn btn-secondary" onClick={toggleModal}>CANCEL</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
