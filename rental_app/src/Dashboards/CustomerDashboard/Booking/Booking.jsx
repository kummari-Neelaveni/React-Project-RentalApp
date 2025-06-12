import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { db, authentication } from "../../../ConfigFirebase/config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Booking = ({ show, handleClose, material, adminId }) => {
  const [bookingDetails, setBookingDetails] = useState({
    customerName: "",
    phoneNumber: "",
    location: "",
  });

  const [loggedInCustomer, setLoggedInCustomer] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      if (user) {
        setLoggedInCustomer(user);
        localStorage.setItem("loggedInCustomer", JSON.stringify(user));
      } else {
        setLoggedInCustomer(null);
        localStorage.removeItem("loggedInCustomer");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setBookingDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBooking = async () => {
    if (
      !bookingDetails.customerName ||
      !bookingDetails.phoneNumber ||
      !bookingDetails.location
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (!loggedInCustomer) {
      alert("You must be logged in to book.");
      return;
    }

    if (!material || !material.name || !material.price || !material.category) {
      alert("Invalid material data.");
      return;
    }

    const bookingData = {
      ...bookingDetails,
      materialId: material.id || "", // if you store material.id manually
      materialName: material.name,
      materialPrice: material.price,
      materialCategory: material.category,
      timestamp: new Date().toISOString(),
    };

    try {
      const adminRef = doc(db, "Admins", adminId);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        alert("Admin not found!");
        return;
      }

      let adminData = adminSnap.data();
      let updatedMaterials = [];

      if (adminData.materials && Array.isArray(adminData.materials)) {
        updatedMaterials = adminData.materials.map((mat) => {
          if (
            mat.name === material.name &&
            mat.price === material.price &&
            mat.category === material.category
          ) {
            if (!mat.bookings) mat.bookings = [];
            return {
              ...mat,
              bookings: [...mat.bookings, bookingData],
            };
          }
          return mat;
        });
      }

      // Update materials with new bookings array
      await updateDoc(adminRef, {
        materials: updatedMaterials,
      });

      // Also store in customer's record
      const customerRef = doc(
        db,
        "Customers",
        loggedInCustomer.displayName || loggedInCustomer.uid
      );
      const customerSnap = await getDoc(customerRef);

      if (customerSnap.exists()) {
        await updateDoc(customerRef, {
          myBookings: [...(customerSnap.data().myBookings || []), bookingData],
        });
      } else {
        await setDoc(customerRef, {
          myBookings: [bookingData],
        });
      }

      alert("Booking confirmed!");
      handleClose();
    } catch (error) {
      console.error("Error booking:", error);
      alert("Booking failed. Try again.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Book Material</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {material && (
          <>
            <p><strong>Material:</strong> {material.name}</p>
            <p><strong>Price:</strong> ₹{material.price}</p>
            <p><strong>Category:</strong> {material.category}</p>
          </>
        )}

        <Form>
          <Form.Group controlId="customerName">
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={bookingDetails.customerName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              name="phoneNumber"
              value={bookingDetails.phoneNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={bookingDetails.location}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleBooking}>Confirm Booking</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Booking;














