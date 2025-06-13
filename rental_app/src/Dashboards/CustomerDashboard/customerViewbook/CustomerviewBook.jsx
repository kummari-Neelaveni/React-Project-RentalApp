import React, { useEffect, useState } from 'react';
import { db } from '../../../ConfigFirebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const CustomerviewBook = () => {
  const [customerViewbook, setCustomerViewBook] = useState([]);
  const [loading, setLoading] = useState(true);

  let loggedinUsercustomer;
  try {
    loggedinUsercustomer = JSON.parse(localStorage.getItem("loggedInCustomer"));
  } catch {
    loggedinUsercustomer = null;
  }

  const loggedcustomerName = loggedinUsercustomer?.displayName || loggedinUsercustomer?.user?.displayName;

  useEffect(() => {
    fetchBookings();
  }, [loggedcustomerName]);

  const fetchBookings = async () => {
    if (!loggedcustomerName) {
      setLoading(false);
      return;
    }

    try {
      const customerRef = doc(db, 'Customers', loggedcustomerName);
      const docSnap = await getDoc(customerRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCustomerViewBook(data.myBookings || []);
      } else {
        setCustomerViewBook([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setCustomerViewBook([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (indexToRemove) => {
    try {
      const customerRef = doc(db, 'Customers', loggedcustomerName);
      const docSnap = await getDoc(customerRef);

      if (!docSnap.exists()) {
        alert("Customer not found.");
        return;
      }

      const data = docSnap.data();
      const updatedBookings = data.myBookings.filter((_, index) => index !== indexToRemove);

      await updateDoc(customerRef, {
        myBookings: updatedBookings
      });

      setCustomerViewBook(updatedBookings);
      alert("Booking cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: 'fit content' }}>
      <h2 style={{ color: 'navy' }}>My Bookings</h2>
      {customerViewbook.length === 0 ? (
        <p style={{ color: 'gray' }}>No bookings found...</p>
      ) : (
        customerViewbook.map((booking, index) => (
          <div key={index} style={{
            border: '1px solid #ccc',
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '10px',
            backgroundColor: '#f8f9fa',
          }}>
            <p><strong>Material:</strong> {booking.materialName}</p>
            <p><strong>From:</strong> {booking.startDate}</p>
            <p><strong>To:</strong> {booking.endDate}</p>
            <p><strong>Location:</strong> {booking.location}</p>
            <p><strong>Price:</strong> ₹{booking.materialPrice}</p>
            <p><strong>Category:</strong> {booking.materialCategory}</p>
            <button
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => handleCancelBooking(index)}
            >
              Cancel Booking
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerviewBook;





