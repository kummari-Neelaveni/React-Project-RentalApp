import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/config';
import Booking from '../Booking/Booking'; // import your Booking modal component

const ParticularAdmin = () => {
  const { adminId } = useParams();
  console.log({adminId},"adminId")
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  // For booking modal
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const docRef = doc(db, 'Admins', adminId);
        console.log(docRef,"docRefparticularAdmin...")

        const docSnap = await getDoc(docRef);
        console.log(docSnap.data(),"docsnap particular")
        if (docSnap.exists()) {
          setAdminData(docSnap.data());
        } else {
          console.log('No such admin!');
        }
      } catch (error) {
        console.error('Error fetching admin:', error);
        
      } finally{
        setLoading(false)
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleBookNow = (material) => {
    setSelectedMaterial(material);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMaterial(null);
  };

  if (loading) return <p>Loading admin data...</p>;
  if (!adminData) return <p>No admin found!</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin: {adminId}</h2>
      <p><strong>Email:</strong> {adminData.email}</p>

      <h3>Materials:</h3>
      {adminData.materials && adminData.materials.length > 0 ? (
        adminData.materials.map((material, index) => (
          <div key={index} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
            <p><strong>Name:</strong> {material.name}</p>
            <p><strong>Business:</strong> {material.BusinessName}</p>
            <p><strong>Category:</strong> {material.category}</p>
            <p><strong>Price:</strong> ₹{material.price}</p>
            <img src={material.imageurl} alt={material.name} width="100" />
            <br />
            <button onClick={() => handleBookNow(material)}>Book Now</button>
            {/* You can add your add to cart button here if needed */}
          </div>
        ))
      ) : (
        <p>No materials found for this admin.</p>
      )}

      {/* Booking Modal prop names show,handleclose,material,adminId*/ }
      {selectedMaterial && (
        <Booking
          show={showModal}
          handleClose={handleCloseModal}
          material={selectedMaterial}
          adminId={adminId}
        
        />
      )}
    </div>
  );
};

export default ParticularAdmin;


