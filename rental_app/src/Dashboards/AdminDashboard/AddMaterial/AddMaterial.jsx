import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from "../../../ConfigFirebase/config";
import './AddMaterial.css';  // Import your CSS here

const AddMaterial = () => {
  const loggedinUserFirebase = JSON.parse(localStorage.getItem("loggedInAdmin"));

  const [addMaterial, setAddMaterial] = useState({
    name: "",
    description: "",
    quantity: "",
    size: "",
    price: "",
    imageurl: "",
    category: ""
  });

  const categories = [
    "Plate",
    "Box",
    "Jack",
    "H-Frame",
    "Wooden Plank",
    "Scaffolding Pipe",
    "Binding Wire"
  ];

  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const handleMaterial = async (e) => {
    e.preventDefault()
    const { name, description, quantity, size, price, imageurl, category } = addMaterial;

    if (!name || !description || !quantity || !size || !price || !imageurl || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      const adminDocRef = doc(db, "Admins", loggedinUserFirebase.user.displayName);
      await updateDoc(adminDocRef, {
        materials: arrayUnion(addMaterial)
      });
      alert("Material added successfully!");
      setOpenModal(false);
      setAddMaterial({
  name: "",
  description: "",
  quantity: "",
  size: "",
  price: "",
  imageurl: "",
  category: ""
});
    } catch (error) {
      console.log("Error adding material:", error);
      alert("Failed to add material");
    }
  };

  return (
    <div className="add-material-container text-center my-3">
      <Button
        variant="outline-primary"
        className="add-material-btn"
        onClick={handleClick}
      >
        Add Material
      </Button>

      <Modal show={openModal} onHide={handleClose} centered className="add-material-modal">
        <Modal.Header closeButton className="add-material-modal-header">
          <Modal.Title className="add-material-modal-title">Add New Material</Modal.Title>
        </Modal.Header>

        <Modal.Body className="add-material-modal-body">
          <Form className="add-material-form">
            <Form.Group className="form-group mb-3 add-material-group">
              <Form.Label className="form-label add-material-label"><strong>Material Name</strong></Form.Label>
              <Form.Control
                className="form-control add-material-input"
                type="text"
                placeholder="e.g., Steel Plate"
                value={addMaterial.name}
                onChange={(e) => setAddMaterial({ ...addMaterial, name: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="form-group mb-3 add-material-group">
              <Form.Label className="form-label add-material-label"><strong>Description</strong></Form.Label>
              <Form.Control
                className="form-control add-material-input"
                type="text"
                placeholder="Short description"
                value={addMaterial.description}
                onChange={(e) => setAddMaterial({ ...addMaterial, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="form-group mb-3 add-material-group">
              <Form.Label className="form-label add-material-label"><strong>Quantity</strong></Form.Label>
              <Form.Control
                className="form-control add-material-input"
                type="text"
                placeholder="e.g., 100 units"
                value={addMaterial.quantity}
                onChange={(e) => setAddMaterial({ ...addMaterial, quantity: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="form-group mb-3 add-material-group">
              <Form.Label className="form-label add-material-label"><strong>Size</strong></Form.Label>
              <Form.Control
                className="form-control add-material-input"
                type="text"
                placeholder="e.g., 6ft x 4ft"
                value={addMaterial.size}
                onChange={(e) => setAddMaterial({ ...addMaterial, size: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="form-group mb-3 add-material-group">
              <Form.Label className="form-label add-material-label"><strong>Price (₹)</strong></Form.Label>
              <Form.Control
                className="form-control add-material-input"
                type="number"
                placeholder="e.g., 1500"
                value={addMaterial.price}
                onChange={(e) => setAddMaterial({ ...addMaterial, price: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="form-group mb-3 add-material-group">
              <Form.Label className="form-label add-material-label"><strong>Image URL</strong></Form.Label>
              <Form.Control
                className="form-control add-material-input"
                type="url"
                placeholder="Paste a direct image URL"
                value={addMaterial.imageurl}
                onChange={(e) => setAddMaterial({ ...addMaterial, imageurl: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="form-group mb-3 add-material-group">
              <Form.Label className="form-label add-material-label"><strong>Category</strong></Form.Label>
              <Form.Select
                className="form-select add-material-select"
                value={addMaterial.category}
                onChange={(e) => setAddMaterial({ ...addMaterial, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer className="add-material-modal-footer">
          <Button variant="secondary" onClick={handleClose} className="btn-cancel">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleMaterial} className="btn-add-material">
            Add Material
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddMaterial;



