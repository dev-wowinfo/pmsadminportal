import { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";


export default function App() {
  const [show, setShow] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [hotels, setHotels] = useState([
    {
    //   id: 1,
      name: "Grand Plaza Hotel",
      email: "contact@grandplaza.com",
      phone: "+1-555-0100",
      address: "123 Main Street",
      city: "New York",
      country: "USA",
      rooms: 150,
      users: 12,
    },
    {
    //   id: 2,
      name: "Ocean View Resort",
      email: "ocean@resort.com",
      phone: "+1-555-0200",
      address: "Beach Road",
      city: "Miami",
      country: "USA",
      rooms: 90,
      users: 5,
    },
  ]);

  const handleEdit = (hotel) => {
    setSelectedHotel({ ...hotel });
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updated = hotels.map((h) =>
      h.id === selectedHotel.id ? selectedHotel : h
    );
    setHotels(updated);
    setShow(false);
  };

  return (
    <div className="container mt-4">
      <h3>Hotel Management</h3>

      {/* TABLE */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>City</th>
            <th>Rooms</th>
            <th>Users</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.email}</td>
              <td>{hotel.city}</td>
              <td>{hotel.rooms}</td>
              <td>{hotel.users}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(hotel)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Hotel</Modal.Title>
        </Modal.Header>

        {selectedHotel && (
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Hotel Name</Form.Label>
                <Form.Control
                  name="name"
                  value={selectedHotel.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={selectedHotel.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={selectedHotel.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  name="address"
                  value={selectedHotel.address}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>City</Form.Label>
                <Form.Control
                  name="city"
                  value={selectedHotel.city}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  name="country"
                  value={selectedHotel.country}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Room Count</Form.Label>
                <Form.Control
                  name="rooms"
                  value={selectedHotel.rooms}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Active Users</Form.Label>
                <Form.Control
                  name="users"
                  value={selectedHotel.users}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        )}

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="dark" onClick={handleSave}>
            Update Hotel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
