import BatteryGauge from 'react-battery-gauge'
import { Button, Table } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useState } from 'react';
import { useEffect } from 'react';
import { Modal, NavDropdown } from 'react-bootstrap';

const LOGS_REST_ENDPOINT = "http://localhost:8081/logs"  
    

async function fetchLogs() {
    const res = await fetch(LOGS_REST_ENDPOINT );
    const newLogs = await res.json();
    return newLogs;
}

function DownloadLog(id) {
    fetch('http://localhost:8081/log?id='+id , {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
}

function Logs() {

    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseConfirm = () => {
    setShow(false);
  }
  const handleShow = () => {setShow(true); fetchLogs().then((newLogs) => {setLogs(newLogs);});  const timer = setTimeout(async () => {
    fetchLogs().then((newLogs) => {setLogs(newLogs);});
   
}, 2000);};

    const [logs, setLogs] = useState([]);
    
    
      
    return (
        <>
    <NavDropdown.Item 
                onClick={handleShow}>Logs
            </NavDropdown.Item>
      <Modal show={show} onHide={handleClose} size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table bordered hover>
            <th>ID</th><th>Date</th><th>Size</th><th>Download</th>
            {logs.map((data) => (<><tr><td>{data.id}</td><td>{data.date}</td><td>{data.size_bytes}</td><td><Button variant='dark' onClick={() => DownloadLog(data.id)}>Download</Button></td></tr></>))}
            
            </Table>
            </Modal.Body>
      </Modal>
      </>
    )
}

export default Logs