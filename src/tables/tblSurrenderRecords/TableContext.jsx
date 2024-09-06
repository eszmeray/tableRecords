// TableContext.jsx
import React, { createContext, useState, useContext } from 'react';

const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const [surrenderers, setSurrenderers] = useState([]);

  return (
    <TableContext.Provider value={{ surrenderers, setSurrenderers }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
