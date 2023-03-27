import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';

const ARMED_REST_ENDPOINT = "http://localhost:8081/armed"

function ArmDrone() {
    fetch('http://localhost:8081/arm', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
}


function ArmButton() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseConfirm = () => {
    ArmDrone();
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const [armed, setArmed] = useState({});
  useEffect( () => {
      
    const timer = setInterval(async () => {
        const res = await fetch(ARMED_REST_ENDPOINT);
        const newArmed = await res.json();
        setArmed(newArmed);
       
    }, 100);

    return () => clearInterval(timer);
},[]);

    return (
<>            <Button variant="dark" hidden={armed.is_armed}
                onClick={handleShow}><FontAwesomeIcon icon={faPlay} color="white"/>
            </Button>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Arm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm to arm Drone. Motors will start spinning!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleCloseConfirm}>
            Arm!
          </Button>
        </Modal.Footer>
      </Modal>
      </>

    )
}

export default ArmButton
