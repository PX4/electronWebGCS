import BatteryGauge from 'react-battery-gauge'
import { Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useState } from 'react';
import { useEffect } from 'react';


const BATTERY_REST_ENDPOINT = "http://localhost:8081/battery"  
    

function BatteryDisplay() {

    const [battery, setBattery] = useState({});
    useEffect( () => {
        
      const timer = setInterval(async () => {
          const res = await fetch(BATTERY_REST_ENDPOINT );
          var newBattery = await res.json();
          newBattery.remaining_percent = newBattery.remaining_percent * 100;
          setBattery(newBattery);
          
      }, 100);

      return () => clearInterval(timer);
  },[]);
  

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
        Voltage: {battery.voltage_v.toFixed(2)}
        </Tooltip>
      );
      
    return (
        <OverlayTrigger
      placement="bottom"
      delay={{ show: 0, hide: 250 }}
      overlay={renderTooltip} 
      >
        <Button variant='dark'>
        <BatteryGauge value={battery.remaining_percent} size={70} animated={true} customization={{ batteryMeter: {
            noOfCells: 10
          }, readingText: {darkContrastColor:'#111', fontSize: 17},
        batteryBody: {
            strokeColor: 'white',
            fill: 'white'
        },
        batteryCap: {
            capToBodyRatio: 0.4,
            cornerRadius: 3,
            fill: 'white',
            strokeColor: 'white'
          },}} />
          </Button>
          </OverlayTrigger>
    )
}

export default BatteryDisplay