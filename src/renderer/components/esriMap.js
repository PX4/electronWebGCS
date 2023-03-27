// react component for esri arcgis map
import React, { useRef, useEffect, useState} from 'react';
import { loadModules, loadCss } from 'esri-loader';


const GPS_REST_ENDPOINT = "http://localhost:8081/gps"
const DEFAULT_POSITION_STATE = {"latitude_deg":0,"longitude_deg":0,"absolute_altitude_m":0,"relative_altitude_m":0}
const HEADING_REST_ENDPOINT =  "http://localhost:8081/heading"
const DEFAULT_HEADING_STATE = {"heading_deg":0}

// react component for esri arcgis map
function EsriMap() {

    const [gpsPos, setGpsPos] = useState(DEFAULT_POSITION_STATE)
    const [view, setView] = useState(null);
    const [heading, setHeading] = useState(DEFAULT_HEADING_STATE)
    useEffect(() => {

        const timer = setInterval(async () => {
            const res = await fetch(GPS_REST_ENDPOINT);
            const newGpsPos = await res.json();
            const res2 = await fetch(HEADING_REST_ENDPOINT);
            const heading2 = await res2.json();
            setHeading(heading2);
            setGpsPos(newGpsPos);
            view.goTo({position: [newGpsPos.longitude_deg, newGpsPos.latitude_deg, 20], heading: heading.heading_deg }, {speedFactor: 100});
           
        }, 100);

    return () => clearInterval(timer);

    }, [gpsPos]);

    const mapEl = useRef(null);
  
    // use a side effect to create the map after react has rendered the DOM
    useEffect(
      () => {
        loadCss();
        // define the view here so it can be referenced in the clean up function
   
        // the following code is based on this sample:
        // https://developers.arcgis.com/javascript/latest/sample-code/webmap-basic/index.html
        // first lazy-load the esri classes
        loadModules(["esri/views/SceneView", "esri/Map"], {
          css: true
        }).then(([SceneView, Map]) => {
          // then we load a web map from an id
          const webmap = new Map({
            basemap: "osm",
            // buildings layer
            ground: "world-elevation",
            buildings: "true"

            
          });
  
          // and we show that map in a container
        const view2 = new SceneView({
            map: webmap,
            camera: {
                position: [
                  8.22216751,
                  46.48873434,
                  13032241.44725,
                ],
                heading: 0.00,
                tilt: 90,
              },
            // use the ref as a container
            container: mapEl.current
          });
          setView(view2);
        });
        return () => {
          // clean up the map view
          if (!!view) {
            view.destroy();
            view = null;
          }
        };
        
      },
      // only re-load the map if the id has changed
      []
    );
    return <div style={{ height: 400, width: 600 }} ref={mapEl} />;

  /*return (<Scene
    style={{ width: '70vh', height: '50vh' }}
    mapProperties={{ basemap: 'satellite' }}
    viewProperties={{
        camera: {
      position: [
        gpsPos.longitude_deg,
        gpsPos.latitude_deg,
        20,
      ],
      heading: 0.00,
      tilt: 0.70,
    }
    }}/>);*/
}

export default EsriMap;
