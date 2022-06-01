import React from "react"

import EasySeeSo from "seeso/easy-seeso";
import PropTypes from "prop-types";
import 'regenerator-runtime/runtime'

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialization_success: false
    };
  }

  componentDidMount() {
    const {license} = this.props;
    const seeso = new EasySeeSo();
    // Don't forget to enter your license key.
    seeso.init(license, this.afterInitialized, this.afterFailed);
  }

  afterInitialized() {
    console.log("success");
  }

  afterFailed() {
    console.log("success");
  }

  render() {
    return <div>Testing... Checkout the console (Ctrl + Shift + I)</div>
  }
}

Test.propTypes = {
  license: PropTypes.string.isRequired
}

export default Test;