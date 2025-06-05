import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/config';
import './Adminselection.css';

const Adminselection = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Admins"));
        const adminData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'No name provided',
            email: data.email || 'No email',
            materials: data.materials || []
          };
        });
        setAdmins(adminData);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) return <p className="loading">Loading admin data...</p>;

  if (admins.length === 0) {
    return <p className="no-data">No admins found or failed to load data.</p>;
  }

  return (
    <div className="admin-container">
    

      {admins.map(admin => (
        <div key={admin.id} className="admin-card">
          <h3>{admin.name}</h3>
          <p><strong>Email:</strong> {admin.email}</p>

          <div className="materials-section">
            {admin.materials.length > 0 ? (
              <ul>
                {[...new Set(admin.materials.map(m => m.BusinessName || 'N/A'))].map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            ) : (
              <p>No materials listed</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Adminselection;




