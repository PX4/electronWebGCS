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

const HEADING_REST_ENDPOINT =  "http://localhost:8081/heading"
const DEFAULT_HEADING_STATE = {"heading_deg":0}

const MISSION_REST_ENDPOINT =  "http://localhost:8081/missionItems"
const DEFAULT_MISSION_STATE = []

function GpsCoords() {

    const [gpsPos, setGpsPos] = useState(DEFAULT_POSITION_STATE)
    const [heading, setHeading] = useState(DEFAULT_HEADING_STATE) 
    const [missionItems, setMissionItems] = useState(DEFAULT_MISSION_STATE)
    const [missionMarkers, setMissionMarkers] = useState([])
    
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
    useEffect(() => {
        const timeOut = setTimeout(async () => {
            
            const res = await fetch(MISSION_REST_ENDPOINT);
            const newMissionItems = await res.json();
            setMissionItems(newMissionItems);
            console.log(newMissionItems);
            
        }, 3000);
    }, []);

    useEffect(() => {
            if (map.current) {
            missionMarkers.map((marker) => {
                marker.remove();
            });
            setMissionMarkers([]);
            //console.log(item.x * 1/10000000, item.y * 1/10000000)
            missionItems.map((item) => {
                
                if(item.command == 16){
                    const marker = new mapboxgl.Marker({anchor: 'center', offset: [0,0]}).setLngLat([item.y * 1/10000000, item.x * 1/10000000]).addTo(map.current) ;
                    marker.getElement().innerHTML = '<div class="missionMarker">'+ item.seq + '</div>';
                    setMissionMarkers(missionMarkers => [...missionMarkers, marker]);
                }

                if(item.command == 22){
                    const marker = new mapboxgl.Marker({anchor: 'center', offset: [0,0]}).setLngLat([item.y * 1/10000000, item.x * 1/10000000]).addTo(map.current) ;
                    marker.getElement().innerHTML = '<div class="missionMarker">T</div>';
                    setMissionMarkers(missionMarkers => [...missionMarkers, marker]);
                }
                
            });
            console.log(missionMarkers);
            // array of marker coordinates with id 16
            const markerCoords = missionItems.filter(item => item.command == 16).map(item => [item.y * 1/10000000, item.x * 1/10000000]);
            
            map.current.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': markerCoords
                    }
                }
            });
            console.log(markerCoords);
            map.current.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                'line-join': 'round',
                'line-cap': 'round'
                },
                'paint': {
                'line-color': 'orangered',
                'line-width': 6,
                'line-opacity': 0.75
                }
                });


        }
    },[missionItems]);

    useEffect( () => {

        
        const timer = setInterval(async () => {
            const res = await fetch(GPS_REST_ENDPOINT);
            const newGpsPos = await res.json();
            setGpsPos(newGpsPos);
            const res2 = await fetch(HEADING_REST_ENDPOINT);
            const heading = await res2.json();
            setHeading(heading);
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
        
        mark.current = new mapboxgl.Marker({anchor: 'center', offset: [0,0]}).setLngLat([gpsPos.longitude_deg, gpsPos.latitude_deg]).addTo(map.current);
        // set marker icon to font awesome icon
        mark.current.getElement().innerHTML = '<div class="drone"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"/></svg></div>';
        
       

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
        mark.current.setRotation(heading.heading_deg - 45) 
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
