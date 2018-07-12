import React from 'react';
import JSONView from 'react-json-view';

import { CircularProgress } from '@material-ui/core';
import { library } from '../context';

class Component extends React.PureComponent {
  state = {
    status: 'idle'
  }
  componentWillMount () {
    this.componentSetProps(this.props);
  }
  componentWillReceiveProps (props) {
    this.componentSetProps(props);
  }
  componentSetProps(props) {
    let fetchStr = `${props.type}:${JSON.stringify(props.coords)}:${props.query}`;

    if (fetchStr !== this.state.fetchStr) {
      this.setState({
        fetchStr,
        status: 'busy'
      }, () => {
        if (props.type === 'current') return library.getWeatherCurrent(props)
          .then(current => {
            this.setState({
              status: 'idle',
              data: current.weather
            })
          })
        if (props.type === 'forecast') return library.getWeatherForecast(props)
          .then(current => {
            this.setState({
              status: 'idle',
              data: current.list
            })
          })
      })
    }
  }
  render () {
    if (this.state.status === 'busy') return (
      <CircularProgress />
    );

    return (
      <JSONView
        enableClipboard={false}
        src={this.state.data}
      />
    )
  }
}

export default Component;