import './App.css';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { FormContext } from 'antd/lib/form/context';
import { useEffect, useState } from 'react';


function App() {

  const [countries, setCountries] = useState([])

const [country, setCountry] = useState("worldwide")

// making call to disease API for fetching data for each country.abs
// https://disease.sh/v3/covid-19/countries
useEffect(() => {

  const getCountriesData= async ()=>{
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response)=>
        response.json()
      ).then((data)=>{
        const countries=data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2,
        }))
        setCountries(countries);
      })
  
    }
  getCountriesData();

}, [])
const onCountryChange=async (event)=>{
  const countryCode=event.target.value
  console.log(countryCode)
  setCountry(countryCode)
}
  return (
    <div className="App">
    <div className="app_header">
    {/* <iframe width="1024" height="676" src="https://app.developer.here.com/coronavirus/" frameborder="0"></iframe> */}
     <h1>COVID 19 TRACKER</h1>
     <FormControl className="app__dropdown">
       <Select variant="outlined" value={country} onChange={onCountryChange}>
      {/* loop through all the countries and show them in the dropdown options. */}
      <MenuItem value="worldwide">Worldwide</MenuItem>
      {
        countries.map((country)=> (
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))
      }
       </Select>
     </FormControl>
     </div>
    </div>
  );
}

export default App;
