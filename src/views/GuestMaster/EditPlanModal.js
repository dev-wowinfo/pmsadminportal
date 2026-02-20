import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

function EditPlanModal({ show, handleClose, plan,  onSave }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (plan) setFormData(plan);
    }, [plan]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSave = () => {
        console.log("button click");
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Edit Plan</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-1">
                        <Form.Label>Plan Name *</Form.Label>
                        <Form.Control type="text" placeholder="Starter" />
                    </Form.Group>

                    <Form.Group className="mb-1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Perfect for small hotels getting started"
                        />
                    </Form.Group>

                    <div className="row mb-1">
                        <div className="col-md-6">
                            <Form.Label>Subscription Type *</Form.Label>
                            <Form.Select>
                                <option>Monthly</option>
                                <option>Yearly</option>
                            </Form.Select>
                        </div>

                        <div className="col-md-6">
                            <Form.Label>Duration (days)</Form.Label>
                            <Form.Control type="number" placeholder="30" />
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-md-6">
                            <Form.Label>Price *</Form.Label>
                            <Form.Control type="number" placeholder="99" />
                        </div>

                        <div className="col-md-6">
                            <Form.Label>Currency</Form.Label>
                            <Form.Select>
                                <option>USD</option>
                                <option>INR</option>
                            </Form.Select>
                        </div>
                    </div>

                    <div className="row mb-1">
                        <div className="col-md-6">
                            <Form.Label>Max Rooms</Form.Label>
                            <Form.Control type="number" placeholder="25" />
                        </div>

                        <div className="col-md-6">
                            <Form.Label>Max Users</Form.Label>
                            <Form.Control type="number" placeholder="5" />
                        </div>
                    </div>

                    <Form.Label className="mb-2">Included Modules *</Form.Label>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Check type="checkbox" label="Front Office" defaultChecked />
                            <Form.Check type="checkbox" label="Point of Sale" />
                            <Form.Check type="checkbox" label="Reports" />
                        </div>

                        <div className="col-md-6">
                            <Form.Check type="checkbox" label="Housekeeping" defaultChecked />
                            <Form.Check type="checkbox" label="Accounting" />
                            <Form.Check type="checkbox" label="Integrations" />
                        </div>
                    </div>
                </Form>

            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditPlanModal;
