import React from "react";
import PropTypes from "prop-types"

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email_sent: false,
      email_value: "",
      otp: "",
      password: "",
      confirm_password: ""
    }
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeOTP = this.onChangeOTP.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this)
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
  }

  onChangeEmail(event) {
    event.preventDefault();
    this.setState({
      email_value: event.target.value
    })
  }

  onChangeOTP(event) {
    event.preventDefault();
    this.setState({
      otp: event.target.value
    })
  }

  onChangePassword(event) {
    event.preventDefault();
    this.setState({
      password: event.target.value
    })
  }

  onChangeConfirmPassword(event) {
    event.preventDefault();
    this.setState({
      confirm_password: event.target.value
    })
  }

  onSubmitEmail() {

  }

  componentDidMount() {
  }

  render() {
    const {email_sent, email_value, otp, password, confirm_password} = this.state;
    return (<div>
      <p>Email:</p>
      <input type="text" value={email_value} onSubmit={this.onSubmitEmail} onChange={this.onChangeEmail}/>
      <button onSubmit={this.onSubmitEmail}>Send Email</button>
      <br/>
      One Time Password:
      <input type="text" value={otp} onChange={this.onChangeOTP}/>
      <br/>
      New Password:
      <input type="password" value={password} onChange={this.onChangePassword}/>
      <br/>
      Confirm New Password
      <input type="password" value={confirm_password} onChange={this.onChangeConfirmPassword}/>
    </div>)
  }
}

export default Forms;