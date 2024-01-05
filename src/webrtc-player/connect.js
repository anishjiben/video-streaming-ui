/**
 * Copyright (C) 2023, Axis Communications AB, Lund, Sweden
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const sessionId = "1";
const context = "1";
var targetId;
var orgId;
var access_token;
var init_session_params;
var ws_connection;
var start_time;
var pc;
var has_displayed_playing_message = false;
const remoteStream = new MediaStream();
var local_stream = null;


function getLocalStream()
{
    // try to get approval from user to use microphone
    if (navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(
          { video : false, audio : true });
    } else {
        console.log("No media devices")
    }
}

function startSession()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    targetId = urlParams.get('targetId');
    orgId = urlParams.get('orgId');

    init_session_params = {"type":"live"};

    if((urlParams.get('videoReceive') && urlParams.get('videoReceive') == "true")
        || !urlParams.get('videoReceive')) {

        // enable video (on by default if not disabled)
        init_session_params["videoReceive"] = {};

        width = parseInt(urlParams.get('width'));
        if(!isNaN(width)) {
            init_session_params["videoReceive"]["width"] = width;
        }

        height = parseInt(urlParams.get('height'));
        if(!isNaN(height)) {
            init_session_params["videoReceive"]["height"] = height;
        }

        framerate = parseInt(urlParams.get('framerate'));
        if(!isNaN(framerate)) {
            init_session_params["videoReceive"]["framerate"] = framerate;
        }

        channel = parseInt(urlParams.get('channel'));
        if(!isNaN(channel)) {
            init_session_params["videoReceive"]["channel"] = channel;
        }

        if ((urlParams.get('adaptive') &&
             urlParams.get("adaptive").toLowerCase() == "true")) {
            init_session_params["videoReceive"]["adaptive"] = true;
        }

        if ((urlParams.get('experimentalQualityOfService') &&
             urlParams.get("experimentalQualityOfService").toLowerCase() ==
               "true")) {
            init_session_params["videoReceive"]["experimentalQualityOfService"] =
              true;
        }

        experimental_key_frame_interval =
          parseInt(urlParams.get('experimentalKeyframeInterval'));
        if (!isNaN(experimental_key_frame_interval)) {
            init_session_params["videoReceive"]["experimentalKeyframeInterval"] =
              experimental_key_frame_interval;
        }

        if (urlParams.get('experimentalRtx')) {
            if (urlParams.get("experimentalRtx").toLowerCase() == "true") {
                init_session_params["videoReceive"]["experimentalRtx"] = true;
            } else if (urlParams.get("experimentalRtx").toLowerCase() ==
                       "false") {
                init_session_params["videoReceive"]["experimentalRtx"] = false;
            }
        }

        if ((urlParams.get('rtx') &&
             urlParams.get("rtx").toLowerCase() == "true")) {
            init_session_params["videoReceive"]["rtx"] = true;
        }
    }

    if (urlParams.get('audioReceive') && urlParams.get('audioReceive') == "true") {
        // enable audio from device to client
        init_session_params["audioReceive"] = {};
    }

    if (urlParams.get('audioSend') && urlParams.get('audioSend') == "true") {
        // enable audio from client to device
        init_session_params["audioSend"] = {};
    }

    if (urlParams.get('remoteURL')) {
        // special experimental feature
        init_session_params["remote_url"] = urlParams.get('remoteURL');
    }

    // use the demo signaling server by default
    signalingServerURL = "wss://signaling.remotestreaming.axis.cloud/client";
    if (urlParams.get('signalingServer')) {
        signalingServerURL = urlParams.get('signalingServer');
        // as a convenience, if the caller just said 'prod', put in the proper
        // address for the prod signaling server.
        // by specifying "prod-nginx" or "stage-nginx" we assume that the web
        // server hosting this script is an nginx server configured with
        // `nginx.conf`.
        if(signalingServerURL == "prod") {
            signalingServerURL = "wss://signaling.prod.webrtc.connect.axis.com/client";
        } else if (signalingServerURL == "prod-nginx") {
            signalingServerURL =
              "wss://" + location.host + "/prod-signal/client";
        } else if (signalingServerURL == "stage-nginx") {
            signalingServerURL =
              "wss://" + location.host + "/stage-signal/client";
        } else {
            // use whatever was passed, but make sure it ends with /client
            if(!(signalingServerURL.endsWith("/client") || signalingServerURL.endsWith("/client/"))) {
                // need to add the /client suffix, but avoid stacking slashes
                if(signalingServerURL.endsWith("/")) {
                    signalingServerURL += "client";
                } else {
                    signalingServerURL += "/client";
                }
                // (yeah, I know a web developer could have done this better)
            }
        }
    }
    access_token = urlParams.get('accessToken');
    if (access_token != null) {
        signalingServerURL += "?authorization=Bearer%20" + access_token;
    }

    appendToLog("startSession: targetId = " + targetId +
                ", signaling server = " + signalingServerURL);
    setTopText("<B>Connecting...</B>");

    if (init_session_params["audioSend"]) {
        // need to await approval from user to use microphone
        getLocalStream()
          .then((stream) => {
              appendToLog("Adding local audio stream");
              local_stream = stream;
              // ok, now go ahead and connect our websocket
              connectWebsocket();
              return stream;
          })
          .catch(appendToLog);
    } else {
        // no need to wait for microphone permission
        connectWebsocket();
    }
}

function connectWebsocket()
{
    ws_connection = new WebSocket(signalingServerURL);
    ws_connection.onopen = onWebsocketOpen;
    ws_connection.onerror = onWebsocketError;
    ws_connection.onclose = onWebsocketClose;
    ws_connection.onmessage = gotSignalingMessage;
}

function onWebsocketOpen(evt)
{
    console.log("WebSocket Open: ", evt);
    ws_connection.send("{\"type\":\"hello\", \"id\":\"noid\"}");
    start_time = (new Date()).getTime();

    sendSignalingMessage("initSession", {
        "apiVersion" : "1.0",
        "type" : "request",
        "sessionId" : sessionId,
        "method" : "initSession",
        "context" : context,
        "params" : init_session_params
    });
}

function onWebsocketError(evt)
{
    console.log("WebSocket Error: ", evt);
    appendToLog(
      "onWebsocketError: Server connection error. Running Chrome with correct --explicitly-allowed-ports option?");
    setTopText(
      "<B>Could not connect to signaling server. See details below.</B>");
}

function onWebsocketClose(evt)
{
    console.log("WebSocket Close: ", evt);
    appendToLog("onWebsocketClose: Connection to server disconnected");
}

function badSignalingMessage()
{
    appendToLog("<FONT color=\"RED\">ERROR: Bad signaling message.</FONT>");
    setTopText(
      "<B>Got an unexpected signaling message, please see log below for details.</B>");
}

function handleDataPartOfSignalingMessage(data_part)
{
    if (!data_part["apiVersion"]) {
        badSignalingMessage();
        return;
    }

    if (!data_part["type"]) {
        badSignalingMessage();
        return;
    }
    type = data_part["type"];

    if (!data_part["method"]) {
        badSignalingMessage();
        return;
    }
    method = data_part["method"];

    if (type == "response" && data_part["data"]) {
        if (method == "addIceCandidate") {
            // this is just an ack from the target, ignore
            return;
        } else if (method == "initSession") {
            // this is just an ack from the target, ignore
            return;
        } else if (method == "setSdpAnswer") {
            // this is just an ack from the target, ignore
            return;
        }
    } else if (type == "request" && data_part["params"]) {
        params = data_part["params"];
        if (method == "setSdpOffer") {
            handleSDPOfferFromTarget(params);
            return;
        } else if (method == "addIceCandidate") {
            handleICECandidateFromTarget(params);
            return;
        }
    }

    // message was not handled above
    badSignalingMessage();
    return;
}

function gotSignalingMessage(evt)
{
    appendToLog("<FONT color=\"BLUE\">gotSignalingMessage</FONT>: " + evt.data);
    s = evt.data.replace("\r\n", "\\r\\n");
    m = JSON.parse(s);

    if (!m["type"]) {
        badSignalingMessage();
        return;
    }
    type = m["type"];

    if (type == "hello") {
        // just an ack of our hello-message, do nothing
        return;
    } else if (type == "initSession") {
        createPeerConnection(m);
        return;
    } else if (type == "signaling" && m["data"]) {
        handleDataPartOfSignalingMessage(m["data"]);
        return;
    }

    // message was not handled above
    badSignalingMessage();
    return;
}

function handleSDPOfferFromTarget(sdp)
{
    pc.setRemoteDescription(sdp)
      .then(function() { return pc.createAnswer(); })
      .then(function(answer) { return pc.setLocalDescription(answer); })
      .then(function() {
          sendSignalingMessage("signaling", {
              "apiVersion" : "1.0",
              "type" : "request",
              "sessionId" : sessionId,
              "method" : "setSdpAnswer",
              "context" : sessionId,
              "params" : pc.localDescription
          });
      });
}

function handleICECandidateFromTarget(c)
{
    pc.addIceCandidate(new RTCIceCandidate(c))
      .catch(function(err) { appendToLog("ERROR: addIceCandidate: " + err); });
}

function sendSignalingMessage(type, data)
{
    s = JSON.stringify({
        "type" : type,
        "targetId" : targetId,
        "orgId" : orgId,
        "accessToken" : access_token,
        "data" : data
    });
    appendToLog("<FONT color=\"BLUE\">sendSignalingMessage</FONT>: " + s);
    ws_connection.send(s);
}

function createPeerConnection(m)
{
    ice_servers = [];
    if (m["stunServers"]) {
        stun_url = m["stunServers"][0]["urls"][0]; // assume existence
        if (stun_url.startsWith("stun://")) {
            stun_url = "stun:" + stun_url.substr(7);
        }
        // assume no username or password
        appendToLog("STUN server: " + stun_url);
        ice_servers.push({ urls : stun_url });
    }
    for (i = 0; i < m["turnServers"].length; ++i) {
        turn_server = m["turnServers"][i];
        for (j = 0; j < turn_server["urls"].length; ++j) {
            turn_url = turn_server["urls"][j];
            if (turn_url.startsWith("turn://")) {
                turn_url = "turn:" + turn_url.substr(7);
            } else if (turn_url.startsWith("turns://")) {
                turn_url = "turns:" + turn_url.substr(8);
            }
            turn_username = turn_server["username"];
            turn_password = turn_server["password"];
            appendToLog("TURN server: " + turn_url);
            ice_servers.push({
                urls : turn_url,
                username : turn_username,
                credential : turn_password
            });
        }
    }

    pc = new RTCPeerConnection({ iceServers : ice_servers });
    pc.onicecandidate = onICECandidate;
    pc.ontrack = onTrack;

    if (init_session_params["audioSend"]) {
        if (local_stream) {
            appendToLog("Adding local audio stream");
            pc.addStream(local_stream);
        } else {
            appendToLog(
              "<FONT color=\"RED\">ERROR: No local stream to add to peer connection.</FONT>");
        }
    }

    videopanel = document.getElementById("videopanel");
    videopanel.srcObject = remoteStream;
    videopanel.onplay = onPlay;
    videopanel.addEventListener('click', function() {
        appendToLog("video click when videopanel.paused=" + videopanel.paused);
        if (videopanel.paused) {
            videopanel.play();
        } else {
            videopanel.pause();
        }
    });

    // just more logging:
    videopanel.onplaying = function() { appendToLog("video onPlay"); };
    videopanel.onpause = function() { appendToLog("video onPause"); };
    videopanel.onended = function() { appendToLog("video onEnded"); };
    videopanel.onerror = function() { appendToLog("video onError"); };
    videopanel.onstalled = function() { appendToLog("video onStalled"); };

    pc.onconnectionstatechange = function() {
        appendToLog("onConnectionStateChange: " + pc.connectionState);
    };
    pc.oniceconnectionstatechange = function() {
        appendToLog("onICEConnectionStateChange: " + pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected') {
            setTopText(
              "<B>ICE Connected!</B> If video does not auto-play, click on video area to toggle play and pause.");
        }
    };
    pc.onicegatheringstatechange = function() {
        appendToLog("onICEGatheringStateChange: " + pc.iceGatheringState);
    };
    pc.onsignalingstatechange = function() {
        appendToLog("onSignalingStateChange: " + pc.signalingState);
    };
}

function onICECandidate(evt)
{
    if (evt.candidate) {
        if (evt.candidate["candidate"].length > 0) {
            sendSignalingMessage("signaling", {
                "apiVersion" : "1.0",
                "type" : "request",
                "sessionId" : sessionId,
                "method" : "addIceCandidate",
                "context" : sessionId,
                "params" : evt.candidate
            });
        }
    } else {
        appendToLog("Finished sending my own ICE candidates.");
    }
}

function onTrack(evt)
{
    appendToLog("ontrack: Incoming media stream");
    remoteStream.addTrack(evt.track, remoteStream);
    document.getElementById("videopanel").srcObject = evt.streams[0];
}

function onPlay()
{
    if (!has_displayed_playing_message) {
        play_time = (new Date()).getTime();
        appendToLog("video onPlay: <B>Playing video at " +
                    (play_time - start_time) / 1000.0 +
                    " seconds since sending initSession</B>");
        let top_msg =
          "<B>Connected, playing video.</B> Click video area to toggle pause/play.";
        if (init_session_params["audioReceive"]) {
            top_msg +=
              "<BR><FONT color=\"RED\"><B>Please note: To hear audio, you must right-click on the video, select 'Show controls' and click the Unmute button.</B></FONT>";
        }
        if (init_session_params["audioSend"]) {
            top_msg +=
              "<BR><FONT color=\"RED\"><B>Please note: To send audio, you must have accepted the browsers request to allow your microphone being used.</B></FONT>";
        }
        setTopText(top_msg);
        has_displayed_playing_message = true;
    }
}