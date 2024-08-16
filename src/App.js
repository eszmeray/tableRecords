import './App.css';
import {Table} from "./components/tblUserRecords";
import {Buttons} from "./components/Buttons";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Buttons/>
      <Table />
    </div>
  );
}


export default App;
