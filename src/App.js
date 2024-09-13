// import './App.css';
// import {Table} from "./tables/tblUserRecords/tblUserRecords";
// import {Buttons} from "./tables/tblUserRecords/Buttons";
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   return (
//     <div className="App">
//       <Buttons/>
//       <Table />
//     </div>
//   );
// }


// export default App;


// import './App.css';
// import { TableProvider } from './tables/tblHatcheryRecords/TableContext'; 
// import { Table } from "./tables/tblHatcheryRecords/tblHatcheryRecords";
// import { Buttons } from "./tables/tblHatcheryRecords/Buttons";
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   return (
//     <TableProvider>
//       <div className="App">
//         <Buttons />
//         <Table />
//       </div>
//     </TableProvider>
//   );
// }


// export default App;



// import './App.css';
// import {Table} from "./tables/tblStranding Records/tblStrandingRecords";
// import {Buttons} from "./tables/tblStranding Records/Buttons";
// import 'bootstrap/dist/css/bootstrap.min.css';

// function App() {
//   return (
//     <div className="App">
//       <Buttons/>
//       <Table />
//     </div>
//   );
// }

// export default App;


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
