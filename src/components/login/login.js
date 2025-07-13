import React from "react";
import { Row, Col } from "react-bootstrap";
import LoginForm from "./loginForm";
import "./login.scss";

//login page 

function Login() {
  return (
    <div className="SignSection">
      <Row className="justify-content-md-center">
        <Col lg={5} md={12} sm={12} xs={12}>
          <div className="login_form">
            <h2> Welcome Back!</h2>
            <p>log into your account, please enter your details.</p>
            <LoginForm />
          </div>
        </Col>
        <Col lg={7} md={12} sm={12} xs={12} className="d-none d-md-block">
          <div className="login_img_bg sign-img_bg ">
            <img src="images/login_bg_img.png" alt="wasla_login_img" />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
