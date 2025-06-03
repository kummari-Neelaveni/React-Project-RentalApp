import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import {authentication,db} from "../../ConfigFirebase/config"
import {createUserWithEmailAndPassword,updateProfile}from "firebase/auth"
import {doc,setDoc} from "firebase/firestore"
import {useNavigate} from "react-router-dom"
import "./Signup.css"


const Signup = () => {
  const navigate=useNavigate()
    const [signUpDetails,setSignUpDetails]=useState({name:"",email:"",password:"",role:""})


    const handleSubmit=async(e)=>{
      e.preventDefault()
    try {
      //1.create a firebase  account creation with email & password
        const userCredintialCreated= await createUserWithEmailAndPassword(authentication,signUpDetails.email,signUpDetails.password)
        console.log(userCredintialCreated,"userCredintialCreated")

    //2.update display name in firebase auth
    await updateProfile(userCredintialCreated.user,{
      displayName:signUpDetails.name
    })
     //3.store additional info in firestore create a room
     await setDoc(doc(db,`${signUpDetails.role}s`,userCredintialCreated.user.displayName),{
        name: signUpDetails.name,
        email: signUpDetails.email,
        role: signUpDetails.role,
        id:Date.now()
     })
     alert("sigup successful redirected to login")
     // Optionally clear form
    setSignUpDetails({ name: '', email: '', password: '', role: '' });
    navigate('/login')
    }
    catch(error){
      console.log('signup error',error)
      alert("signup failed please try again")

    }

    }
    
    
  return (
    <div className="signup-container">
      <Form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Signup</h2>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="name"
            onChange={(e) => setSignUpDetails({ ...signUpDetails, name: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com"
            onChange={(e) => setSignUpDetails({ ...signUpDetails, email: e.target.value })} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="password"
            onChange={(e) => setSignUpDetails({ ...signUpDetails, password: e.target.value })} />
        </Form.Group>

        <Form.Select aria-label="Default select example"
          onChange={(e) => setSignUpDetails({ ...signUpDetails, role: e.target.value })}>
          <option>Choose your role</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
        </Form.Select>
        <br />
        <button type="submit" className="signup-button">Sign Up</button>
      </Form>
    </div>
  )
}

export default Signup
