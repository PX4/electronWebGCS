import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

const INAIR_REST_ENDPOINT = "http://localhost:8081/inAir"

function TakeoffDrone() {
    fetch('http://localhost:8081/takeoff', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
}


function TakeoffButton() {    
  const [inAir, setInAir] = useState({});
  useEffect( () => {
      
    const timer = setInterval(async () => {
        const res = await fetch(INAIR_REST_ENDPOINT);
        const newinAir = await res.json();
        setInAir(newinAir);
       
    }, 100);

    return () => clearInterval(timer);
},[]);
    return (
        
            
            <Button id="takeoff" variant="dark" hidden={inAir.is_in_air}
                onClick={() => TakeoffDrone()}> <FontAwesomeIcon icon={faPlaneDeparture} color="white"/></Button>
      
    )
}

export default TakeoffButton
