import { Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSatellite } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useEffect } from 'react';
const GPSINFO_REST_ENDPOINT = "http://localhost:8081/gpsInfo"   

function GPSInfo() {

    const [gpsInfo, setGpsInfo] = useState({});
    useEffect( () => {
        
      const timer = setInterval(async () => {
          const res = await fetch(GPSINFO_REST_ENDPOINT);
          const newGpsInfo = await res.json();
          setGpsInfo(newGpsInfo);
      }, 100);

      return () => clearInterval(timer);
  },[]);
    
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
        GPS Count: {gpsInfo.num_satellites}
        <br />
        GPS Lock: {gpsInfo.fix_type}
        </Tooltip>
      );
    return (
        <OverlayTrigger
      placement="bottom"
      delay={{ show: 0, hide: 250 }}
      overlay={renderTooltip} 
      >
        <Button variant='dark'>
        <FontAwesomeIcon icon={faSatellite} color="white"/>
          {gpsInfo.num_satellites}</Button>
          </OverlayTrigger>
    )
}

export default GPSInfo