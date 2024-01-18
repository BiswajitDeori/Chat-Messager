// Login.js

import React from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import "./Login.css";

import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {

  const {user,updateLogin,isloginLoading,loginError,loginInfo,loginUser} = useContext(AuthContext)

  return (
    <Form onSubmit={loginUser}>
      <Row className="login-container">
        <Col xs={6}>
          <Stack gap={3}>
            <h2 className="login-heading">Login</h2>
            <Form.Control className="login-input" type="email" placeholder="Email" onChange={(e) =>
              updateLogin({ ...loginInfo, email: e.target.value })
            }/>
            <Form.Control className="login-input" type="password" placeholder="Password"
            onChange={(e) =>
              updateLogin({ ...loginInfo, password: e.target.value })
            }
            />
            <Button type="submit" variant="primary" className="login-button">
              Login
            </Button>
            {loginError &&<Alert variant="danger" className="login-alert">
              <p>{loginError}</p>
            </Alert>
            }
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default Login;
