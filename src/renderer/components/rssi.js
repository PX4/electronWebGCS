import { Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { faSignal } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

const RCSTATUS_REST_ENDPOINT = "http://localhost:8081/rcStatus"

function RSSIInfo() {
  const [rcStatus, setrcStatus] = useState({});
  useEffect( () => {
      
    const timer = setInterval(async () => {
        const res = await fetch(RCSTATUS_REST_ENDPOINT);
        const newRcStatus = await res.json();
        setrcStatus(newRcStatus);
       
    }, 100);

    return () => clearInterval(timer);
},[]);
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
        Signal Strength: {rcStatus.signal_strength_percent}
        </Tooltip>
      );
    return (
        <OverlayTrigger
      placement="bottom"
      delay={{ show: 0, hide: 250 }}
      overlay={renderTooltip} 
      >
        <Button variant='dark' disabled={!rcStatus.is_available} >
        <FontAwesomeIcon icon={faGamepad} color="white"/>
        <FontAwesomeIcon icon={faSignal} color="white"/>
          </Button>
          </OverlayTrigger>
    )
}

export default RSSIInfo