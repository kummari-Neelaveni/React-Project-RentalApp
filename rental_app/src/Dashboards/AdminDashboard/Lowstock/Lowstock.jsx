import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/config'; // Adjust the path if needed
import { Alert, Container } from 'react-bootstrap';

const Lowstock = ({ adminId }) => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const LOW_STOCK_THRESHOLD = 5;

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsRef = collection(db, `Admins/${adminId}/materials`);
        const snapshot = await getDocs(materialsRef);

        const lowStock = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(material => material.stock <= LOW_STOCK_THRESHOLD);

        setLowStockItems(lowStock);
      } catch (error) {
        console.error("Error fetching materials: ", error);
      }
    };

    fetchMaterials();
  }, [adminId]);

  return (
    <Container>
      {lowStockItems.length > 0 ? (
        <Alert variant="warning">
          <h5>Low Stock Alert!</h5>
          <ul>
            {lowStockItems.map(material => (
              <li key={material.id}>
                {material.materialName} - Only {material.stock} left
              </li>
            ))}
          </ul>
        </Alert>
      ) : (
        <p>No low stock alerts.</p>
      )}
    </Container>
  );
};

export default Lowstock;
