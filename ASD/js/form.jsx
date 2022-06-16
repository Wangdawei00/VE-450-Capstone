import React from "react";
import PropTypes from "prop-types";

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
    const { email_value } = this.state;
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
    const {email_value, otp, password} = this.state
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
    }).then((response)=>{
        if(response.ok){
            window.location.replace("/")
        }else{
            alert("One time password invalid")
            
            window.location.replace("/accounts/reset");
        }
    });
  }

  componentDidMount() {}

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
        <input
          type='text'
          value={email_value}
          onSubmit={this.onSubmitEmail}
          onChange={this.onChangeEmail}
        />
        <button onSubmit={this.onSubmitEmail}>Send Email</button>
        <br />
        <p>{email_state}</p>
        <br />
        One Time Password:
        <input type='text' value={otp} onChange={this.onChangeOTP} />
        <br />
        New Password:
        <input
          type='password'
          value={password}
          onChange={this.onChangePassword}
        />
        <br />
        Confirm New Password
        <input
          type='password'
          value={confirm_password}
          onChange={this.onChangeConfirmPassword}
        />
        {password === confirm_password && <p>Password Matched!</p>}
        {password !== confirm_password && <p>Password Not Match!</p>}
        {password !== confirm_password && (
          <button onClick={this.onSubmitForm} disabled>
            Create/Reset Account
          </button>
        )}
        {password === confirm_password && (
          <button onClick={this.onSubmitForm}>Create/Reset Account</button>
        )}
      </div>
    );
  }
}

export default Forms;
