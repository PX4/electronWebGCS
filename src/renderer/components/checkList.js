import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';
const HEALTH_REST_ENDPOINT = "http://localhost:8081/health"

function CheckList() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseConfirm = () => {
    setShow(false);
  }
  const handleShow = () => setShow(true);

  const [health, setHealth] = useState({});
  useEffect( () => {
      
    const timer = setInterval(async () => {
        const res = await fetch(HEALTH_REST_ENDPOINT);
        const newHealth = await res.json();
        //console.log(newHealth);
        setHealth(newHealth);
       
    }, 100);

    return () => clearInterval(timer);
},[]);

    return (
<>            <Button variant="dark"
                onClick={handleShow}><FontAwesomeIcon icon={faListCheck} color="white"/>
            </Button>
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Check List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup horizontal> 
            <ListGroup.Item variant={health.is_accelerometer_calibration_ok ? 'success' : 'danger'}>Accel</ListGroup.Item>
            <ListGroup.Item variant={health.is_magnetometer_calibration_ok ? 'success' : 'danger'}>Mag</ListGroup.Item>
            <ListGroup.Item variant={health.is_gyrometer_calibration_ok ? 'success' : 'danger'}>Gyro</ListGroup.Item>
            <ListGroup.Item variant={health.is_global_position_ok ? 'success' : 'danger'}>Global Pos</ListGroup.Item>
            <ListGroup.Item variant={health.is_home_position_ok ? 'success' : 'danger'}>Home Pos</ListGroup.Item>
          </ListGroup>
          <br></br>
        <ListGroup>

            
            <Form>
            
            <ListGroup.Item><Form.Check type="checkbox" label="Hardware: Props mounted correctly and secured?" /></ListGroup.Item>
            <ListGroup.Item><Form.Check type="checkbox" label="Battery: Connector firmly plugged in/locked?" /></ListGroup.Item>
            <ListGroup.Item><Form.Check type="checkbox" label="Wind and Weather: Within Flight Envelope?" /></ListGroup.Item>
            <ListGroup.Item><Form.Check type="checkbox" label="Flight Area: Clear of People and Obstacles?" /></ListGroup.Item>
            </Form>
            <ListGroup.Item variant={health.is_armable ? 'success' : 'danger'}>All Checks Passed! Drone Armable</ListGroup.Item>

        </ListGroup>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      </>

    )
}

export default CheckList