import './App.css';
import { FormControl, MenuItem, Select,Card,CardContent } from '@material-ui/core';
import { FormContext } from 'antd/lib/form/context';
import { useEffect, useState } from 'react';
import InfoBox from './InfoBox';
import { light } from '@material-ui/core/styles/createPalette';
import Map from './Map';


function App() {

const [countries, setCountries] = useState([])
const [country, setCountry] = useState("worldwide")
const [countryInfo, setCountryInfo] = useState({})
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
  setCountry(countryCode)

const url =countryCode=="worldwide"?"https://disease.sh/v3/covid-19/all":
                "https://disease.sh/v3/covid-19/countries/".concat(countryCode)

  // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
 
 
  await fetch(url)
 .then(response=> response.json())
 .then(data=>{
//  Storing all the data for country or World-wide.
  setCountryInfo(data)
 })

}
  return (
  <div className="app">

    <div className="app__left">
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
  
      <div className="app__stats">
        <InfoBox title="Coronavirus Cases" cases={50}  total={200}></InfoBox>
  
        <InfoBox title="Recovered" cases={50} total={50}></InfoBox>
        
        <InfoBox title="Deaths" cases={50} total={60}></InfoBox>
      </div>
        <Map></Map>
        
    </div>

     <div className="app_right">
       <Card >
         <CardContent> This is Card Content for cases.</CardContent>
       </Card>
     </div> 

  </div>

  );
}

export default App;
