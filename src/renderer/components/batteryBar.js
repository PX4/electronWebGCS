import ProgressBar from 'react-bootstrap/ProgressBar';

function BatteryBar() {
  return (
    <ProgressBar >
        <ProgressBar striped variant="danger" now={15} key={1} animated />
        <ProgressBar variant="warning" now={20} key={2} animated />
        <ProgressBar striped variant="success" now={65} key={3} label={'15 Min 30s'}  animated />
    </ProgressBar>
  );
}

export default BatteryBar;