import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDrawPolygon, faPause, faPauseCircle, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';



const FLIGHTMODE_REST_ENDPOINT = "http://localhost:8081/flightMode"  

function StartMission() {
    fetch('http://localhost:8081/startMission', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
}


function PauseMission() {
    fetch('http://localhost:8081/pauseMission', {
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

  const handlePause = () => {
    PauseMission();
  }

  const [missionRunning, setMissionRunning] = useState(false);
  useEffect( () => {
      
    const timer = setInterval(async () => {
        const res = await fetch(FLIGHTMODE_REST_ENDPOINT);
        const newMissionRunning = await res.json();
        //console.log(newMissionRunning);
        setMissionRunning(newMissionRunning.flight_mode == 'FLIGHT_MODE_MISSION' ? true : false);
       
    }, 100);

    return () => clearInterval(timer);
},[]);

    return (
<>            <Button variant="dark"
                onClick={handleShow} hidden={missionRunning}><FontAwesomeIcon icon={faDrawPolygon} color="white"/>
            </Button>
            <Button variant="dark"
                onClick={handlePause} hidden={!missionRunning}><FontAwesomeIcon icon={faPause} color="white"/>
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
