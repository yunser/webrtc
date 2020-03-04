<template>
    <my-page title="WebRTC" :page="page">
        <div class="common-container container">
            <video autoplay playsinline></video>

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
export default {
    data() {
        return {
            recordVisible: true,
            stopVisible: false,
            downloadVisible: false,
            page: {
                menu: [
                    // {
                    //     type: "icon",
                    //     icon: "search",
                    //     href: "https://search.yunser.com?utm_source=edu",
                    //     target: "_blank",
                    //     title: "搜索"
                    // },
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
            // On this codelab, you will be streaming only video (video: true).
            const mediaStreamConstraints = {
            video: true,
            }

            // Video element where stream will be placed.
            const localVideo = document.querySelector('video');

            // Local stream that will be reproduced on the video.
            let localStream;

            // Handles success by adding the MediaStream to the video element.
            function gotLocalMediaStream(mediaStream) {
            localStream = mediaStream;
            localVideo.srcObject = mediaStream;
            }

            // Handles error by logging a message to the console with the error message.
            function handleLocalMediaStreamError(error) {
            console.log('navigator.getUserMedia error: ', error);
            }

            // Initializes media stream.
            navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
            .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

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
