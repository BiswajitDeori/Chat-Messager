import React, { useEffect, useState } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import "./Register.css"; // Import your custom CSS file
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

const Register = () => {
  const {
    user,
    registerInfo,
    updateRegister,
    registerUser,
    registerError,
    isRegisterLoading,

  } = useContext(AuthContext);
 


  return (
    <Form onSubmit={registerUser}>
      <Row className="register-container">
        <Col xs={6}>
          <Stack gap={3}>
            <h2 className="register-heading">Register User</h2>

            <Form.Control
              className="register-input"
              type="text"
              placeholder="Name"
              onChange={(e) =>
                updateRegister({ ...registerInfo, name: e.target.value })
              }
            />
            <Form.Control
              className="register-input"
              type="email"
              placeholder="Email"
              onChange={(e) =>
                updateRegister({ ...registerInfo, email: e.target.value })
              }
            />
            <Form.Control
              className="register-input"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                updateRegister({ ...registerInfo, password: e.target.value })
              }
            />

            <Button
              disabled={isRegisterLoading}
              type="submit"
              variant="primary"
              className="register-button"
            >
              {!isRegisterLoading ? "Register" : "Creating Account . . ."}
            </Button>
            {registerError != null && (
              <Alert variant="danger" className="register-alert">
                <p>{registerError}</p>
              </Alert>
            )}
            
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Register;
