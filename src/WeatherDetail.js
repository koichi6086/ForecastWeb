import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import { Link } from 'react-router-dom';

const App = (props) => {

    const [data, setData] = useState(null);

    const getData = () => {
        axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=60.99&lon=30.9&appid=181c98ab1c1b3dcc7bbea192a5605383`)
        .then((res)=>{
            let temp = [];
            for(let i = 0; i < res.data.list.length; i++)
            {
                if(moment.unix(res.data.list[i].dt).isBetween(moment.unix(props.weather.dt).hour(0).subtract(1, 'days'), moment.unix(props.weather.dt).hour(0).add(1, 'days'), 'day'))
                {
                    temp.push(res.data.list[i]);
                }
            }
            setData(temp);
        })
        .catch((err)=>{
            console.log("err", err)
        })
    }

    useEffect(()=>{
        getData();
    }, [])


    return(
        <div style={{margin: 20}}>
            {
                !_.isEmpty(data) &&
                <>
                <Link to="/">Back to Home</Link>
                <h2>{moment.unix(props.weather.dt).format("MMMM DD")}</h2>
                {
                    data.map((item, index)=>{
                        return(
                            <div style={{borderStyle: 'outset', padding: 5, margin: 10, borderWidth: 1}}>
                                <div style={{flexDirection: 'row', display: 'flex'}}>
                                    <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} style={{height: 100, width: 100}} />
                                    <div style={{margin: 5}}>
                                        <p style={{fontWeight: 'bold'}}>{item.main.temp} °F</p>
                                        <p>{item.weather[0].main}</p>
                                        <p>{moment.unix(item.dt).format("h:mm A")}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </>
            }
        </div>
    )
}

function mapStateToProps(state){
    return{
        location: state.weather.location,
        weather: state.weather.weather
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({

    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);