import React, { useEffect, useState } from 'react';
import { db } from '../../../ConfigFirebase/config';
import { collection, getDocs } from 'firebase/firestore';

const CustomerviewBook = () => {
  const [customerViewbook, setCustomerViewBook] = useState([]);
  const [loading, setLoading] = useState(true);

  let loggedinUsercustomer;
  try {
    loggedinUsercustomer = JSON.parse(localStorage.getItem("loggedInCustomer"));
  } catch {
    loggedinUsercustomer = null;
  }

  const loggedcustomerName = loggedinUsercustomer?.user?.displayName;
  console.log(loggedcustomerName, "loggedcustomerName");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!loggedcustomerName) {
        setLoading(false);
        return;
      }

      try {
        const BookedRef = collection(db, 'Customers', loggedcustomerName, 'myBookings');
        const snapshot = await getDocs(BookedRef);

        const bookingData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCustomerViewBook(bookingData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [loggedcustomerName]);

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>
      {customerViewbook.length === 0 ? (
        <p>No bookings found...</p>
      ) : (
        customerViewbook.map((booking) => (
          <div key={booking.id}>
            <p>{booking.materialName}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerviewBook;


