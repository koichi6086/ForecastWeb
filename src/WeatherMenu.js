import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Provider } from 'react-redux';
import store from './store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { updateWeather, updateLocation } from './actions'; 

function DailyItem({item, index, props}){
  return(
    <div style={{margin: 10}}>
      <p style={{marginBottom:10, marginTop: 10}}>Day {index}</p>
      {
        index <= 4 ?
        <Link to="/WeatherDetail" onClick={()=>{props.updateWeather(item)}}>
          <div style={{padding: 10, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} style={{height: 100, width: 100}} />
            <div style={{marginLeft: 5, marginRight: 5}}>
              <p style={{fontWeight: 'bold'}}>{item.temp.max} °F</p>
              <p>{item.weather[0].main}</p>
              <p>{moment.unix(item.dt).format("MMMM DD")}</p>
            </div>
          </div>
        </Link> 
        :
        <div style={{padding: 10, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} style={{height: 100, width: 100}} />
          <div style={{marginLeft: 5, marginRight: 5}}>
            <p style={{fontWeight: 'bold'}}>{item.temp.max} °F</p>
            <p>{item.weather[0].main}</p>
            <p>{moment.unix(item.dt).format("MMMM DD")}</p>
          </div>
        </div>
      }

    </div>
  )
}

const App = (props) => {


  const [available, setAvailable] = useState(false);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(()=>{
    if("geolocation" in navigator)
    {
      setAvailable(true);
      console.log("available")
    }
    else
    {
      setAvailable(false);
      console.log("unavailable")
    }
  }, [])

  useEffect(()=>{
    if(available)
    {
      navigator.geolocation.getCurrentPosition(function(position){
        props.updateLocation({longitude: position.coords.longitude, latitude: position.coords.latitude});
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      })
    }
  }, [available])

  const getData = () => {
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=181c98ab1c1b3dcc7bbea192a5605383`)
    .then((res)=>{
        return setWeatherData(res.data);
    })
    .catch((err)=>{
        return err;
    })
  }

  useEffect(()=>{
    if(longitude !== 0 && latitude !== 0)
    {
      getData();
    }
  }, [longitude])

  return(
      <div>
      {
        weatherData !== null ?
        <div style={{padding: 10, flexDirection: 'row', display: 'flex'}}>
          <div style={{flex: 1, margin: 10}}>
            <h2>Current Weather</h2>
            <div style={{borderWidth: 1, padding: 10, borderStyle: 'outset', flexDirection: 'row', display: 'flex'}}>
              <img src={`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`} style={{height: 100, width: 100}} />
              <div style={{marginTop: 5, marginBottom: 5}}>
                <p style={{fontWeight: 'bold'}}>{weatherData.current.temp} °F</p>
                <p>{weatherData.current.weather[0].main}</p>
                <p>{moment.unix(weatherData.current.dt).format("MMMM DD")}</p>
              </div>
            </div>
          </div>
          <div style={{flex: 1, margin: 10}}>
            <h2>Daily Weather</h2>
            <div>
              {
                weatherData.daily.map((item, index)=>{
                  if(index > 0)
                  return(
                    <DailyItem item={item} index={index} props={props} />
                  )
                  else
                  return null
                })
              }
            </div>
          </div>
        </div>
        :
        <div>
          Please allow location services to continue
        </div>
      }

    </div>
  )
}

function mapStateToProps(state) {
  return {
      weather: state.weather.weather,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
      updateWeather,
      updateLocation
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);