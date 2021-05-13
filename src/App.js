import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import WeatherDetail from './WeatherDetail';
import WeatherMenu from './WeatherMenu';

const App = () => {
  return(
    <Provider store={store}>
      <Router>
      <Route path="/" exact={true} component={WeatherMenu} />
        <Route path="/WeatherDetail" component={WeatherDetail} />
      </Router>
    </Provider>
  )
}

export default App;