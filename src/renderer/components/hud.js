import React, {useRef, useState, useEffect } from 'react';

import DroneHud from "react-drone-hud";

const ATTITUDE_REST_ENDPOINT = "http://localhost:8081/attitudeEuler"
const HEADING_REST_ENDPOINT =  "http://localhost:8081/heading"
const DEFAULT_ATTITUDE_STATE = {"roll_deg":0,"pitch_deg":0,"yaw_deg":0}
const DEFAULT_HEADING_STATE = {"heading_deg":0}

function Hud(){
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
        }, 30);

        return () => clearInterval(timer);
    },[]);


  	return (
	  	
                <DroneHud
        
        pitch={attitude.pitch_deg} //degrees
        roll={attitude.roll_deg} //degrees, -ve -> left bank
        heading={heading.heading_deg} //degrees, optional
        airspeed={10} //left-side number, optional
        airspeedTickSize={5} //increments to use for vertical gauge, optional
        altitude={200} //right-side number, optional
        altitudeTickSize={10} //optional
    />
	  	
  	)
}

export default Hud