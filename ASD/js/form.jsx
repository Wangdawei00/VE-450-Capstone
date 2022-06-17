import React from "react";
import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email_state: "",
      email_sent: false,
      email_value: "",
      otp: "",
      password: "",
      confirm_password: "",
    };
    this.onSubmitEmail = this.onSubmitEmail.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeOTP = this.onChangeOTP.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
  }

  onChangeEmail(event) {
    event.preventDefault();
    this.setState({
      email_value: event.target.value,
    });
  }

  onChangeOTP(event) {
    event.preventDefault();
    this.setState({
      otp: event.target.value,
    });
  }

  onChangePassword(event) {
    event.preventDefault();
    this.setState({
      password: event.target.value,
    });
  }

  onChangeConfirmPassword(event) {
    event.preventDefault();
    this.setState({
      confirm_password: event.target.value,
    });
  }

  onSubmitEmail() {
    const {email_value} = this.state;
    fetch("/api/v1/e/", {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email_value,
      }),
    }).then((response) => {
      if (!response.ok) {
        this.setState({
          email_state: "Press the button again to resend the email",
        });
      } else {
        this.setState({
          email_state: "Please check your email for one time password.",
        });
      }
    });
  }

  onSubmitForm() {
    const {email_value, otp, password, confirm_password} = this.state
    if (confirm_password !== password) {
      return
    }
    fetch("/api/v1/r/", {
      credentials: "same-origin",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email_value,
        otp: otp,
        password: password
      })
    }).then((response) => {
      if (response.ok) {
        window.location.replace("/")
      } else {
        alert("One time password invalid")

        window.location.replace("/accounts/reset");
      }
    });
  }

  componentDidMount() {
  }

  render() {
    const {
      email_state,
      email_sent,
      email_value,
      otp,
      password,
      confirm_password,
    } = this.state;
    return (
      <div>
        <p>Email:</p>
        <Form onSubmit={this.onSubmitEmail}>
          <Form.Group>
            <Form.Control type='text' value={email_value} onChange={this.onChangeEmail}/>
          </Form.Group></Form>
        <Button onClick={this.onSubmitEmail}>Send Email</Button>
        <Form onSubmit={this.onSubmitForm}>
          <Form.Group>
            <p>One Time Password:</p>
            <Form.Control type="text" value={otp} onChange={this.onChangeOTP}/>
            <p>New Password:</p>
            <Form.Control type="password" value={password} onChange={this.onChangePassword}/>
            <p>Confirm Password:</p>
            <Form.Control type="password" value={confirm_password} onChange={this.onChangeConfirmPassword}/>
            {password === confirm_password && <p>Password Matched!</p>}
            {password !== confirm_password && <p>Password Not Match!</p>}
          </Form.Group>
        </Form>
        {(password !== confirm_password || password === '') && (
          <Button onClick={this.onSubmitForm} disabled>
            Create/Reset Account
          </Button>
        )}
        {password === confirm_password && password !== '' && (
          <Button onClick={this.onSubmitForm}>Create/Reset Account</Button>
        )}
      </div>
    );
  }
}

export default Forms;
