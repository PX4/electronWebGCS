import React, { useState } from 'react';
import { useGamepads, GamepadsContext, GamepadsProvider } from 'react-gamepads';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';


function StartPositionControl() {
    
    fetch('http://localhost:8081/startPositionControl', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
}


export default function Gamepad() {
    const [gamepads, setGamepads] = useState({});
    const [commands, setCommands] = useState([0,0,0,0]);
    const [mcactive, setMCActive] = useState(false);

    useGamepads(gamepads => setGamepads(gamepads));
    useEffect(() => {
        const defaultGamepad = Object.keys(gamepads).length > 0 ? gamepads[0] : {};
        
        if ("axes" in defaultGamepad) {
          // Each analog stick is an "axe"
          // Axes are delivered in a array of 2 numbers per axe
          // The first is left and right
          // The second is top and bottom
          // If a number is -1 or 1, it's one side or the other
          
          setCommands([defaultGamepad.axes[0], (defaultGamepad.axes[1]*-1+1)/2, defaultGamepad.axes[2], defaultGamepad.axes[3]*-1]);
          console.log(commands);
          if (mcactive) {
            fetch('http://localhost:8081/setManualControl?x=' + commands[3].toFixed(2) +'&y=' + commands[2].toFixed(2) + '&z=' + commands[1].toFixed(2) + '&r=' + commands[0].toFixed(2), {
                method: 'GET',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                },
            });
        }   
        }
      }, [gamepads]);
    
  
    return (
        <Button variant={mcactive ? 'success' : 'dark'}
                onClick={() => {StartPositionControl(); setMCActive(!mcactive)}}><FontAwesomeIcon icon={faGamepad} color="white"/></Button>
    );
  }