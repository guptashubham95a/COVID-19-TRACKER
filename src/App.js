import {Card, CardContent, FormControl, MenuItem, Select} from "@material-ui/core";
import {useEffect, useState} from "react";
import InfoBox from "./InfoBox";
import "./App.css";
import Map from "./Map";
import Table from "./Table";
import {prettyPrintStat, sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import Typewriter from 'typewriter-effect';

function App() {
  const [countries,
    setCountries] = useState(["US", "UK"]);
  const [country,
    setCountry] = useState("worldwide");
  const [countryInfo,
    setCountryInfo] = useState({});
  const [tableData,
    setTableData] = useState([]);
  const [casesType,
    setCasesType] = useState("cases");
  const [mapCenter,
    setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom,
    setMapZoom] = useState(2);
  const [mapCountries,
    setMapCountries] = useState([]);

  useEffect(() => {
    const getCountries = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => ({name: country.country, value: country.countryInfo.iso2}));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(sortedData);
        setCountries(countries);
      });
    };

    getCountries();
    onCountryChange({
      target: {
        value: "worldwide"
      }
    });
  }, []);

  const onCountryChange = async(e) => {
    const countryCode = e.target.value;

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url).then((response) => response.json()).then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      if (!data.countryInfo) {
        return;
      }
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(5);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          
          <h1 className={casesType==="cases"?"red":casesType==="recovered"?"green":"orange"}><Typewriter
            options={{
            strings: [
              'COVID-19 TRACKER', 'World-Wide','Country-Wise'
            ],
            autoStart: true,
            loop: true,
            pauseFor:400

          }}/></h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}></InfoBox>
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}></InfoBox>
          <InfoBox
            isOrange
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}></InfoBox>
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}/>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;