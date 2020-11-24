import React, {useState, useEffect} from "react";
import "./App.css";
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import {sortData, prettyPrintStat} from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import Typewriter from 'typewriter-effect';

function App() {

  const [countries,
    setCountries] = useState([])
  const [country,
    setCountry] = useState("worldwide")
  const [countryInfo,
    setCountryInfo] = useState({})
  const [tableData,
    settableData] = useState([])
  const [mapCenter,
    setmapCenter] = useState({lat: 34.80746, lng: -40.4796})
  const [mapZoom,
    setMapZoom] = useState(3)
  const [mapCountries,
    setMapCountries] = useState([])
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

        const sortedData = sortData(data);
        settableData(sortedData);
        setMapCountries(data)
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

        setmapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
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
            total={countryInfo.cases}/>

          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}/>

          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}/>
        </div>
        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}/>

      </div>

      <div className="app_right">
        <Card >
          <CardContent>
            <div className="app__information">
              <h3>
                Live cases by Country
              </h3>
              <Table countries={tableData}></Table>
              <h3>
                Worlwide new cases
              </h3>

            </div>

            <LineGraph/>
          </CardContent>
        </Card>
      </div>

    </div>

  );
}

export default App;
