import React from 'react'
import PropTypes from 'prop-types'
import Test from "./test";
import Button from 'react-bootstrap/Button'
import EasySeeSo from "seeso/easy-seeso";

const max_classify = 4



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
      return <div>
        <Button onClick={this.Calibrate}>
          开始校准
        </Button>
      </div>
    } else {
      return <Test calibration_data={calibration_data} license={license}
                   max_classify={max_classify}
                   max_stimuli_num={5} millisecond_per_stimuli={5000} millisecond_per_sample={100}/>
    }
  }
}

Calibration.propTypes = {
  license: PropTypes.string.required,
}

export default Calibration;
