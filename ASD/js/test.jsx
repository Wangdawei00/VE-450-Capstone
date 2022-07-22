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
      flipped: getRandomInt(2),
      flipped_list: [],
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
      type: -1, //0 for non-asd, 1 for asd, 2 for unknown, -1 for no selection
      // full_screen: false
      show_gray_img: false,
      gray_count: 0,
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
    // seeso.setMonitorSize(16);
    // seeso.setFaceDistance(50);
    // seeso.setCameraPosition(window.outerWidth / 2, true);
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
    const {
      flipped_list,
      x,
      y,
      x_list,
      y_list,
      name,
      classify,
      stimuli_num,
      times_to_call_saveData,
      type,
      show_gray_img,
      gray_count
    } = this.state;
    // console.log(`times_to_call_saveData: ${times_to_call_saveData + 1}`)
    if (times_to_call_saveData >= (stimuli_num + 1) * millisecond_per_stimuli / millisecond_per_sample) {
      const temp = getRandomInt(2);
      flipped_list.push(temp);
      this.setState({
        flipped: temp,
        flipped_list: flipped_list,
        stimuli_num: stimuli_num + 1,
        show_gray_img: true,
        gray_count: 0,
      })
      // console.log(`stimuli_num: ${stimuli_num + 1}`)
    }
    if (show_gray_img) {
      this.setState({
        gray_count: gray_count + 1,
      })
    }
    if (gray_count === 5) {
      this.setState({
        gray_count: 0,
        show_gray_img: false,
      })
    }
    if (!show_gray_img) {
      this.setState({
        times_to_call_saveData: times_to_call_saveData + 1
      })
      if (isNaN(x)) {
        x_list.push(-1000)
      } else {
        x_list.push(x / window.innerWidth);
      }
      if (isNaN(y)) {
        y_list.push(-1000)
      } else {
        y_list.push(y / window.innerHeight);
      }
      this.setState({x_list: x_list, y_list: y_list});
      console.log(`length: ${x_list.length}`)
    }
    const data_num = max_stimuli_num * millisecond_per_stimuli / millisecond_per_sample;
    // recursively call saveData until a specified amount of data have been collected
    if (x_list.length < data_num) {
      setTimeout(this.saveData, millisecond_per_sample);
    } else if (x_list.length === data_num) {
      this.setState({
        finished: true
      })
      // send data to backend
      console.log(x_list)
      fetch("/api/v1/d/", {
        credentials: "same-origin",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x_data: x_list,
          y_data: y_list,
          name: name,
          classify: classify,
          type: type,
          flipped_list: flipped_list
        }),
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
      alert('姓名不能为空！(Name cannot be empty!)')
      return
    }
    if (type === -1) {
      alert("请选择孩子是否患有ASD (Please select the child's ASD status)")
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
    const {stimuli_num, name, finished, finished_uploading, classify, type, show_gray_img, flipped} = this.state;
    const {max_stimuli_num} = this.props

    return <div>
      {stimuli_num === -1 &&
        <div class="container-row">
          <div class="container-col">
            <div class="item-col">
              {!document.fullscreenElement && stimuli_num === -1 &&
                < Button onClick={this.fullScreen}>进入全屏（推荐）(Fullscreen recommended)</Button>}
            </div>

            {stimuli_num === -1 &&
              <div>
                <Form>
                  <Form.Group>
                    <div class="item-col">
                      <h2>请输入孩子的姓名：(Please input the child's name)</h2>
                    </div>

                    <div class="item-col">
                      <Form.Control type="text" value={name} onChange={this.onChange}/>
                    </div>
                  </Form.Group>
                </Form>

                <div class="item-col container-row">
                  <Dropdown class="item-col">
                    <Dropdown.Toggle variant="success">
                      {type === -1 && "请选择 (Select)"}
                      {type === 0 && "确认不患有ASD (ASD Negative)"}
                      {type === 1 && "确认患有ASD (ASD Positive)"}
                      {type === 2 && "未知 (Unknown)"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onSelect={() => this.setState({type: 0})}>
                        确认不患有ASD (ASD Negative)
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => this.setState({type: 1})}>
                        确认患有ASD (ASD Positive)
                      </Dropdown.Item>
                      <Dropdown.Item onSelect={() => this.setState({type: 2})}>
                        未知 (Unknown)
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div class="item-col container-row">
                  <Button class="item-row" onClick={this.startTesting}>开始测试 (Start Testing)</Button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      {!finished && stimuli_num >= 0 && !show_gray_img &&
        <div class="container-col screen-center black-background">
          <div class="item-col container-row screen-center">
            <img class="item-row"
                 src={`/static/images/grouping/group_${stimuli_num + classify * max_stimuli_num}/${flipped ? 2 : 1}.jpg`}
                 alt="no image"/>

            <img class="item-row"
                 src={`/static/images/grouping/group_${stimuli_num + classify * max_stimuli_num}/${flipped ? 1 : 2}.jpg`}
                 alt="no image"/>
          </div>
        </div>
      }

      {!finished && stimuli_num >= 0 && show_gray_img &&
        <div class="container-col screen-center black-background">
          <div class="item-col container-row screen-center">
            <img class="item-row"
                 src={`/static/images/gray.png`}
                 alt="no image"/>

            <img class="item-row"
                 src={`/static/images/gray.png`}
                 alt="no image"/>
          </div>
        </div>
      }


      {finished && !finished_uploading &&
        <div class="container-row">
          <div class="item-row">
            完成测试，等待上传数据。。。(Test finished. Waiting to upload data)
          </div>
        </div>
      }

      {finished && finished_uploading &&
        <div class="container-row">
          <div class="container-col">
            <p>上传成功！(Upload successfully)</p>
            <Button onClick={() => {
              window.location.replace('/')
            }
            }>继续测试 (Continue testing)
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
