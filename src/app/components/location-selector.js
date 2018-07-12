import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { library } from '../context';

class Component extends React.PureComponent {
  state = {
    query: '',
    mode: 'query',
    position: undefined
  }
  handleFromIP = ev => {
    library.getLocationFromIP()
      .then(location => {
        this.props.onSet && this.props.onSet({
          mode: 'coords',
          coords: {
            lat: location.lat,
            lon: location.lon
          }
        })
      });
  }
  handleSubmit = ev => {
    let { query, mode, position } = this.state;
    ev.preventDefault();
    this.props.onSet && this.props.onSet({
      mode,
      coords: {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      },
      query
    })
  }
  componentWillMount () {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          mode: 'coords',
          position
        })
      });
    }
  }
  render () {
    let { query, mode } = this.state;
    return (
      <form className='location-selector' onSubmit={this.handleSubmit}>
        <TextField 
          name="query"
          placeholder={(() => {
            if (mode === 'coords') return '(Your location)';
            return 'Location...';
          })()}
          value={query}
          onChange={ev => this.setState({
            query: ev.target.value,
            mode: 'query'
          })}
        />
        <Button variant="contained" color="primary" onClick={this.handleSubmit}>
          Search
        </Button>
        <Button variant="contained" color="secondary" onClick={this.handleFromIP}>
          from IP
        </Button>
      </form>
    )
  }
}

export default Component;