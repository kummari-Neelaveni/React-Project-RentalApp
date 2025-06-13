import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../ConfigFirebase/config";
import { Card, Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";

const ViewBookings = ({ adminId, materialId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterialBookings = async () => {
    try {
      const adminRef = doc(db, "Admins", adminId);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const data = adminSnap.data();
        const material = data.materials ? data.materials[materialId] : null;
        if (material && material.bookings) {
          setBookings(material.bookings);
        } else {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialBookings();
  }, [adminId, materialId]);

  const handleCancelBooking = async (indexToRemove) => {
    try {
      const adminRef = doc(db, "Admins", adminId);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        const updatedMaterials = [...adminData.materials];

        if (
          updatedMaterials[materialId] &&
          updatedMaterials[materialId].bookings
        ) {
          updatedMaterials[materialId].bookings = updatedMaterials[materialId].bookings.filter(
            (_, index) => index !== indexToRemove
          );

          await updateDoc(adminRef, {
            materials: updatedMaterials
          });

          setBookings(updatedMaterials[materialId].bookings);
          alert("Booking cancelled successfully!");
        }
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <Container className="mt-4">
        <Alert variant="info" className="text-center">
          No bookings for this material.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Bookings for Material: {materialId}</h2>
      <Row>
        {bookings.map((booking, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{booking.customerName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Phone: {booking.phoneNumber}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Location:</strong> {booking.location} <br />
                  <small>Booked At: {booking.bookedAt ? new Date(booking.bookedAt).toLocaleString() : "N/A"}</small>
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleCancelBooking(index)}
                >
                  Cancel Booking
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ViewBookings;

