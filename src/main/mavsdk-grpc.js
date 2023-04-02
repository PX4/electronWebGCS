const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
import path from 'path';


const MAVSDK_ACTION_PROTO_PATH = path.join(path.dirname(require.resolve('mavsdk-proto')), '/protos/action/action.proto');
console.log(MAVSDK_ACTION_PROTO_PATH);
const ACTION_PACKAGE_DEFINITION = protoLoader.loadSync(
    MAVSDK_ACTION_PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const MAVSDK_MISSION_PROTO_PATH = path.join(path.dirname(require.resolve('mavsdk-proto')), '/protos/mission/mission.proto');
console.log(MAVSDK_MISSION_PROTO_PATH);
const MISSION_PACKAGE_DEFINITION = protoLoader.loadSync(
    MAVSDK_MISSION_PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const MAVSDK_MANUAL_CONTROL_PROTO_PATH = path.join(path.dirname(require.resolve('mavsdk-proto')), '/protos/manual_control/manual_control.proto');
console.log(MAVSDK_MANUAL_CONTROL_PROTO_PATH);
const MANUAL_CONTROL_PACKAGE_DEFINITION = protoLoader.loadSync(
    MAVSDK_MANUAL_CONTROL_PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const MAVSDK_LOG_FILES_PROTO_PATH = path.join(path.dirname(require.resolve('mavsdk-proto')), '/protos/log_files/log_files.proto');
console.log(MAVSDK_LOG_FILES_PROTO_PATH);
const LOG_FILES_PACKAGE_DEFINITION = protoLoader.loadSync(
    MAVSDK_LOG_FILES_PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

var MAVSDK_TELEMETRY_PROTO_PATH = path.join(path.dirname(require.resolve('mavsdk-proto')), '/protos/telemetry/telemetry.proto');
console.log(MAVSDK_TELEMETRY_PROTO_PATH);
const TELEMTRY_PACKAGE_DEFINITION = protoLoader.loadSync(
    MAVSDK_TELEMETRY_PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const GRPC_HOST_NAME="127.0.0.1:50000";

class MAVSDKDrone {

    constructor(){
        this.Action = grpc.loadPackageDefinition(ACTION_PACKAGE_DEFINITION).mavsdk.rpc.action;
        this.ActionClient = new this.Action.ActionService(GRPC_HOST_NAME, grpc.credentials.createInsecure());

        this.Telemetry = grpc.loadPackageDefinition(TELEMTRY_PACKAGE_DEFINITION).mavsdk.rpc.telemetry;
        this.TelemetryClient = new this.Telemetry.TelemetryService(GRPC_HOST_NAME, grpc.credentials.createInsecure());

        this.ManualControl = grpc.loadPackageDefinition(MANUAL_CONTROL_PACKAGE_DEFINITION).mavsdk.rpc.manual_control;
        this.ManualControlClient = new this.ManualControl.ManualControlService(GRPC_HOST_NAME, grpc.credentials.createInsecure());

        this.Mission = grpc.loadPackageDefinition(MISSION_PACKAGE_DEFINITION).mavsdk.rpc.mission;
        this.MissionClient = new this.Mission.MissionService(GRPC_HOST_NAME, grpc.credentials.createInsecure());

        this.LogFiles = grpc.loadPackageDefinition(LOG_FILES_PACKAGE_DEFINITION).mavsdk.rpc.log_files;
        this.LogFilesClient = new this.LogFiles.LogFilesService(GRPC_HOST_NAME, grpc.credentials.createInsecure());

        this.position = {} // Initialize to an empty object
        this.attitudeEuler = {} // Initialize to an empty object
        this.heading = {}
        this.gpsInfo = {}
        this.battery = {}
        this.rcStatus = {}
        this.inAir = {}
        this.armed = {}
        this.flightMode = {}
        this.logs = []
        this.SubscribeToBattery()
        this.SubscribeToGps()
        this.SubscribeToAttitudeEuler()
        this.SubscribeToHeading()
        this.SubscribeToGpsInfo()
        this.SubscribeToArmed()
        this.SubscribeToInAir()
        this.SubscribeToHealth()
        this.SubscribeToRcStatus()
        this.SubscribeToFlightMode()
        this.GetLogEntries()
    }

    

    DownloadLogFile(logEntry){
        
        this.LogFilesClient.DownloadLogFile({entry: this.logs[logEntry], path: 'logs/' + this.logs[logEntry].date + '.ulg'}, function(err, DownloadLogFileResponse){
            if(err){
                console.log("Unable to download log file: ", err);
                return;
            }
            console.log("Download log file: ", DownloadLogFileResponse);
        });
    }

    GetLogEntries(){
        const self = this;
        this.LogFilesClient.GetEntries({}, function(err, GetEntriesResponse){
            if(err){
                console.log("Unable to get log entries: ", err);
                return;
            }
            
            self.logs = GetEntriesResponse.entries;
            console.log("Log entries: ", self.logs);
        });
    }

    StartMission(){
        this.MissionClient.StartMission({}, function(err, StartMissionResponse){
            if(err){
                console.log("Unable to start mission: ", err);
                return;
            }
        });
    }

    PauseMission(){
        this.MissionClient.PauseMission({}, function(err, PauseMissionResponse){
            if(err){
                console.log("Unable to pause mission: ", err);
                return;
            }
        });
    }
    

    StartPositionControl()
    {
        this.ManualControlClient.StartPositionControl({}, function(err, StartPositionControlResponse){
            if(err){
                console.log("Unable to start position control: ", err);
                return;
            }
        });
    }

    SetManualControlInput(x, y, z, r){
        this.ManualControlClient.SetManualControlInput({x: x, y: y, z: z, r: r}, function(err, SetManualControlInputResponse){
            if(err){
                console.log("Unable to set manual control: ", err);
                return;
            }
        });
    }

    Arm()
    {
        this.ActionClient.arm({}, function(err, actionResponse){
            if(err){
                console.log("Unable to arm drone: ", err);
                return;
            }
        });
    }

    Disarm()
    {
        this.ActionClient.disarm({}, function(err, actionResponse){
            if(err){
                console.log("Unable to disarm drone: ", err);
                return;
            }
        });
    }

    Takeoff()
    {
        this.ActionClient.takeoff({}, function(err, actionResponse){
            if(err){
                console.log("Unable to disarm drone: ", err);
                return;
            }
        });
    }

    Land()
    {
        this.ActionClient.land({}, function(err, actionResponse){
            if(err){
                console.log("Unable to land drone: ", err);
                return;
            }
        });
    }
    ReturnToLaunch(){
        this.ActionClient.returnToLaunch({}, function(err, actionResponse){
            if(err){
                console.log("Unable to return to launch: ", err);
                return;
            }
        });
    }
    Goto(longitude_deg, latitude_deg, altitude_m, yaw_deg)
    {
        this.ActionClient.GotoLocation({
            latitude_deg: parseFloat(latitude_deg),
            longitude_deg: parseFloat(longitude_deg),
            absolute_altitude_m: parseFloat(altitude_m),
            yaw_deg: parseFloat(yaw_deg)
        }, function(err, actionResponse){
            console.log(actionResponse);
            if(err){
                console.log("Unable to go to: ", err);
                return;
            }
        });
    }

    SubscribeToFlightMode(){
        const self = this;

        this.FlightModeCall = this.TelemetryClient.subscribeFlightMode({});
        this.FlightModeCall.on('data', function(flightModeResponse){
            self.flightMode = flightModeResponse
            return;
        });

        this.FlightModeCall.on('end', function() {
            console.log("SubscribeFlightMode request ended");
            return;
        });

        this.FlightModeCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.FlightModeCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }


    SubscribeToGps()
    {
        const self = this;

        this.GpsCall = this.TelemetryClient.subscribePosition({});

        this.GpsCall.on('data', function(gpsInfoResponse){
            self.position = gpsInfoResponse.position
            return; 
        });

        this.GpsCall.on('end', function() {
            console.log("SubscribePosition request ended");
            return;
        });

        this.GpsCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.GpsCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }

    SubscribeToBattery(){
        const self = this;

        this.BatteryCall = this.TelemetryClient.subscribeBattery({});

        this.BatteryCall.on('data', function(batteryInfoResponse){
            self.battery = batteryInfoResponse.battery
            return; 
        });

        this.BatteryCall.on('end', function() {
            console.log("SubscribeBattery request ended");
            return;
        });

        this.BatteryCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.BatteryCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }
    SubscribeToGpsInfo()
    {
        const self = this;

        this.GpsInfoCall = this.TelemetryClient.subscribeGpsInfo({});

        this.GpsInfoCall.on('data', function(gpsInfoResponse){
            self.gpsInfo = gpsInfoResponse.gps_info
            return; 
        });

        this.GpsInfoCall.on('end', function() {
            console.log("SubscribeGpsInfo request ended");
            return;
        });

        this.GpsInfoCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.GpsInfoCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }

    SubscribeToAttitudeEuler()
    {
        const self = this;

        this.AttitudeEulerCall = this.TelemetryClient.subscribeAttitudeEuler({});

        this.AttitudeEulerCall.on('data', function(attitudeEulerResponse){
            self.attitudeEuler = attitudeEulerResponse.attitude_euler
            return; 
        });

        this.AttitudeEulerCall.on('end', function() {
            console.log("SubscribeAttitudeEuler request ended");
            return;
        });

        this.AttitudeEulerCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.AttitudeEulerCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }

    SubscribeToHeading()
    {
        const self = this;

        this.HeadingCall = this.TelemetryClient.subscribeHeading({});

        this.HeadingCall.on('data', function(headingResponse){
            self.heading = headingResponse.heading_deg
            return; 
        });

        this.HeadingCall.on('end', function() {
            console.log("SubscribeHeading request ended");
            return;
        });

        this.HeadingCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.HeadingCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }

    SubscribeToRcStatus()
    {
        const self = this;

        this.RcStatusCall = this.TelemetryClient.subscribeRcStatus({});

        this.RcStatusCall.on('data', function(rcStatusResponse){
            //console.log(rcStatusResponse);
            self.rcStatus = rcStatusResponse.rc_status
            return; 
        });

        this.RcStatusCall.on('end', function() {
            console.log("SubscribeRcStatus request ended");
            return;
        });

        this.RcStatusCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.RcStatusCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }
    SubscribeToArmed(){
        const self = this;

        this.ArmedCall = this.TelemetryClient.subscribeArmed({});

        this.ArmedCall.on('data', function(armedResponse){
            self.armed = armedResponse
            return; 
        });

        this.ArmedCall.on('end', function() {
            console.log("SubscribeArmed request ended");
            return;
        });

        this.ArmedCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.ArmedCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }
    SubscribeToHealth(){
        const self = this;

        this.HealthCall = this.TelemetryClient.subscribeHealth({});

        this.HealthCall.on('data', function(healthResponse){
            self.health = healthResponse.health
            return; 
        });

        this.HealthCall.on('end', function() {
            console.log("SubscribeHealth request ended");
            return;
        });

        this.HealthCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.HealthCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }
    SubscribeToInAir(){
        const self = this;

        this.InAirCall = this.TelemetryClient.subscribeInAir({});

        this.InAirCall.on('data', function(inAirResponse){
            self.inAir = inAirResponse
            return; 
        });

        this.InAirCall.on('end', function() {
            console.log("SubscribeInAir request ended");
            return;
        });

        this.InAirCall.on('error', function(e) {
            console.log(e)
            return;
        });
        this.InAirCall.on('status', function(status) {
            console.log(status);
            return;
        });
    }
}

module.exports = MAVSDKDrone;