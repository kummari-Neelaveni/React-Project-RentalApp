// import React, { useState, useEffect } from 'react';
// import { db } from "../../../ConfigFirebase/config";
// import { collection, getDocs } from 'firebase/firestore';
// import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

// const ViewBookings = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const customerRef = collection(db, "Customers");
//         const snapshot = await getDocs(customerRef);
//         const customerData = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCustomers(customerData);
//       } catch (error) {
//         console.log("Error fetching customer bookings:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//   }, []);

//   // Filter only customers with at least one booking
//  const customersWithBookings = customers.filter(
//     (customer) =>
//       Array.isArray(customer.myBookings) &&
//       customer.myBookings.some(
//         (booking) => booking.materialName && booking.materialName.trim() !== ""
//       )
//   );

//   return (
//      <Container className="mt-4">
//       <h2 className="mb-4">Customer Bookings</h2>

//       {/* 🔽 Show loading spinner while data is being fetched */}
//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : customersWithBookings.length === 0 ? (
//         // ❌ No bookings found
//         <Alert variant="info" className="text-center">
//           No bookings found.
//         </Alert>
//       ) : (
//         // ✅ Show customer cards
//         <Row>
//           {customersWithBookings.map((customer) =>
//             customer.myBookings
//               // 🔽 Filter out bookings with no materialName
//               .filter(
//                 (booking) =>
//                   booking.materialName && booking.materialName.trim() !== ""
//               )
//               .map((booking, index) => (
//                 <Col key={`${customer.id}-${index}`} md={4} className="mb-4">
//                   <Card>
//                     <Card.Body>
//                       <Card.Title>{booking.customerName}</Card.Title>
//                       <Card.Subtitle className="mb-2 text-muted">
//                         Customer ID: {customer.id}
//                       </Card.Subtitle>
//                       <Card.Text>
//                         <strong>Phone:</strong> {booking.phoneNumber} <br />
//                         <strong>Location:</strong> {booking.location} <br />
//                         <strong>Material:</strong> {booking.materialName} <br />
//                         <strong>Price:</strong> ₹{booking.materialPrice} <br />
//                         <strong>Category:</strong> {booking.materialCategory}
//                       </Card.Text>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))
//           )}
//         </Row>
//       )}
//     </Container>
//   );
// };

// export default ViewBookings;



import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../ConfigFirebase/config";
import { Card, Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const ViewBookings = ({ adminId, materialId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchMaterialBookings();
  }, [adminId, materialId]);

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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ViewBookings;


