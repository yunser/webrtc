<template>
    <my-page title="WebRTC" :page="page">
        <div class="common-container container">
            <video id="localVideo" autoplay playsinline></video>
            <video id="remoteVideo" autoplay playsinline></video>

            <div>
                <button id="startButton" @click="start">Start</button>
                <button id="callButton" @click="call">Call</button>
                <button id="hangupButton" @click="hangUp">Hang Up</button>
            </div>
            
            <div class="btns">
                <!-- <ui-raised-button class="btn" primary label="录制" @click="record" v-if="recordVisible" />
                <ui-raised-button class="btn" secondary label="停止" @click="stop" v-if="stopVisible" />
                <ui-raised-button class="btn" label="下载" @click="download" v-if="downloadVisible" /> -->
            </div>
        </div>
  </my-page>
</template>

<script>
/* eslint-disable */
function trace(text) {
  text = text.trim();
  const now = (window.performance.now() / 1000).toFixed(3);

  console.log(now, text);
}


export default {
    data() {
        return {
            isStart: false,
            recordVisible: true,
            stopVisible: false,
            downloadVisible: false,
            page: {
                menu: [
                    {
                        type: "icon",
                        icon: "apps",
                        href: "https://app.yunser.com?utm_source=edu",
                        target: "_blank",
                        title: "应用"
                    }
                ]
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {


        },
        start() {
            const localVideo = document.querySelector('video')
            this.localStream
            this.remoteVideo = document.getElementById('remoteVideo')

            navigator.mediaDevices.getUserMedia({
                video: true,
            })
            .then(mediaStream => {
                this.localStream = mediaStream
                localVideo.srcObject = mediaStream
            }).catch(error => {
                console.log('navigator.getUserMedia error: ', error)
            });
        },
        hangUp() {
            this.localPeerConnection.close();
            this.remotePeerConnection.close();
            this.localPeerConnection = null;
            this.remotePeerConnection = null;
            // this.hangupButton.disabled = true;
            // this.callButton.disabled = false;
            trace('Ending call.');
        },
        call() {
            // trace('Starting call.');
            console.log('Starting call')
            this.startTime = window.performance.now()

            // Get local media stream tracks.
            const videoTracks = this.localStream.getVideoTracks()
            const audioTracks = this.localStream.getAudioTracks()
            if (videoTracks.length > 0) {
                trace(`Using video device: ${videoTracks[0].label}.`)
            }
            if (audioTracks.length > 0) {
                trace(`Using audio device: ${audioTracks[0].label}.`)
            }

            const servers = null;  // Allows for RTC server configuration.
            let localPeerConnection = this.localPeerConnection
            // Create peer connections and add behavior.
            localPeerConnection = new RTCPeerConnection(servers);
            trace('Created local peer connection object localPeerConnection.');
            
            function getOtherPeer(peerConnection) {
                return (peerConnection === localPeerConnection) ?
                    remotePeerConnection : localPeerConnection;
            }

            function getPeerName(peerConnection) {
                return (peerConnection === localPeerConnection) ?
                    'localPeerConnection' : 'remotePeerConnection';
            }

            function setRemoteDescriptionSuccess(peerConnection) {
                setDescriptionSuccess(peerConnection, 'setRemoteDescription');
            }

            

function setDescriptionSuccess(peerConnection, functionName) {
  const peerName = getPeerName(peerConnection);
  trace(`${peerName} ${functionName} complete.`);
}

// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
  trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
};

            function handleConnectionFailure(peerConnection, error) {
  trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}

            const handleConnection = event => {
                const peerConnection = event.target;
                const iceCandidate = event.candidate;

                if (iceCandidate) {
                    const newIceCandidate = new RTCIceCandidate(iceCandidate);
                    const otherPeer = getOtherPeer(peerConnection);

                    otherPeer.addIceCandidate(newIceCandidate)
                    .then(() => {
                        handleConnectionSuccess(peerConnection);
                    }).catch((error) => {
                        handleConnectionFailure(peerConnection, error);
                    });

                    trace(`${getPeerName(peerConnection)} ICE candidate:\n` +
                        `${event.candidate.candidate}.`);
                }
            }

            const handleConnectionChange = (event) => {
                const peerConnection = event.target;
                console.log('ICE state change event: ', event);
                trace(`${getPeerName(peerConnection)} ICE state: ` +
                        `${peerConnection.iceConnectionState}.`);
                }

            const gotRemoteMediaStream = (event) => {
                const mediaStream = event.stream;
                this.remoteVideo.srcObject = mediaStream;
                this.remoteStream = mediaStream;
                trace('Remote peer connection received remote stream.');
            }

            localPeerConnection.addEventListener('icecandidate', handleConnection);
            localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);
            let remotePeerConnection = this.remotePeerConnection
            remotePeerConnection = new RTCPeerConnection(servers);
            trace('Created remote peer connection object remotePeerConnection.');

            remotePeerConnection.addEventListener('icecandidate', handleConnection);
            remotePeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);
            remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

            // Add local stream to connection and create offer to connect.
            localPeerConnection.addStream(this.localStream);
            trace('Added local stream to localPeerConnection.');

            trace('localPeerConnection createOffer start.');

            function createdOffer(description) {
                trace(`Offer from localPeerConnection:\n${description.sdp}`);

                trace('localPeerConnection setLocalDescription start.');
                localPeerConnection.setLocalDescription(description)
                    .then(() => {
                    setLocalDescriptionSuccess(localPeerConnection);
                    }).catch(setSessionDescriptionError);

                trace('remotePeerConnection setRemoteDescription start.');
                remotePeerConnection.setRemoteDescription(description)
                    .then(() => {
                    setRemoteDescriptionSuccess(remotePeerConnection);
                    }).catch(setSessionDescriptionError);

                trace('remotePeerConnection createAnswer start.')
                remotePeerConnection.createAnswer()
                    .then(description => {
                        trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

                        trace('remotePeerConnection setLocalDescription start.');
                        remotePeerConnection.setLocalDescription(description)
                            .then(() => {
                            setLocalDescriptionSuccess(remotePeerConnection);
                            }).catch(setSessionDescriptionError);

                        trace('localPeerConnection setRemoteDescription start.');
                        localPeerConnection.setRemoteDescription(description)
                            .then(() => {
                            setRemoteDescriptionSuccess(localPeerConnection);
                            }).catch(setSessionDescriptionError);
                    })
                    .catch(setSessionDescriptionError);
            }

            function setSessionDescriptionError(error) {
  trace(`Failed to create session description: ${error.toString()}.`);
}

            localPeerConnection.createOffer({
                offerToReceiveVideo: 1,
            })
                .then(createdOffer).catch(setSessionDescriptionError);
        },
    }
};
</script>


<style lang="scss" scoped>
@import "../scss/var";

video {
  max-width: 100%;
  width: 320px;
}

.btns {
    .btn {
        margin-right: 8px;
    }
}
.container {
    font-family: Arial;
    margin: 4vh auto;
    width: 90vw;
    max-width: 600px;
    text-align: center;
}
#controls {
    text-align: center;
}
#video {
  margin-top: 10px;
  margin-bottom: 20px;
  border: 12px solid #a5adb0;
  border-radius: 15px;
  outline: none;
  width: 100%;
  height: 400px;
  background-color: black;
}
.created {
  color: lightgrey;
  letter-spacing: -0.7px;
  font-size: 1em;
  margin-top: 40px;
}
.created > a {
  color: #4b7bec;
  text-decoration: none;
}
</style>
