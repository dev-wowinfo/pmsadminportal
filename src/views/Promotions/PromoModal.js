import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Label, Col } from "reactstrap";
import { useState } from "react";
import { Select } from "@mui/material";

const PromoModal = ({ open, handleOpen }) => {
    const [selectedPromotion, setSelectedPromotion] = useState(null);


    const promotionData = {
        name: "Hotel Grand Plaza",
        licenseNo: "LIC-7788",
        issueDate: "2024-02-01",
        expiryDate: "2026-02-01",
    };

    const handleCreateLicense = () => {
        setSelectedPromotion(promotionData);
    };

    return (
        <>
            <Button color="primary" onClick={handleCreateLicense}>
                Create License
            </Button>

            <div className="d-flex flex-column justify-content-center align-items-center ">
                <Modal isOpen={open} toggle={handleOpen} className={"modal-dialog-centered modal-md"}>
                    <ModalHeader toggle={handleOpen}>
                        <h3 className="fw-bolder">Create New License</h3>
                        <p className="fs-6">Assign a subscriptions plan to a hotel </p>
                    </ModalHeader>

                    <ModalBody>
                        <Row className="d-flex flex-column justify-content-center align-items-center">
                            
                            <Col className="mt-1 d-flex flex-md-row flex-column">
                                <Col className="mx-1">
                                    <Label className="form-label" for="email">
                                        Subscription Type
                                    </Label>
                                    <Select className="d-flex w-50">
                                        <option>Demo/Trial</option>
                                        <option>Monthly</option>
                                        <option>6 Month</option>
                                        <option>1 Year</option>
                                        <option>2 Year</option>
                                    </Select>
                                </Col>
                               
                            </Col>
                           
                           
                        </Row>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="secondary" onClick={handleOpen}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        </>
    );
};

export default PromoModal;


// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import { useState } from "react";



// const Promotion = ({ open, handleNewGuest }) => {
//     const [openLicense, setOpenLicense] = useState(false);
//     const [selectedPromotion, setSelectedPromotion] = useState(null);

//     const handleCreateLicense = (promotion) => {
//         setSelectedPromotion(promotion); // 👈 previous data
//         setOpenLicense(true);
//     };


//     const toggleModal = () => setModalOpen(!modalOpen);

//     return (
//         <>
//             <Button
//                 color="primary"

//                 onClick={() =>

//                     handleCreateLicense({
//                         name: "Hotel Grand Plaza",
//                         licenseNo: "LIC-7788",
//                         issueDate: "2024-02-01",
//                         expiryDate: "2026-02-01",
//                     })

//                 }
//             >
//                 Create License
//             </Button>

//             <License
//                 isOpen={openLicense}

//                 toggle={() => setOpenLicense(true)}
//                 data={selectedPromotion}
//             />
//             <Modal isOpen={open} toggle={handleNewGuest}>
//                 <ModalHeader toggle={toggle}>
//                     License Details
//                 </ModalHeader>

//                 <ModalBody>
//                     <p><strong>Promotion Name:</strong> {data.name}</p>
//                     <p><strong>License No:</strong> {data.licenseNo}</p>
//                     <p><strong>Issue Date:</strong> {data.issueDate}</p>
//                     <p><strong>Expiry Date:</strong> {data.expiryDate}</p>
//                 </ModalBody>

//                 <ModalFooter>
//                     <Button color="secondary" onClick={toggle}>
//                         Close
//                     </Button>
//                 </ModalFooter>
//             </Modal>
//         </>
//     );
// };
// // Promotion();

// // const License = ({ isOpen, toggle, data }) => {
// //     if (!data) return null;

// //     return (

// //     );
// // };


// export default Promotion;
