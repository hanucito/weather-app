import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import './app.css';
import DialogLanding from './pages/landing';
import WeatherView from './pages/weather-view';

class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/weather/forecast/query/:query"
            render={({ match }) => {
              return <WeatherView type='forecast' query={match.params.query}/>
            }}
          />
          <Route path="/weather/forecast/coords/:lat/:lon"
            render={({ match }) => {
              return <WeatherView type='forecast' coords={match.params}/>
            }}
          />
          <Route path="/weather/current/query/:query"
            render={({ match }) => {
              return <WeatherView type='current' query={match.params.query}/>
            }}
          />
          <Route path="/weather/current/coords/:lat/:lon"
            render={({ match }) => {
              return <WeatherView type='current' coords={match.params}/>
            }}
          />
          <Route path="/"
            render={({match}) => (
              <DialogLanding />
            )}
          />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
