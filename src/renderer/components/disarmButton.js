import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

const ARMED_REST_ENDPOINT = "http://localhost:8081/armed"

function DisarmDrone() {
    fetch('http://localhost:8081/disarm', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
}


function DisarmButton() {    
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
      
            <Button variant="dark" hidden={!armed.is_armed}
                onClick={() => DisarmDrone()}><FontAwesomeIcon icon={faStop} color="white"/></Button>
     
    )
}

export default DisarmButton
