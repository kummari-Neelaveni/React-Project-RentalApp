import React from 'react'
import {Navbar,Container,Nav,Button} from "react-bootstrap"
import "./Navbarr.css"
import { Link } from 'react-router-dom'

const Navbarr = () => {
  return (
    <div>

        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="custom-navbar shadow-sm">
      <Container>
        <Navbar.Brand href="/" className="navbar-title">
          Smart Construction Rental System
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            <Link to="/signup">
              <Button variant="outline-warning" className="nav-btn-custom">
                Signup
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="warning" className="nav-btn-custom ">
                Login
              </Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
    </div>
  )
}

export default Navbarr
