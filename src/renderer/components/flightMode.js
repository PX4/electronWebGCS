import BatteryGauge from 'react-battery-gauge'
import { Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useState } from 'react';
import { useEffect } from 'react';


const FLIGHTMODE_REST_ENDPOINT = "http://localhost:8081/flightMode"  
    

function FlightMode() {

    const [flightMode, setFlightMode] = useState({});
    useEffect( () => {
        
      const timer = setInterval(async () => {
          const res = await fetch(FLIGHTMODE_REST_ENDPOINT );
          const newFlightMode = await res.json();
          //console.log(newFlightMode);
          setFlightMode(newFlightMode);
         
      }, 100);

      return () => clearInterval(timer);
  },[]);
      
    return (
        <Button variant='dark'>{flightMode.flight_mode}</Button>
    )
}

export default FlightMode