import './App.css';
import {FormControl, MenuItem, Select, Card, CardContent} from '@material-ui/core';
import {FormContext} from 'antd/lib/form/context';
import {useEffect, useState} from 'react';
import InfoBox from './InfoBox';
import {light} from '@material-ui/core/styles/createPalette';
import Map from './Map';
import Typewriter from 'typewriter-effect';
import { sortData } from './util';
import Table from './Table'
import LineGraph from './LineGraph';

function App() {

  const [countries,
    setCountries] = useState([])
  const [country,
    setCountry] = useState("worldwide")
  const [countryInfo,
    setCountryInfo] = useState({})
  const [tableData,
    settableData] = useState([])

  // making call to disease API for fetching data for each country.abs
  // https://disease.sh/v3/covid-19/countries
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => setCountryInfo(data));

  }, [])

  useEffect(() => {

    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => ({name: country.country, value: country.countryInfo.iso2}))
        
        const sortedData=sortData(data);
        settableData(sortedData);
        setCountries(countries);
      })

    }
    getCountriesData();

  }, [])
  const onCountryChange = async(event) => {
    const countryCode = event.target.value

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : "https://disease.sh/v3/covid-19/countries/".concat(countryCode)

    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        //  Storing all the data for country or World-wide into countryInfo state.
        setCountry(countryCode)
        setCountryInfo(data)
      })
  }
  return (
    <div className="app">

      <div className="app__left">
        <div className="app_header">
          {/* <iframe width="1024" height="676" src="https://app.developer.here.com/coronavirus/" frameborder="0"></iframe> */}
          <h1>
            <Typewriter
              options={{
              strings: [
                'COVID-19 TRACKER', 'WorldWide', 'Country-Wise'
              ],
              autoStart: true,
              loop: true,
              pauseFor: 400
            }}/>
          </h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              {/* loop through all the countries and show them in the dropdown options. */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}></InfoBox>

          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}></InfoBox>

          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}></InfoBox>
        </div>
        <Map/>

      </div>

      <div className="app_right">
        <Card >
          <CardContent>
            <h3>
              Live cases by Country
            </h3>
            <Table countries={tableData}>

            </Table>
            <h3>
              Worlwide new cases
            </h3>
            <LineGraph/>
          </CardContent>
        </Card>
      </div>

    </div>

  );
}

export default App;
