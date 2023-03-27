var cors = require('cors');

var express = require('express')
var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());


const UNSAFE_FRONT_END_URL= "*"; // Allow all origins

app.use(cors(
        { 
            origin: UNSAFE_FRONT_END_URL,
            methods: ["GET", "POST"] 
        }));

const http = require('http');
const server = http.createServer(app);

var MAVSDKDrone = require('./mavsdk-grpc.js')
var drone = new MAVSDKDrone()

app.get('/arm', function(req, res){

    console.log("Hellooo from arm!")
    
    drone.Arm()

    res.sendStatus(200);

});

app.get('/disarm', function(req, res){

    console.log("Hellooo from disarm!")
    
    drone.Disarm()

    res.sendStatus(200);

});

app.get('/takeoff', function(req, res){

    console.log("Hellooo from takeoff!")
    
    drone.Takeoff()

    res.sendStatus(200);

});

app.get('/land', function(req, res){

    console.log("Hellooo from land!")
    
    drone.Land()

    res.sendStatus(200);

});

app.get('/returnToLaunch', function(req, res){
    
    
    drone.ReturnToLaunch()

    res.sendStatus(200);
});

app.get('/gps', function(req, res){

    //console.log("Hellooo from gps!")
    res.send(drone.position)
});

app.get('/gpsInfo', function(req, res){

    //console.log("Hellooo from gps!")
    res.send(drone.gpsInfo)
});

app.get('/battery', function(req, res){
    //console.log("Hellooo from battery!")
    res.send(drone.battery)
});

app.get('/attitudeEuler', function(req, res){
    
    res.send(drone.attitudeEuler)
});
app.get('/heading', function(req, res){
    res.send(drone.heading) 
});
app.get('/goto', function(req, res){

    console.log(req.query)
    drone.Goto(req.query.longitude_deg, req.query.latitude_deg, req.query.altitude_m, req.query.yaw_deg);
    res.sendStatus(200);
});

app.get('/health', function(req, res){
   
    res.send(drone.health)

});

app.get('/armed', function(req, res){

    res.send(drone.armed)

});

app.get('/inAir', function(req, res){

    res.send(drone.inAir)

});

app.get('/rcStatus', function(req, res){

    res.send(drone.rcStatus)

});

server.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
});
