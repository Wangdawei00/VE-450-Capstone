import React from 'react'
import PropTypes from 'prop-types'
import EasySeeSo from "seeso/easy-seeso"
import Test from "./test";

class Calibration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // seeso: new EasySeeSo(),
      calibration_data: "",
    }
    this.Calibrate = this.Calibrate.bind(this);
  }

  Calibrate() {
    const {license} = this.props;
    // const {seeso} = this.state;
    const userId = 'wdwdawei@umich.edu'; // ex) 5e9easf293
    const redirectUrl = window.location.href;
    const calibrationPoint = 5;
    EasySeeSo.openCalibrationPage(license, userId, redirectUrl, calibrationPoint);
  }

  componentDidMount() {
    const href = window.location.href
    const decodedURI = decodeURI(href)
    const queryString = decodedURI.split('?')[1];
    if (!queryString) {
      this.setState({calibration_data: ""})
    } else {
      this.setState({
        calibration_data: queryString.slice("calibrationData=".length, queryString.length)
      })
    }
  }

  render() {
    const {license} = this.props;
    const {calibration_data} = this.state;
    if (calibration_data === "") {
      return <div>
        <button onClick={this.Calibrate}>
          Click to Start Calibration and Testing!
        </button>
      </div>
    } else {
      return <Test data_num={50} calibration_data={calibration_data} license={license}/>
    }
  }
}

Calibration.PropTypes = {
  license: PropTypes.string.required,
}

export default Calibration;