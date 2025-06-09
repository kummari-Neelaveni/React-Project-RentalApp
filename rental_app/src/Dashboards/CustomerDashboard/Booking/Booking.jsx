import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {db, authentication} from "../../../ConfigFirebase/config"
import {doc,setDoc,updateDoc,arrayUnion,getDoc} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth";

const Booking = ({ show, handleClose, material }) => {
  
  const [bookingDetails,setBookingDetails]=useState(
    {customerName:"",
      phoneNumber:"",
      location:""
    });

    const [loggedInCustomer,setLoggedInCustomer]= useState(null);
    //auth state changes get the current user

    useEffect(()=>{
      const unsubscribe =onAuthStateChanged(authentication,(user)=>{
      if(user){
        setLoggedInCustomer(user)
        localStorage.setItem("loggedInCustomer", JSON.stringify(user));
      }
      else{
        setLoggedInCustomer(null);
        localStorage.removeItem("loggedInCustomer")
      }
    });
    return ()=>unsubscribe();//clean up listener on unmount
    },[])

  //handle input change
  const handleChange =(e)=>{
    setBookingDetails((prev)=>({
      ...prev,
      [e.target.name]: e.target.value

    }))
   };
    //confirm Booking handler
    const handleBooking =async()=>{
      const bookingdata ={
        ...bookingDetails,
        materialName :material.name,
        materialPrice:material.price,
        materialCategory:material.category,
        // created:serverTimestamp()
      };

      const customerDocRef=doc(db,"Customers",loggedInCustomer.displayName)
      console.log(customerDocRef,"customerDocRef...") //it gets doocsnap
      try {
        const docsnap=await getDoc(customerDocRef);
        console.log(docsnap,"docsnap...")
        
        if (docsnap.exists()){
          //update my bookings array
          await updateDoc(customerDocRef,{
            myBookings:arrayUnion(bookingdata)
          })
        }else {
          //create a new doc with mybookings
          await setDoc(customerDocRef,{
            myBookings:[bookingdata]
          })
        }
        alert("Booking Confirmed ! ..........")
        handleClose();//close modal

      }
      catch(error){
        console.log(error,"Error saving booking")
        alert ("Booking failed .Try again")
      }
    
      
    }


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Book Material</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Material:</strong> {material.name}</p>
        <p><strong>Price:</strong> ₹{material.price}</p>
        <p><strong>Category:</strong> {material.category}</p>

        <Form>
          <Form.Group controlId="customerName">
            <Form.Label>Your Name</Form.Label>
            <Form.Control type="text" name="customerName" value={bookingDetails.customerName} 
             onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="Number" name="phoneNumber" value={bookingDetails.phoneNumber}
            onChange={handleChange} required />
          </Form.Group>

          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" value={bookingDetails.location}
             onChange={handleChange} required />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleBooking}>
          Confirm Booking
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Booking;











