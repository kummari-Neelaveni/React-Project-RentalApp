import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Modal, Button, Form } from 'react-bootstrap'; // For edit modal UI
import { db } from '../../../ConfigFirebase/config';
import './ViewMaterial.css';

const ViewMaterial = () => {
  const [viewMaterial, setViewMaterial] = useState([]); // To store all materials
  const [loading, setLoading] = useState(true);         // To handle loading state

  // Get currently logged-in admin from localStorage
  const loggedinUserFirebase = JSON.parse(localStorage.getItem("loggedInAdmin"));

  // States for edit modal
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);           // Which material is being edited
  const [editedMaterial, setEditedMaterial] = useState({});   // Material being edited

  // Fetch materials from Firestore on page load
  useEffect(() => {
    const fetchingDataMaterials = async () => {
      const adminDocRef = doc(db, "Admins", loggedinUserFirebase.user.displayName);
      const getDocRef = await getDoc(adminDocRef); // Fetch document snapshot

      if (getDocRef.exists()) {
        const data = getDocRef.data();             // Extract document data
        setViewMaterial(data.materials || []);     // Store materials into state
      }
      setLoading(false);
    };

    fetchingDataMaterials();
  }, []);

  // Delete a material
  const handleDeleteMaterial = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this material?");
    if (!confirmDelete) return;

    const updatedMaterials = viewMaterial.filter((_, i) => i !== index); // Filter out deleted
    const docref = doc(db, "Admins", loggedinUserFirebase.user.displayName);

    await updateDoc(docref, { materials: updatedMaterials }); // Update Firestore
    setViewMaterial(updatedMaterials);                        // Update local UI
    alert("Material deleted successfully!");
  };

  // Open modal with current material data for editing
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedMaterial({ ...viewMaterial[index] }); // Clone current material data
    setShowModal(true);                            // Show modal
  };

  // Save edited material back to Firestore and local state
  const handleSave = async () => {
    const updatedMaterials = [...viewMaterial];         // Clone entire materials array
    updatedMaterials[editIndex] = editedMaterial;       // Replace the edited one

    const docref = doc(db, "Admins", loggedinUserFirebase.user.displayName);
    await updateDoc(docref, { materials: updatedMaterials }); // Update Firestore

    setViewMaterial(updatedMaterials);  // Update UI
    setShowModal(false);                // Close modal
    alert("Material updated successfully!");
  };

  // Show loading message
  if (loading) {
    return <p className="loading-text">Loading... Please wait.</p>;
  }

  return (
    <div className="view-material-container">
      <h1 className="title">Materials Available</h1>

      {/* Display all materials as cards */}
      <div className="material-grid">
        {viewMaterial.map((material, index) => (
          <div className="material-card" key={material.id || index}>
            <img className="material-image" src={material.imageurl} alt={material.name} />
            <div className="material-details">
              <h2 className="material-name"><strong>Material Name:</strong> {material.name}</h2>
              <p className="material-description">{material.description}</p>
              <ul className="material-info">
                <li><strong>Size:</strong> {material.size}</li>
                <li><strong>Price per day:</strong> ₹{material.price}</li>
                <li><strong>Category:</strong> {material.category}</li>
                <li><strong>Quantity:</strong> {material.quantity}</li>
                <li><strong>Location:</strong> {material.location}</li>
              </ul>

              {/* Edit / Delete Buttons */}
              <div className="card-actions">
                <span className="edit-btn" onClick={() => handleEdit(index)}>Edit</span>
                <span className="delete-btn" onClick={() => handleDeleteMaterial(index)}>Delete</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📝 Edit Material Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Input fields pre-filled with selected material data */}
            <Form.Group className="mb-2">
              <Form.Label>Material Name</Form.Label>
              <Form.Control
                type="text"
                value={editedMaterial.name}
                onChange={(e) => setEditedMaterial({ ...editedMaterial, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={editedMaterial.description}
                onChange={(e) => setEditedMaterial({ ...editedMaterial, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                value={editedMaterial.size}
                onChange={(e) => setEditedMaterial({ ...editedMaterial, size: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editedMaterial.price}
                onChange={(e) => setEditedMaterial({ ...editedMaterial, price: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                value={editedMaterial.quantity}
                onChange={(e) => setEditedMaterial({ ...editedMaterial, quantity: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={editedMaterial.location}
                onChange={(e) => setEditedMaterial({ ...editedMaterial, location: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* Save and Cancel buttons */}
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewMaterial;


