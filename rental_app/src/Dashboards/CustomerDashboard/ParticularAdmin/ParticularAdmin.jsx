import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc,addDoc } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/config';


const ParticularAdmin = () => {
  const navigate=useNavigate()
  const { adminId } = useParams(); // gets "megha" or "Neelaveni"
  console.log({adminId},"adminId")
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const docRef = doc(db, "Admins", adminId);
        console.log(docRef,"docref")
        const docSnap = await getDoc(docRef);
         console.log(docSnap,"docSnap")
        console.log(docSnap.data(),"docSnap")


        if (docSnap.exists()) {
          setAdminData(docSnap.data());
        } else {
          console.log("No such admin!");
        }
      } catch (error) {
        console.error("Error fetching admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleBook=(material)=>{
    navigate("booking")
    
  }

  if (loading) return
   <p>Loading admin data...</p>;

  if (!adminData) return <p>No admin found!</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin: {adminId}</h2>
      <p><strong>Email:</strong> {adminData.email}</p>

      <h3>Materials:</h3>
      {adminData.materials && adminData.materials.length > 0 ?
       (
        adminData.materials.map((material, index) => (
          <div key={index} style={{ border: '1px solid gray', padding: '10px', marginBottom: '10px' }}>
            <p><strong>Name:</strong> {material.name}</p>
            <p><strong>Business:</strong> {material.BusinessName}</p>
            <p><strong>Category:</strong> {material.category}</p>
            <p><strong>Price:</strong> ₹{material.price}</p>
            <img src={material.imageurl} alt={material.name} width="100" />
             <button onClick={() => handleBook(material)}>Book Now</button>
             <button onClick={() => handleAddToCart(material)}>Add to Cart</button>
          </div>
        ))
      ) : (
        <p>No materials found for this admin.</p>
      )}
    </div>
  );
};

export default ParticularAdmin;
