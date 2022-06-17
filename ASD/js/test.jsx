import React from "react";

import EasySeeSo from "seeso/easy-seeso";
import PropTypes from "prop-types";
import "regenerator-runtime/runtime";

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialization_success: false,
      seeso: new EasySeeSo(),
      x: NaN,
      y: NaN,
      x_list: [],
      y_list: [],
    };
    this.onGaze = this.onGaze.bind(this);
    this.afterInitialized = this.afterInitialized.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  componentDidMount() {
    const { license } = this.props;
    const { seeso } = this.state;
    // Don't forget to enter your license key.
    seeso.init(license, this.afterInitialized, this.afterFailed);
  }

  onGaze(gazeInfo) {
    this.setState({
      x: gazeInfo.x,
      y: gazeInfo.y,
    });
  }

  onDebug(FPS, latency_min, latency_max, latency_avg) {}

  afterInitialized() {
    console.log("success");
    const { seeso } = this.state;
    const { calibration_data } = this.props;
    seeso.setMonitorSize(16);
    seeso.setFaceDistance(50);
    seeso.setCameraPosition(window.outerWidth / 2, true);
    console.log(
      `outerWidth=${window.outerWidth}\nouterHeight=${window.outerHeight}`
    );
    seeso.startTracking(this.onGaze, this.onDebug);
    seeso.setCalibrationData(calibration_data);
    this.setState({ initialization_success: true });

    setTimeout(this.saveData, 500);
  }

  afterFailed() {
    console.log("failed");
  }

  saveData() {
    const { data_num } = this.props;
    const real_data_num = parseInt(data_num)
    const { x, y, x_list, y_list } = this.state;
    x_list.push(x / window.outerWidth);
    y_list.push(y / window.outerHeight);
    this.setState({ x_list: x_list, y_list: y_list });

    // recursively call saveData until a specified amount of data have been collected
    if (x_list.length() < real_data_num) {
      setTimeout(this.saveData, 500);
    } else {
      // send data to backend
      fetch("/api/v1/d/", {
        credentials: "same-origin",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ x_data: x_list, y_data: y_list }),
      })
        .then((response) => {
          // console.log(response);
          if (!response.ok) throw Error(response.statusText);
          // TODO: show finish screen
        })
        .catch((error) => console.log(error));
    }
  }

  callCalibrationPage() {
    const { license } = this.props;
    // static function.
    // Because the web page is moved. (https://calibration.seeso.io/#/service)
    EasySeeSo.openCalibrationPage(
      license,
      "YOUR_USER_ID",
      "YOUR_REDIRECT_URL",
      5
    ); // 5 is number of calibration points
  }

  render() {
    const { initialization_success, x, y } = this.state;
    if (initialization_success) {
      return (
        <div>
          <h2>Gaze Information Below</h2>
          <h2>x: {x}</h2>
          <h2>y: {y}</h2>
          <img
            id='red_dot'
            src='/static/images/red_dot.jpg'
            alt='No image'
            style={{ top: y, left: x }}
          />
        </div>
      );
    } else {
      return <div>Initialization failed! Check license!</div>;
    }
  }
}

Test.propTypes = {
  license: PropTypes.string.isRequired,
  calibration_data: PropTypes.string.isRequired,
  data_num: PropTypes.string.isRequired,
};

export default Test;
