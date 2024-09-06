import React from 'react';
import { TableProvider } from './tables/tblSurrenderRecords/TableContext'; 
import { Table } from './tables/tblSurrenderRecords/tblSurrenderRecords';
import { Buttons } from './tables/tblSurrenderRecords/Buttons';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <TableProvider>
      <div className="App">
        <Buttons />
        <Table />
      </div>
    </TableProvider>
  );
}

export default App;
