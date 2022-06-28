import React from "react";
import Button from "react-bootstrap/Button";
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
        const { email_value, otp, password, confirm_password } = this.state
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
            <div class="container-row">
                <div class="item-row container-col">
                    <div class="item-col">
                        <p>电子邮箱：</p>
                        <Form onSubmit={this.onSubmitEmail}>
                            <Form.Group>
                                <Form.Control type='email' value={email_value} onChange={this.onChangeEmail} />
                            </Form.Group>
                        </Form>
                    </div>

                    <div class="item-col">
                        <Button onClick={this.onSubmitEmail}>发送邮件</Button>
                    </div>

                    <Form onSubmit={this.onSubmitForm}>
                        <Form.Group>
                            <div class="item-col">
                                <p>一次性密码：</p>
                                <Form.Control type="text" value={otp} onChange={this.onChangeOTP} />
                            </div>

                            <div class="item-col">
                                <p>新密码：</p>
                                <Form.Control type="password" value={password} onChange={this.onChangePassword} />
                            </div>

                            <div class="item-col">
                                <p>确认新密码：</p>
                                <Form.Control type="password" value={confirm_password} onChange={this.onChangeConfirmPassword} />
                            </div>

                            {password === confirm_password && <p>密码匹配成功！</p>}
                            {password !== confirm_password && <p><b>密码不匹配</b></p>}
                        </Form.Group>
                    </Form>

                    {(password !== confirm_password || password === '') && (
                        <Button onClick={this.onSubmitForm} disabled>
                            创建/重设账号
                        </Button>
                    )}

                    {password === confirm_password && password !== '' && (
                        <Button onClick={this.onSubmitForm}>创建/重设账号</Button>
                    )}
                </div>
            </div>
        );
    }
}

export default Forms;
