import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import BatteryDisplay from './batteryDisplay'
import GPSInfo from './satellite';
import RSSIInfo from './rssi';
import FlightMode from './flightMode';
function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      
      <Nav className="me-auto">
        <NavDropdown title="Fly" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Settings</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Logs
              </NavDropdown.Item>
            </NavDropdown>

        <FlightMode/>
        <RSSIInfo />
        <GPSInfo />
        
      
        </Nav>
        
        <BatteryDisplay />
    </Navbar>
  );
}

export default NavBar;