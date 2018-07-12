import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import LocationSelector from '../components/location-selector';
import { history } from '../context';

class Component extends React.PureComponent {
  render () {
    return (
      <Dialog open={true}>
        <DialogTitle>Weather Flow</DialogTitle>
        <DialogContent>
          <LocationSelector onSet={(value) => {
            if (value.mode === 'query') return history.push(`/weather/current/query/${value.query}`)
            if (value.mode === 'coords') return history.push(`/weather/current/coords/${value.coords.lat}/${value.coords.lon}`)
          }}/>
        </DialogContent>
      </Dialog>
    )
  }
}

export default Component;