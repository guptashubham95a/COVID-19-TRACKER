import './App.css';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { FormContext } from 'antd/lib/form/context';


function App() {
  return (
    <div className="App">
    div.app_header
    {/* <iframe width="1024" height="676" src="https://app.developer.here.com/coronavirus/" frameborder="0"></iframe> */}
     <h1>COVID 19 TRACKER</h1>
     <FormControl>
       <Select variant="outlined" value='abc'>
         <MenuItem value="worldwide">1 hey do it</MenuItem>
         <MenuItem value="worldwide">2 ok google</MenuItem>
         <MenuItem value="worldwide">3 dream11</MenuItem>
       </Select>
     </FormControl>
    </div>
  );
}

export default App;
