import React from "react"

import EasySeeSo from "seeso/easy-seeso";
import PropTypes from "prop-types";
import 'regenerator-runtime/runtime'

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialization_success: false,
      seeso: new EasySeeSo(),
      x: NaN,
      y: NaN
    };
    this.onGaze = this.onGaze.bind(this);
    this.afterInitialized = this.afterInitialized.bind(this);
  }

  componentDidMount() {
    const {license} = this.props;
    const {seeso} = this.state;
    // Don't forget to enter your license key.
    seeso.init(license, this.afterInitialized, this.afterFailed);
  }

  onGaze(gazeInfo) {
    this.setState({
      x: gazeInfo.x,
      y: gazeInfo.y
    })
  }

  onDebug(FPS, latency_min, latency_max, latency_avg) {

  }

  afterInitialized() {
    console.log("success");
    const {seeso} = this.state;
    seeso.setMonitorSize(16);
    seeso.setFaceDistance(50);
    seeso.setCameraPosition(window.outerWidth / 2, true);
    seeso.startTracking(this.onGaze, this.onDebug)
    this.setState({initialization_success: true})
  }

  afterFailed() {
    console.log("failed");
  }


  callCalibrationPage() {
    const {license} = this.props;
    // static function.
    // Because the web page is moved. (https://calibration.seeso.io/#/service)
    EasySeeSo.openCalibrationPage(license, 'YOUR_USER_ID', 'YOUR_REDIRECT_URL', 5); // 5 is number of calibration points
  }

  render() {
    const {initialization_success, x, y} = this.state;
    if (initialization_success) {
      return <div>
        <h2>Gaze Information Below</h2>
        <h2>x: {x}</h2>
        <h2>y: {y}</h2>
        <img id="red_dot" src="/static/images/red_dot.jpg" alt="No image" style={{top: y, left: x}}/>
      </div>
    } else {
      return <div>Initialization failed! Check license!</div>
    }
  }
}

Test.propTypes = {
  license: PropTypes.string.isRequired
};

export default Test;