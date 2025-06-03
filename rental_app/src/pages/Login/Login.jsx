import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../../ConfigFirebase/config';
import './Login.css'; // ✅ make sure this path is correct

const Login = () => {
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
    role: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, role } = loginDetails;

    try {
      const loggedinUserFirebase = await signInWithEmailAndPassword(
        authentication,
        email,
        password
      );

      alert("Login successful, redirecting to the dashboard");

      if (role === "Admin") {
        localStorage.setItem("loggedInAdmin", JSON.stringify(loggedinUserFirebase));
      } else {
        localStorage.setItem("loggedInCustomer", JSON.stringify(loggedinUserFirebase));
      }

      navigate(`/${role}Dashboard`);

    } catch (error) {
      console.error("Login failed", error);
      alert("Login unsuccessful");
    }
  };

  return (
  <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={loginDetails.email}
              onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <Form.Control
              type="password"
              placeholder="password"
              value={loginDetails.password}
              onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <Form.Select
              value={loginDetails.role}
              onChange={(e) => setLoginDetails({ ...loginDetails, role: e.target.value })}
            >
              <option value="">Choose your role</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
            </Form.Select>
          </div>

          <button type="submit" className="btn-login">Login</button>
        </Form>
        <Link to="/signup" className="signup-link"><span>create an account? </span>...Go to Signup Form</Link>
      </div>
    </div>
  );
};

export default Login;


