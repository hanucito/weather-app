import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import WeatherCurrent from '../components/weather-view';
import { history } from '../context';

class Component extends React.PureComponent {
  render () {
    let { type, coords, query } = this.props;
    let typeSwitch = type === 'current' ? 'forecast' : 'current';
    return (
      <Dialog open={true}>
        <DialogTitle>
          Weather / {type.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          <WeatherCurrent
            coords={coords}
            query={query}
            type={type}
          />

        </DialogContent>
        <DialogActions>
          {coords && (
            <Button variant="contained" color="primary" onClick={ev => history.push(`/weather/${typeSwitch}/coords/${coords.lat}/${coords.lon}`)}>
              {typeSwitch}
            </Button>
          )}
          {query && (
            <Button variant="contained" color="primary" onClick={ev => history.push(`/weather/${typeSwitch}/query/${query}`)}>
              {typeSwitch}
            </Button>
          )}
          <Button variant="contained" color="secondary" onClick={ev => history.push('/')}>
            Back
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default Component;