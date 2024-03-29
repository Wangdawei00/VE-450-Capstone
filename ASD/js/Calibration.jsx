import React from 'react'
import Button from 'react-bootstrap/Button'
import EasySeeSo from "seeso/easy-seeso";
import Test from "./test";
import PropTypes from "prop-types";

const max_classify = 2

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
      return <div class="container-row">
        <div class="item-row">
          <Button onClick={this.Calibrate}>
            开始校准 (Start Calibration)
          </Button>
        </div>
        <div class="item-row">
          <Button onClick={() => {
            window.location.replace('/manual/')
          }}> 帮助(Help Manual)</Button>
        </div>
      </div>
    } else {
      return <Test calibration_data={calibration_data} license={license}
                   max_classify={max_classify}
                   max_stimuli_num={10} millisecond_per_stimuli={5000} millisecond_per_sample={100}/>
    }
  }
}

Calibration.propTypes = {
  license: PropTypes.string.required,
}

export default Calibration;
