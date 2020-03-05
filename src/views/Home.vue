<template>
    <my-page title="WebRTC" :page="page">
        <div class="common-container container">
            <video id="localVideo" autoplay playsinline></video>
            <video id="remoteVideo" autoplay playsinline></video>
            截图预览：
            <canvas id="photo"></canvas>

            <div>
                <button id="startButton" @click="start">Start</button>
                <button id="callButton" @click="call">Call</button>
                <button id="hangupButton" @click="hangUp">Hang Up</button>

                <ui-raised-button class="btn" label="截图" @click="snap" />
                <ui-raised-button class="btn" label="测试发送数据" @click="sendData" />
                <ui-raised-button class="btn" label="调试" @click="debug" />
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
            this.start()
            this.initWebSocket()
        },
        debug() {
        },
        initWebSocket() {
            var socket = io.connect('http://127.0.0.1:8099');

            socket.on('ipaddr', function(ipaddr) {
                console.log('Server IP address is: ' + ipaddr);
            // updateRoomURL(ipaddr);
            });

            socket.on('created', function(room, clientId) {
            console.log('Created room', room, '- my client ID is', clientId);
            isInitiator = true;
            grabWebCamVideo();
            });

            socket.on('joined', function(room, clientId) {
            console.log('This peer has joined room', room, 'with client ID', clientId);
            isInitiator = false;
            createPeerConnection(isInitiator, configuration);
            grabWebCamVideo();
            });

            socket.on('full', function(room) {
            alert('Room ' + room + ' is full. We will create a new room for you.');
            window.location.hash = '';
            window.location.reload();
            });

            socket.on('ready', function() {
            console.log('Socket is ready');
            createPeerConnection(isInitiator, configuration);
            });

            socket.on('log', function(array) {
            console.log.apply(console, array);
            });

            socket.on('message', function(message) {
            console.log('Client received message:', message);
            signalingMessageCallback(message);
            });

            // Joining a room.
            // socket.emit('create or join', room);

            // if (location.hostname.match(/localhost|127\.0\.0/)) {
            // socket.emit('ipaddr');
            // }

            // Leaving rooms and disconnecting from peers.
            socket.on('disconnect', function(reason) {
            console.log(`Disconnected: ${reason}.`);
            sendBtn.disabled = true;
            snapAndSendBtn.disabled = true;
            });

            socket.on('bye', function(room) {
            console.log(`Peer leaving room ${room}.`);
            sendBtn.disabled = true;
            snapAndSendBtn.disabled = true;
            // If peer did not create the room, re-enter to be creator.
            if (!isInitiator) {
                window.location.reload();
            }
            });
        },
        snap() {
            var photo = document.getElementById('photo');
            var photoContext = photo.getContext('2d');
            photoContext.drawImage(this.localVideo, 0, 0, photo.width, photo.height)
            function show() {
                Array.prototype.forEach.call(arguments, function(elem) {
                    elem.style.display = null;
                });
            }
            // show(photo, sendBtn)
        },
        start() {
            const localVideo = document.querySelector('video')
            this.localStream
            this.localVideo = localVideo
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
        sendData() {
            let data = 'hello world'
            this.sendChannel.send(data)
            trace('Sent Data: ' + data);
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
            // Create peer connections and add behavior.
            // 本地连接
            this.localPeerConnection = new RTCPeerConnection(servers, null)

            // 发送数据 Channel
            this.sendChannel = this.localPeerConnection.createDataChannel('sendDataChannel', null)
            this.sendChannel.onopen = this.sendChannel.onclose = () => {
                var readyState = this.sendChannel.readyState
                trace('发送通道状态： ' + readyState);
                if (readyState === 'open') {
                    
                } else {
                    
                }
            }


            trace('Created local peer connection object localPeerConnection.');
            
            const getPeerName = (peerConnection) => {
                return (peerConnection === this.localPeerConnection) ?
                    'localPeerConnection' : 'remotePeerConnection';
            }

            function setRemoteDescriptionSuccess(peerConnection) {
                function setDescriptionSuccess(peerConnection, functionName) {
                  const peerName = getPeerName(peerConnection);
                  trace(`${peerName} ${functionName} complete.`);
                }
                setDescriptionSuccess(peerConnection, 'setRemoteDescription');
            }


            const handleConnection = event => {
                const peerConnection = event.target;
                const iceCandidate = event.candidate;

                if (iceCandidate) {
                    const newIceCandidate = new RTCIceCandidate(iceCandidate);
                    const otherPeer = (peerConnection === this.localPeerConnection) ? this.remotePeerConnection : this.localPeerConnection;

                    otherPeer.addIceCandidate(newIceCandidate)
                    .then(() => {
                        trace(`${getPeerName(peerConnection)} addIceCandidate success.`);
                    }).catch((error) => {
                        trace(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
                            `${error.toString()}.`);
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

            this.localPeerConnection.addEventListener('icecandidate', handleConnection);
            this.localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange)

            // 远程
            this.remotePeerConnection = new RTCPeerConnection(servers)
            this.remotePeerConnection.ondatachannel = event => {
                console.log('收数据回调', event)
                this.receiveChannel = event.channel
                this.receiveChannel.onmessage = event => {
                    console.log('收到', event.data)
                }
                const onReceiveChannelStateChange = () => {
                    var readyState = this.receiveChannel.readyState;
                    trace('Receive channel state is: ' + readyState);
                }
                this.receiveChannel.onopen = onReceiveChannelStateChange;
                this.receiveChannel.onclose = onReceiveChannelStateChange;
            }


            this.remotePeerConnection.addEventListener('icecandidate', handleConnection);
            this.remotePeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);
            this.remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

            // Add local stream to connection and create offer to connect.
            this.localPeerConnection.addStream(this.localStream);
            trace('Added local stream to localPeerConnection.');

            trace('localPeerConnection createOffer start.');

            function setSessionDescriptionError(error) {
                trace(`Failed to create session description: ${error.toString()}.`);
            }

            this.localPeerConnection.createOffer({
                offerToReceiveVideo: 1,
            })
            .then((description) => {
                // RTCSessionDescription
                trace(`Offer from localPeerConnection:\n${description.sdp}`);

                // 保存本地会话
                this.localPeerConnection.setLocalDescription(description)
                    .then(() => {
                        console.log('保存本地会话成功')
                    }).catch(err => {
                        console.log('保存本地会话失败')
                    });

                this.remotePeerConnection.setRemoteDescription(description)
                    .then(() => {
                        console.log('远程 setRemoteDescription 成功')
                    }).catch(err => {
                        console.log('远程 setRemoteDescription 失败')
                    })

                trace('remotePeerConnection createAnswer start.')
                this.remotePeerConnection.createAnswer()
                    .then(description => {
                        trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

                        trace('remotePeerConnection setLocalDescription start.');
                        this.remotePeerConnection.setLocalDescription(description)
                            .then(() => {
                                console.log('保存远程会话成功')
                            }).catch(err => {
                                console.log('保存远程会话失败')
                            })

                        trace('localPeerConnection setRemoteDescription start.');
                        this.localPeerConnection.setRemoteDescription(description)
                            .then(() => {
                                console.log('本地 setRemoteDescription 成功')
                            }).catch(err => {
                                console.log('本地 setRemoteDescription 失败')
                            })
                    })
                    .catch(err => {
                        console.log('createAnswer 失败')
                    })
            }).catch(err => {
                console.error('createOffer 失败', err)
            })
        },
    }
};
</script>


<style lang="scss" scoped>
@import "../scss/var";
canvas {
  max-width: 100%;
  width: 320px;
}
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
