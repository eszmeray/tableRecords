import React, { createContext, useState, useContext } from 'react';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const [eggs, setEggs] = useState([]);

  return (
    <TableContext.Provider value={{ eggs, setEggs}}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
