import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/config';
import { useNavigate } from 'react-router-dom';
import './Adminselection.css';

const Adminselection = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Admins"));
        console.log(" querySnapshot", querySnapshot)
              console.log(" querySnapshotdocs", querySnapshot)
        const adminData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log(data,"data")
          return {
            id: doc.id,
            name: data.name || 'No name provided',
            email: data.email || 'No email',
            materials: data.materials || []
          };
        });
        setAdmins(adminData);
      } catch (err) {
        console.log("Failed to fetch admins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  if (loading) return <p className="loading">Loading admin data...</p>;

  if (admins.length === 0) return <p className="no-data">No admins found or failed to load data.</p>;

  return (
    <div className="admin-container">
      {admins.map(admin => (
        <div key={admin.id} className="admin-card">
          <h3>{admin.name}</h3>
          <p><strong>Email:</strong> {admin.email}</p>

          <div className="materials-section">
            {admin.materials.length > 0 ? (
              <div>
                {[...new Map(
                  admin.materials.map((material) => [
                    `${material.BusinessName}-${material.location}`,
                    material
                  ])
                ).values()].map((material, index) => (
                  <div key={index} className="material-info">
                    <p><strong>Business Name:</strong> {material.BusinessName || 'N/A'}</p>
                    <p><strong>Location:</strong> {material.location || 'No location'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No materials listed</p>
            )}
          </div>

          {/* View Materials Button */}
          <button onClick={() => navigate(`ParticularAdmin/${admin.id}`)}>
            View All Materials
          </button>
        </div>
      ))}
    </div>
  );
};

export default Adminselection;





