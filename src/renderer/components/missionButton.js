import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrawPolygon, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';

const MISSION_REST_ENDPOINT = "http://localhost:8081/armed"

function StartMission() {
    fetch('http://localhost:8081/startMission', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
}


function MissionButton() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseConfirm = () => {
    StartMission();
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const [missionRunning, setMissionRunning] = useState({});
  useEffect( () => {
      
    const timer = setInterval(async () => {
        const res = await fetch(MISSION_REST_ENDPOINT);
        const newMissionRunning = await res.json();
        setMissionRunning(newMissionRunning);
       
    }, 100);

    return () => clearInterval(timer);
},[]);

    return (
<>            <Button variant="dark"
                onClick={handleShow}><FontAwesomeIcon icon={faDrawPolygon} color="white"/>
            </Button>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Mission</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm to start Mission!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleCloseConfirm}>
            Start!
          </Button>
        </Modal.Footer>
      </Modal>
      </>

    )
}

export default MissionButton;
