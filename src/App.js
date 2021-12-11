/**
 * Developer comment:
 * - This file ia the "DEMO" page.
 * - The autocomplete should be exported as a package or part of a UI library (./src/autocomplete).
 */
import Autocomplete from './autocomplete';
import './App.css';
// import axios from 'axios'; // example with fetch
import mock from './mock';

let asyncMock = () => Promise.resolve({data: mock});
// let asyncMock = () => axios.get('http://localhost:3004/names');

function App() {

  let autocompleteStyle = {
    width: 300
  }

  let listStyle = {
    width: 330
  }

  return (
    <div className="app-containers">
        <h1>Example page of autocomplete</h1>
        <Autocomplete
            asyncCall={asyncMock}
            onSubmit={(e,selectedItem) => console.log('submit form!', e,selectedItem)}
            autocompleteStyle={autocompleteStyle}
            listStyle={listStyle}
            inputToRender={(params) => <input type="text"
              {...params}
            />
        }
        />
    </div>
  );
}

export default App;
