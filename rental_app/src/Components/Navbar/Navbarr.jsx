import React from 'react'
import {Navbar,Container,Nav,Button} from "react-bootstrap"
import "./Navbarr.css"
import { Link, useNavigate } from 'react-router-dom'
import { signOut ,getAuth} from 'firebase/auth'

const Navbarr = () => {
  const navigate=useNavigate()
  const loggedinUserFirebase=JSON.parse(localStorage.getItem("loggedInAdmin"))||JSON.parse(localStorage.getItem("loggedInCustomer"))

  const  handleLogout=async()=>{
    const auth =getAuth()
    try{
      await signOut(auth);
      localStorage.removeItem("loggedInAdmin")
      localStorage.removeItem("loggedInCustomer")
      alert("logout done")
      navigate("/login")
    }
    catch(error){
      console.log(error)
    }
  };
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
            
            {/* <Link to="/signup">
              <Button variant="outline-warning" className="nav-btn-custom">
                Signup
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="warning" className="nav-btn-custom ">
                Login
              </Button>
            </Link> */}
            {loggedinUserFirebase ? 
            (<><button onClick={handleLogout}>logout</button></>)
            :
            (
              <>
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
              
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      
    </div>
  )
}

export default Navbarr
