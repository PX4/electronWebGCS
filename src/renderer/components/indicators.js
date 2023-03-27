import React, {useRef, useState, useEffect } from 'react';

import {
  Airspeed,
  Altimeter,
  AttitudeIndicator,
  HeadingIndicator,
  TurnCoordinator,
  Variometer
} from 'react-typescript-flight-indicators'


const ATTITUDE_REST_ENDPOINT = "http://localhost:8081/attitudeEuler"
const HEADING_REST_ENDPOINT =  "http://localhost:8081/heading"
const DEFAULT_ATTITUDE_STATE = {"roll_deg":0,"pitch_deg":0,"yaw_deg":0}
const DEFAULT_HEADING_STATE = {"heading_deg":0}

function Indicators(){
    const [attitude, setAttitude] = useState(DEFAULT_ATTITUDE_STATE)
    const [heading, setHeading] = useState(DEFAULT_HEADING_STATE)

    useEffect( () => {
        
        const timer = setInterval(async () => {
            const res = await fetch(ATTITUDE_REST_ENDPOINT);
            const newAttitude = await res.json();
            const res2 = await fetch(HEADING_REST_ENDPOINT);
            const heading = await res2.json();
            setAttitude(newAttitude);
            setHeading(heading);
        }, 100);

        return () => clearInterval(timer);
    },[]);


  	return (
	  	<div id="indicators">
			<HeadingIndicator heading={heading.heading_deg} showBox={false} />

			<AttitudeIndicator roll={attitude.roll_deg} pitch={attitude.pitch_deg} showBox={false} />
	  	</div>
  	)
}

export default Indicators