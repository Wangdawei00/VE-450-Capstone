import React from "react";

import EasySeeSo from "seeso/easy-seeso";
import PropTypes from "prop-types";
import "regenerator-runtime/runtime";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Test extends React.Component {
  constructor(props) {
    super(props);
    const {max_classify} = this.props
    this.state = {
      initialization_success: false,
      name: '',
      classify: getRandomInt(max_classify),
      seeso: new EasySeeSo(),
      x: NaN,
      y: NaN,
      x_list: [],
      y_list: [],
      stimuli_num: -1,
      // cameraTop: true,
      times_to_call_saveData: 0,
      finished: false,
      finished_uploading: false,
      type: -1//0 for non-asd, 1 for asd, 2 for unknown, -1 for no selection
      // full_screen: false
    };
    this.onChange = this.onChange.bind(this);
    this.onGaze = this.onGaze.bind(this);
    this.afterInitialized = this.afterInitialized.bind(this);
    this.saveData = this.saveData.bind(this);
    this.fullScreen = this.fullScreen.bind(this)
    this.startTesting = this.startTesting.bind(this);
  }

  componentDidMount() {

    const {license} = this.props;
    const {seeso} = this.state;
    // Don't forget to enter your license key.
    seeso.init(license, this.afterInitialized, this.afterFailed);
  }

  onGaze(gazeInfo) {
    this.setState({
      x: gazeInfo.x, y: gazeInfo.y,
    });
  }

  onDebug(FPS, latency_min, latency_max, latency_avg) {
  }

  afterInitialized() {
    console.log("success");
    const {seeso} = this.state;
    const {calibration_data} = this.props;
    seeso.setMonitorSize(16);
    seeso.setFaceDistance(50);
    seeso.setCameraPosition(window.outerWidth / 2, true);
    // console.log(`outerWidth=${window.outerWidth}\nouterHeight=${window.outerHeight}`);
    seeso.setCalibrationData(calibration_data);
    seeso.startTracking(this.onGaze, this.onDebug);
    this.setState({initialization_success: true});

    // setTimeout(this.saveData, 500);
  }

  afterFailed() {
    console.log("failed");
  }

  saveData() {
    const {max_stimuli_num, millisecond_per_sample, millisecond_per_stimuli} = this.props;
    const {x, y, x_list, y_list, name, classify, stimuli_num, times_to_call_saveData, type} = this.state;
    this.setState({
      times_to_call_saveData: times_to_call_saveData + 1
    })
    // console.log(`times_to_call_saveData: ${times_to_call_saveData + 1}`)
    if (times_to_call_saveData >= (stimuli_num + 1) * millisecond_per_stimuli / millisecond_per_sample) {
      this.setState({
        stimuli_num: stimuli_num + 1
      })
      // console.log(`stimuli_num: ${stimuli_num + 1}`)
    }
    console.log(`stimuli_num: ${stimuli_num}`)
    console.log(`max_stimuli_num: ${max_stimuli_num}`)
    if (stimuli_num >= max_stimuli_num) {
      this.setState({
        finished: true
      })
    }
    if (!isNaN(x) && !isNaN(y)) {
      x_list.push(x / window.outerWidth);
      y_list.push(y / window.outerHeight);
      this.setState({x_list: x_list, y_list: y_list});
    }
    const data_num = max_stimuli_num * millisecond_per_stimuli / millisecond_per_sample;
    // recursively call saveData until a specified amount of data have been collected
    if (x_list.length < data_num) {
      setTimeout(this.saveData, millisecond_per_sample);
    } else if (x_list.length === data_num) {
      // send data to backend
      console.log(x_list)
      fetch("/api/v1/d/", {
        credentials: "same-origin", method: "POST", headers: {
          "Content-Type": "application/json",
        }, body: JSON.stringify({x_data: x_list, y_data: y_list, name: name, classify: classify, type: type}),
      })
        .then((response) => {
          // console.log(response);
          if (!response.ok) throw Error(response.statusText);
          this.setState({finished_uploading: true})
        })
        .catch((error) => console.log(error));
    }

  }

  startTesting() {
    const {name, type} = this.state;
    if (name === '') {
      alert('姓名不能为空！')
      return
    }
    if (type === -1) {
      alert("请选择孩子是否患有ASD")
      return
    }
    setTimeout(this.saveData, 0)
  }

  onChange(event) {
    event.preventDefault();
    const name = event.target.value;
    this.setState({
      name: name
    })
  }

  fullScreen() {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
  }

  render() {
    const {stimuli_num, name, finished, finished_uploading, classify, type} = this.state;
    const {max_stimuli_num} = this.props

    return <div>
      {stimuli_num === -1 &&
        <div class="container-row">
          <div class="container-col">
            <div class="item-col">
              {!document.fullscreenElement && stimuli_num === -1 &&
                < Button onClick={this.fullScreen}>进入全屏（推荐）</Button>}
            </div>

            {stimuli_num === -1 &&
              <div>
                <Form>
                  <Form.Group>
                    <div class="item-col">
                      <h2>请输入孩子的姓名：</h2>
                    </div>

                    <div class="item-col">
                      <Form.Control type="text" value={name} onChange={this.onChange}/>
                    </div>
                  </Form.Group>
                </Form>

                <div class="item-col container-row">
                  <Dropdown class="item-col">
                    <Dropdown.Toggle variant="success">
                      {type === -1 && "请选择"}
                      {type === 0 && "确认不患有ASD"}
                      {type === 1 && "确认患有ASD"}
                      {type === 2 && "未知"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onSelect={() => this.setState({type: 0})}>
                        确认不患有ASD
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => this.setState({type: 1})}>
                        确认患有ASD
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => this.setState({type: 2})}>
                        未知
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div class="item-col container-row">
                  <Button class="item-row" onClick={this.startTesting}>开始测试</Button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      {!finished && stimuli_num >= 0 &&
        <div class="container-col screen-center black-background">
          <div class="item-col container-row screen-center">
            <img class="item-row"
                 src={`/static/images/grouping/group_${stimuli_num + classify * max_stimuli_num}/1.jpg`}
                 alt="no image"/>

            <img class="item-row"
                 src={`/static/images/grouping/group_${stimuli_num + classify * max_stimuli_num}/2.jpg`}
                 alt="no image"/>
          </div>
        </div>
      }

      {finished && !finished_uploading &&
        <div class="container-row">
          <div class="item-row">
            完成测试，等待上传数据。。。
          </div>
        </div>
      }

      {finished && finished_uploading &&
        <div class="container-row">
          <div class="container-col">
            <p>上传成功！</p>
            <Button onClick={() => {
              window.location.replace('/')
            }
            }>继续测试
            </Button>
          </div>
        </div>
      }

    </div>
  }
}

Test.propTypes = {
  license: PropTypes.string.isRequired,
  calibration_data: PropTypes.string.isRequired,
  // data_num: PropTypes.number.isRequired,
  millisecond_per_stimuli: PropTypes.number.isRequired,
  millisecond_per_sample: PropTypes.number.isRequired,
  max_classify: PropTypes.number.isRequired,
  max_stimuli_num: PropTypes.number.isRequired
};

export default Test;
