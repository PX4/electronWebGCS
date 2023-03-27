import React, {useRef, useState, useEffect } from 'react';

import styled from 'styled-components';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import omnivore from 'leaflet-omnivore';
import toGeoJSON from 'togeojson';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
//import  kmltext  from '../test_waypoints.kml';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsaG9uaWVzIiwiYSI6ImNrOGVvb2FiYzAzNGszbXRwdDEyNDlpcXoifQ.O-1QpnP-e9XEqRbCruhUwA';

const PrettyText = styled.label`
  color: darkred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid darkred;
  border-radius: 3px;
`;

const GPS_REST_ENDPOINT = "http://localhost:8081/gps"
const DEFAULT_POSITION_STATE = {"latitude_deg":0,"longitude_deg":0,"absolute_altitude_m":0,"relative_altitude_m":0}




function GpsCoords() {

    const [gpsPos, setGpsPos] = useState(DEFAULT_POSITION_STATE)
    
    const mapContainer = useRef(null);
    const map = useRef(null);
    var [lng, setLng] = useState(-121.996);
    var [lat, setLat] = useState(37.414);
    const [zoom, setZoom] = useState(15);
    const mark = useRef(null);
    const kml2 = useRef(null);

    
    const [goToPos, setGoToPos] = useState(DEFAULT_POSITION_STATE)
    const [showGoto, setShowGoto] = useState(false);
    const handleClose = () => setShowGoto(false);
    const handleCloseConfirm = () => {
        console.log(goToPos);
                fetch('http://localhost:8081/goto?longitude_deg=' + goToPos.lngLat.lng.toFixed(6) +'&latitude_deg=' + goToPos.lngLat.lat.toFixed(6) + '&altitude_m=20&yaw_deg=0', {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
        });
        setShowGoto(false);
    }
    const handleShow = (e) =>{ setGoToPos(e), setShowGoto(true);};

    useEffect( () => {
        
        const timer = setInterval(async () => {
            const res = await fetch(GPS_REST_ENDPOINT);
            const newGpsPos = await res.json();
            setGpsPos(newGpsPos);
        }, 100);

        return () => clearInterval(timer);
    },[]);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/danielhonies/cldao64zx000x01ruqnhgkhgi',
        center: [lng, lat],
        zoom: zoom
        });
        
        mark.current = new mapboxgl.Marker().setLngLat([gpsPos.longitude_deg, gpsPos.latitude_deg]).addTo(map.current);
        // set marker icon to font awesome icon
        
        
       

        // load kml into map
        /*var kmlLayer = omnivore.kml(kmltext).addTo(map.current);
        kmlLayer.eachLayer(function(layer) {
            if(layer.feature.geometry.type != "Point") return;
            console.log(layer.feature.geometry.coordinates[0]);
            new mapboxgl.Marker().setLngLat([layer.feature.geometry.coordinates[0], layer.feature.geometry.coordinates[1]]).addTo(map.current);
        });*/
        /*fetch(kmltext)
            .then(r => r.text())
            .then(text => {
                var kmldom = new DOMParser().parseFromString(text, 'text/xml');
                kml2.current = toGeoJSON.kml(kmldom);
                console.log(kml2.current);
                kml2.current.features.forEach(function(marker) {
                    if(marker.geometry.type != "Point") return;
                    console.log(marker.geometry.coordinates[0]);
                    new mapboxgl.Marker().setLngLat([marker.geometry.coordinates[0],marker.geometry.coordinates[1] ]).addTo(map.current);
                });
        });*/
        
        map.current.on('click', function(e)  {
            handleShow(e);
            });

        });


    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        mark.current.setLngLat([gpsPos.longitude_deg, gpsPos.latitude_deg]);
        // kml to geojson

        
    }, [gpsPos]);

    return (
        <div>
            
            <div>
                <div ref={mapContainer} className="map-container" />
            </div>
            <PrettyText id="coordinates">{gpsPos.latitude_deg.toFixed(4)}, {gpsPos.longitude_deg.toFixed(4)}, {gpsPos.absolute_altitude_m.toFixed(2)}</PrettyText>
            <Modal show={showGoto} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Arm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Confirm GoTo. Drone will move to Point you clicked on!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="dark" onClick={handleCloseConfirm}>
            GoTo!
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
        
    )
}

export default GpsCoords
