<template>
  <div class="event_list_page_body flex_box direction_column">
    <v-dialog v-model="dialog" persistent class="loading_dialog" width="60%">
      <div class="flex_box loading_dialog_content">
        <div style="color: #a0cadb" class="la-ball-grid-pulse la-3x">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <!-- configuration dialogs -->
        <div class="connectiong_msg">
          オフィスへ参加中です<br />しばらくお待ちください...
        </div>
      </div>
    </v-dialog>

    <audio id="sample-audio-area"></audio>
    <div class="video_area flex_box direction_row">
      <video id="my_video" width="200" height="200"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
      <video class="other_attendee_video"></video>
    </div>

    <swiper
      ref="mySwiper"
      :options="swiperOptionsObject"
      :auto-update="true"
      :auto-destroy="true"
      :delete-instance-on-destroy="true"
      :cleanup-styles-on-destroy="true"
    >
      <swiper-slide>
        <OfficeStandardImage
          ref="officeStandardImage"
          @connect="connectSession"
          @changeSession="changeSession"
        />
      </swiper-slide>
      <swiper-slide>
        <video
          id="shared_video_1"
          v-show="primaryCarousel"
          width="800"
          height="500"
        ></video>
        <div class="not_shared_box flex_box" v-show="!primaryCarousel">
          <div class="not_shared_msg">No Sharing Video</div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <video
          id="shared_video_2"
          v-show="secondaryCarousel"
          width="800"
          height="500"
        ></video>
        <div class="not_shared_box flex_box" v-show="!secondaryCarousel">
          <div class="not_shared_msg">No Sharing Video</div>
        </div>
      </swiper-slide>

      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>

    <v-bottom-navigation app>
      <!-- ボトムナビゲーション -->
      <v-btn @click="changeMuteStatus()">
        <span v-bind:style="menus[0].classObj">{{ menus[0].title }}</span>
        <v-icon v-bind:style="menus[0].classObj">{{ menus[0].icon }}</v-icon>
      </v-btn>
      <v-btn @click="changeVideoStatus()">
        <span v-bind:style="menus[1].classObj">{{ menus[1].title }}</span>
        <v-icon v-bind:style="menus[1].classObj">{{ menus[1].icon }}</v-icon>
      </v-btn>
      <v-btn @click="startShareScreen()">
        <span style="color: #1f9b32">{{ menus[2].title }}</span>
        <v-icon style="color: #1f9b32">{{ menus[2].icon }}</v-icon>
      </v-btn>
      <v-btn @click="stopMeetingSession()">
        <span style="color: red">{{ menus[3].title }}</span>
        <v-icon style="color: red">{{ menus[3].icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
import axios from "axios";
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
  MeetingSessionStatusCode,
  DefaultModality,
} from "amazon-chime-sdk-js";
import OfficeStandardImage from "../components/organisms/ImageMap/OfficeStandardImage";

export default {
  name: "OfficePage",
  props: {
    index: Number,
    isShared: Boolean,
  },
  data: () => ({
    menus: [
      {
        title: "Mic",
        icon: "mdi-microphone",
        classObj: { color: "#1f9b32" },
      },
      { title: "Video", icon: "mdi-video-box", classObj: { color: "#1f9b32" } },
      { title: "Share screen", icon: "mdi-monitor-share" },
      {
        title: "leave the Room",
        icon: "mdi-location-exit",
      },
    ],
    eventTitle: [],
    eventId: [],
    attendeesData: "",
    apiURL: "https://yubmc31dsb.execute-api.ap-northeast-1.amazonaws.com/prod/",
    meetingSession: null,
    audioInputDevices: null,
    audioOutputDevices: null,
    videoInputDevices: null,
    audioInputDeviceId: "",
    audioOutputDeviceId: "",
    videoInputDeviceId: "",
    mikes: [],
    speakers: [],
    videos: [],
    observer: null,
    isDeviceSelect: false,
    dialog: false,
    audioInputDeviceLabel: "",
    audioOutputDeviceLabel: "",
    videoInputDeviceLabel: "",
    isMuted: false,
    isVideoClosed: false,
    iaFirstAttendeeReady: false,
    iaSecondAttendeeReady: false,
    iaThirdAttendeeReady: false,
    iaFourthAttendeeReady: false,
    model: 0,
    primaryCarousel: false,
    secondaryCarousel: false,
    isChangeSession: false,
    swiperOptionsObject: {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    },
  }),
  components: {
    OfficeStandardImage,
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
  },
  created: async function () {
    this.initializeMapData();
  },
  methods: {
    axiosSevice: async function (data, uri) {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let payload = data;

      try {
        let response = await axios.post(
          this.apiURL + uri,
          JSON.stringify(payload),
          axiosConfig
        );
        return response;
      } catch (error) {
        console.log(error.response);
        throw error.response;
      }
    },
    accessMeeting: async function (sessionId, isReconnect) {
      let payload = {
        session_id: sessionId,
        reconnect: isReconnect,
      };

      let result;
      try {
        result = await this.axiosSevice(payload, "access-meeting");
      } catch (error) {
        console.log(error);
        throw error;
      }

      return result.data;
    },
    getMap: async function (officeMapId) {
      let payload = {
        id: officeMapId,
      };

      let result;
      try {
        result = await this.axiosSevice(payload, "get-map");
        console.log(result);
        return result.data.Items[0].map_data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    getMapId: async function (officeId, startDate) {
      let payload = {
        office_id: officeId,
        start_date: startDate,
      };

      let result;
      try {
        result = await this.axiosSevice(payload, "get-map-id");
        return result.data.Items[0].office_map_id;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    changeDialogStatus: function () {
      this.dialog = !this.dialog;
    },
    initializeMapData: async function () {
      this.changeDialogStatus();

      let officeMapId;

      // ここをマップID取得処理にする
      if (this.isShared) {
        let officeId = this.$store.getters["commonStore/getInvitedEventInfo"][
          this.index
        ].office_id;

        let startDate = this.$store.getters["commonStore/getInvitedEventInfo"][
          this.index
        ].start_date;

        officeMapId = await this.getMapId(officeId, startDate);
      } else {
        officeMapId = this.$store.getters["commonStore/getEventInfo"][
          this.index
        ].office_map_id;
      }
      this.$store.dispatch("mapStore/setOfficeMapId", officeMapId);

      let mapData;
      try {
        mapData = await this.getMap(officeMapId);
        this.$store.dispatch("mapStore/setMapData", mapData);
        this.$refs.officeStandardImage.initializeMap();
      } catch (error) {
        console.log(error);
      }
    },
    connectSession: async function (sessionId) {
      try {
        await this.initializeMeetingSessions(sessionId);
        await this.registeAudioDevice();
        await this.setObserver();
        this.meetingSession.audioVideo.addObserver(this.observer);
        this.meetingSession.audioVideo.addDeviceChangeObserver(this.observer);
        this.setShareObserver();
        await this.startSession();
        this.changeDialogStatus();
      } catch (error) {
        console.log(error);
      }
    },
    changeSession: async function (sessionData) {
      this.isChangeSession = sessionData.change_session;
      this.meetingSession.audioVideo.stop();
      this.changeDialogStatus();
      this.changeMuteStatus();
      this.connectSession(sessionData.session_id);
    },
    initializeMeetingSessions: async function (sessionId) {
      // AWS-SDK提供のLoggerインスタンスとデバイスコントローラーを初期化
      const logger = new ConsoleLogger("MyLogger", LogLevel.ERROR);
      const deviceController = new DefaultDeviceController(logger);

      // You need responses from server-side Chime API. See below for details.
      // 各APIをコールしミーティングに必要なIDとユーザー情報を登録する
      let sessionData;
      try {
        sessionData = await this.accessMeeting(sessionId, false);
      } catch (error) {
        if (error.data.message === "NotFound") {
          console.log("reconnecting");
          sessionData = await this.accessMeeting(sessionId, true);
        }
      }

      const configuration = new MeetingSessionConfiguration(
        sessionData.meeting_res,
        sessionData.attendee_res
      );

      // In the usage examples below, you will use this meetingSession object.
      this.meetingSession = new DefaultMeetingSession(
        configuration,
        logger,
        deviceController
      );
    },
    registeAudioDevice: async function () {
      // 1.オーディオ入力、オーディオ出力、およびビデオ入力デバイスを一覧表示する。
      // ブラウザはマイクとカメラの権限を要求
      this.audioInputDevices = await this.meetingSession.audioVideo.listAudioInputDevices();
      this.audioOutputDevices = await this.meetingSession.audioVideo.listAudioOutputDevices();
      this.videoInputDevices = await this.meetingSession.audioVideo.listVideoInputDevices();

      this.audioInputDeviceId = this.audioInputDevices[0].deviceId;
      this.audioInputDeviceId = this.audioOutputDevices[0].deviceId;
      this.videoInputDeviceId = this.videoInputDevices[0].deviceId;

      await this.meetingSession.audioVideo.chooseAudioInputDevice(
        this.audioInputDevices[0].deviceId
      );

      await this.meetingSession.audioVideo.chooseAudioOutputDevice(
        this.audioOutputDevices[0].deviceId
      );

      await this.meetingSession.audioVideo.chooseVideoInputDevice(
        this.videoInputDevices[0].deviceId
      );
      const myVideoElement = document.getElementById("my_video");

      let localTileId = null;
      const localObserver = {
        // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
        videoTileDidUpdate: (tileState) => {
          // Ignore a tile without attendee ID and other attendee's tile.
          if (!tileState.boundAttendeeId || !tileState.localTile) {
            return;
          }

          this.meetingSession.audioVideo.bindVideoElement(
            tileState.tileId,
            myVideoElement
          );
          localTileId = tileState.tileId;
        },
        videoTileWasRemoved: (tileId) => {
          if (localTileId === tileId) {
            localTileId = null;
          }
        },
      };

      this.meetingSession.audioVideo.addObserver(localObserver);

      this.isDeviceSelect = false;
    },
    startSession: function () {
      this.startAudio();
      this.startVideo();
    },
    startAudio: function () {
      // セッションを開始します。音声を聞くには、デバイスをバインドして<audio>要素にストリーミングする必要があります。
      // セッションが開始されると、参加者と話したり聞いたりすることができます。
      // マイクとスピーカーを選択し（「デバイス」セクションを参照）、少なくとも1人の他の参加者がセッションに参加していることを確認してください。
      const audioElement = document.getElementById("sample-audio-area");
      this.meetingSession.audioVideo.bindAudioElement(audioElement);
      this.meetingSession.audioVideo.start();
    },
    startVideo: function () {
      this.meetingSession.audioVideo.startLocalVideoTile();
    },
    startShareScreen: async function () {
      const observer = {
        videoTileDidUpdate: (tileState) => {
          // Ignore a tile without attendee ID and videos.
          if (!tileState.boundAttendeeId || !tileState.isContent) {
            return;
          }

          const yourAttendeeId = this.meetingSession.configuration.credentials
            .attendeeId;

          // tileState.boundAttendeeId is formatted as "attendee-id#content".
          const boundAttendeeId = tileState.boundAttendeeId;

          // Get the attendee ID from "attendee-id#content".
          const baseAttendeeId = new DefaultModality(boundAttendeeId).base();
          if (baseAttendeeId === yourAttendeeId) {
            console.log("You called startContentShareFromScreenCapture");
          }
        },
        contentShareDidStart: () => {
          console.log("Screen share started");
        },
        contentShareDidStop: () => {
          console.log("Screen share stopped");
        },
      };

      this.meetingSession.audioVideo.addContentShareObserver(observer);
      this.meetingSession.audioVideo.addObserver(observer);
      // A browser will prompt the user to choose the screen.
      await this.meetingSession.audioVideo.startContentShareFromScreenCapture();
    },
    stopMeetingSession: function () {
      this.$refs.officeStandardImage.leaveMap();
      this.meetingSession.audioVideo.stop();
    },
    changeMuteStatus: function () {
      this.isMuted = !this.isMuted;

      if (this.isMuted) {
        this.meetingSession.audioVideo.realtimeMuteLocalAudio();
        this.menus[0].icon = "mdi-microphone-off";
        this.menus[0].classObj.color = "red";
      } else {
        this.meetingSession.audioVideo.realtimeUnmuteLocalAudio();
        this.menus[0].icon = "mdi-microphone";
        this.menus[0].classObj.color = "#1f9b32";
      }
    },
    changeVideoStatus: async function () {
      this.isVideoClosed = !this.isVideoClosed;

      if (this.isVideoClosed) {
        this.meetingSession.audioVideo.stopLocalVideoTile();
        this.menus[1].icon = "mdi-video-box-off";
        this.menus[1].classObj.color = "red";
      } else {
        try {
          await this.meetingSession.audioVideo.chooseVideoInputDevice(
            this.videoInputDeviceId
          );
        } catch (error) {
          console.log(error);
        }

        this.meetingSession.audioVideo.startLocalVideoTile();
        this.menus[1].icon = "mdi-video-box";
        this.menus[1].classObj.color = "#1f9b32";
      }
    },
    setObserver: async function () {
      const videoElements = document.getElementsByClassName(
        "other_attendee_video"
      );

      // index-tileId pairs
      const indexMap = {};

      const acquireVideoElement = (tileId) => {
        // Return the same video element if already bound.
        for (let i = 0; i < 16; i += 1) {
          if (indexMap[i] === tileId) {
            return videoElements[i];
          }
        }
        // Return the next available video element.
        for (let i = 0; i < 16; i += 1) {
          if (!Object.hasOwnProperty.call(indexMap, i)) {
            indexMap[i] = tileId;
            return videoElements[i];
          }
        }
        throw new Error("no video element is available");
      };

      const releaseVideoElement = (tileId) => {
        for (let i = 0; i < 16; i += 1) {
          if (indexMap[i] === tileId) {
            delete indexMap[i];
            return;
          }
        }
      };
      // 更新されたデバイスリストを受信するには、デバイス変更オブザーバーを追加します。たとえば、Bluetoothヘッドセットをコンピューターとペアリングすると、
      // audioInputsChangedとaudioOutputsChangedがヘッドセットを含むデバイスリストで呼び出されます
      this.observer = {
        audioInputsChanged: (freshAudioInputDeviceList) => {
          // An array of MediaDeviceInfo objects
          freshAudioInputDeviceList.forEach((mediaDeviceInfo) => {
            console.log(
              `Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
            );
          });
        },
        audioOutputsChanged: (freshAudioOutputDeviceList) => {
          console.log("Audio outputs updated: ", freshAudioOutputDeviceList);
        },
        videoInputsChanged: (freshVideoInputDeviceList) => {
          console.log("Video inputs updated: ", freshVideoInputDeviceList);
        },
        audioVideoDidStart: () => {
          console.log("Started");
        },
        audioVideoDidStartConnecting: (reconnecting) => {
          if (reconnecting) {
            // e.g. the WiFi connection is dropped.
            console.log("Attempting to reconnect");
          }
        },
        // videoTileDidUpdate is called whenever a new tile is created or tileState changes.
        videoTileDidUpdate: (tileState) => {
          // Ignore a tile without attendee ID, a local tile (your video), and a content share.
          if (
            !tileState.boundAttendeeId ||
            tileState.localTile ||
            tileState.isContent
          ) {
            return;
          }

          const availableVideo = acquireVideoElement(tileState.tileId);
          availableVideo.style.display = "block";
          this.meetingSession.audioVideo.bindVideoElement(
            tileState.tileId,
            availableVideo
          );
        },
        videoTileWasRemoved: (tileId) => {
          releaseVideoElement(tileId);
        },
        audioVideoDidStop: (sessionStatus) => {
          const sessionStatusCode = sessionStatus.statusCode();
          if (sessionStatusCode === MeetingSessionStatusCode.Left) {
            console.log("You left the session");

            if (this.isChangeSession) {
              this.isChangeSession = false;
              return;
            }

            return this.$router.push({
              name: "EventListPage",
            });
          } else {
            console.log(
              "Stopped with a session status code: ",
              sessionStatusCode
            );
          }

          if (sessionStatusCode === MeetingSessionStatusCode.MeetingEnded) {
            console.log("The session has ended");
          } else {
            console.log(
              "Stopped with a session status code: ",
              sessionStatusCode
            );
          }
        },
      };
    },
    setShareObserver: function () {
      const shareVideoElement1 = document.getElementById("shared_video_1");
      const shareVideoElement2 = document.getElementById("shared_video_2");
      const videoElementStack = [shareVideoElement2, shareVideoElement1];

      const tileMap = {};

      const changeCarouselStatus = (id, status) => {
        if (id === "shared_video_1") {
          this.primaryCarousel = status;
          this.swiper.slideTo(1, 1000, false);
        } else if (id === "shared_video_2") {
          console.log(id);
          this.secondaryCarousel = status;
        }
      };

      const localObserver = {
        videoTileDidUpdate: (tileState) => {
          // Ignore a tile without attendee ID and videos.
          if (!tileState.boundAttendeeId || !tileState.isContent) {
            return;
          }

          const yourAttendeeId = this.meetingSession.configuration.credentials
            .attendeeId;

          // tileState.boundAttendeeId is formatted as "attendee-id#content".
          const boundAttendeeId = tileState.boundAttendeeId;

          // Get the attendee ID from "attendee-id#content".
          const baseAttendeeId = new DefaultModality(boundAttendeeId).base();
          if (baseAttendeeId !== yourAttendeeId) {
            console.log(`${baseAttendeeId} is sharing screen now`);

            // Get the already bound video element if available, or use an unbound element.
            const videoElement =
              tileMap[tileState.tileId] || videoElementStack.pop();
            if (videoElement) {
              tileMap[tileState.tileId] = videoElement;
              changeCarouselStatus(videoElement.id, true);
              this.meetingSession.audioVideo.bindVideoElement(
                tileState.tileId,
                videoElement
              );
            } else {
              console.log("No video element is available");
            }
          }
        },
        videoTileWasRemoved: (tileId) => {
          // Release the unused video element.
          const videoElement = tileMap[tileId];
          if (videoElement) {
            videoElementStack.push(videoElement);
            delete tileMap[tileId];
            changeCarouselStatus(videoElement.id, false);
          }
        },
        contentShareDidStart: () => {
          console.log("Screen share started");
        },
        contentShareDidStop: () => {
          console.log("Screen share stopped");
        },
      };
      this.meetingSession.audioVideo.addObserver(localObserver);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex_box {
  display: flex;
  justify-content: center;
  align-items: center;
}

.direction_row {
  flex-direction: row;
}

.direction_column {
  flex-direction: column;
}
.event_list_page_body {
  width: 100%;
  height: 100%;
}

.video_area {
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 80%;
  min-height: 200px;
  margin: 30px;
  background-color: white;
  border-radius: 25px;
  box-shadow: 1px 1px 6px black;
}

#my_video {
  margin: 0 15px;
}

.other_attendee_video {
  display: none;
  width: 200px;
  height: 200px;
  margin: 0 15px;
}

.loading_dialog {
  height: 500px;
}

.loading_dialog_content {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 500px;
  background-color: white;
}

.la-ball-grid-pulse.la-3x {
  width: 216px;
  height: 216px;
}

.la-ball-grid-pulse.la-3x > div {
  width: 48px;
  height: 48px;
  margin: 12px;
}

.connectiong_msg {
  font-size: 24px;
  font-family: system-ui;
  font-weight: bold;
  line-height: 36px;
  margin-top: 30px;
  color: #1a94b1;
  text-align: center;
}

.swiper-container {
  width: 800px;
  height: 500px;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.not_shared_box {
  width: 100%;
  height: 100%;
  background-color: gray;
}

.not_shared_msg {
  font-size: 32px;
  color: white;
  font-weight: bold;
}

@media screen and (max-width: 600px) {
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
}
</style>
