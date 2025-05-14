import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoginUser } from "../../slices/LoginSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../shared/popup/PopUp";

//normal login form

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validated, setvalidated] = useState(false);
  const [errorsLst, seterrorsLst] = useState({});
  const [formData, setformData] = useState({ email: "", password: "" });
  const { User, loading, errors } = useSelector((state) => state.login);
  const [showAlert, setShowAlert] = useState(false);

  //validate form inputs
  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(formData.email) || formData.email.trim() == "") {
      seterrorsLst({
        ...errorsLst,
        email: "Please enter a valid email address.",
      });
      return false;
    }
    if (formData.password.trim() == "" || formData.password.length < 6) {
      seterrorsLst({
        ...errorsLst,
        password: "Password must be at least 6 characters long.",
      });
      return false;
    }
    return true;
  };
  const closeAlert = () => {
    setShowAlert(false);
  };
  const signin = (event) => {
    event.preventDefault();
    if (validate()) {
      formData["lang"] = "en";
      dispatch(LoginUser(formData)).then((result) => {
        if (result.payload && result.payload.isSuccessed) {
          setShowAlert(false);
          navigate("/");
        } else {
          setShowAlert(true);
        }
      });
    }
  };
  const fillFormData = (e) => {
    setvalidated(false);
    seterrorsLst({});
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Form onSubmit={signin} noValidate>
      <Form.Group className="mb-3">
        <Form.Label className="formLabel">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          required
          name="email"
          className="formInput"
          onChange={fillFormData}
        />
        {errorsLst.email && (
          <Form.Text type="invalid" className="errorTxt">
            {errorsLst.email}
          </Form.Text>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="formLabel">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          required
          name="password"
          className="formInput"
          minLength={6}
          onChange={fillFormData}
        />
        {errorsLst.password && (
          <Form.Text type="invalid" className="errorTxt">
            {errorsLst.password}
          </Form.Text>
        )}
      </Form.Group>
      <Button type="submit" className="frmBtn purbleBtn FullWidthBtn">
        Login
      </Button>
      {loading ? <LoadingPage /> : null}
      {showAlert ? (
        <PopUp msg={User != null ? User.msg : errors} closeAlert={closeAlert} />
      ) : null}
    </Form>
  );
}

export default LoginForm;
