// import axios from "axios";
// import {
//     ConsoleLogger,
//     DefaultDeviceController,
//     DefaultMeetingSession,
//     LogLevel,
//     MeetingSessionConfiguration,
// } from "amazon-chime-sdk-js";

// try {
//     // AWS-SDK提供のLoggerインスタンスとデバイスコントローラーを初期化
//     const logger = new ConsoleLogger("MyLogger", LogLevel.INFO);
//     const deviceController = new DefaultDeviceController(logger);

//     // You need responses from server-side Chime API. See below for details.
//     // 各APIをコールしミーティングに必要なIDとユーザー情報を登録する
//     const meetingResponse = await this.createMeeting();
//     const attendeeResponse = await this.createAttendees();

//     const configuration = new MeetingSessionConfiguration(
//         meetingResponse,
//         attendeeResponse
//     );

//     // In the usage examples below, you will use this meetingSession object.
//     const meetingSession = new DefaultMeetingSession(
//         configuration,
//         logger,
//         deviceController
//     );

//     // 1.オーディオ入力、オーディオ出力、およびビデオ入力デバイスを一覧表示する。
//     // ブラウザはマイクとカメラの権限を要求
//     const audioInputDevices = await meetingSession.audioVideo.listAudioInputDevices();
//     const audioOutputDevices = await meetingSession.audioVideo.listAudioOutputDevices();
//     const videoInputDevices = await meetingSession.audioVideo.listVideoInputDevices();

//     console.log(videoInputDevices);

//     // An array of MediaDeviceInfo objects
//     audioInputDevices.forEach((mediaDeviceInfo) => {
//         console.log(
//             `Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
//         );
//     });

//     // MediaDeviceInfoオブジェクトのdeviceIdを渡して、オーディオ入力デバイスとオーディオ出力デバイスを選択
//     const audioInputDeviceInfo = audioInputDevices[0];
//     await meetingSession.audioVideo.chooseAudioInputDevice(
//         audioInputDeviceInfo.deviceId
//     );

//     const audioOutputDeviceInfo = audioOutputDevices[0];
//     await meetingSession.audioVideo.chooseAudioOutputDevice(
//         audioOutputDeviceInfo.deviceId
//     );

//     // 更新されたデバイスリストを受信するには、デバイス変更オブザーバーを追加します。たとえば、Bluetoothヘッドセットをコンピューターとペアリングすると、
//     // audioInputsChangedとaudioOutputsChangedがヘッドセットを含むデバイスリストで呼び出されます
//     const observer = {
//         audioInputsChanged: (freshAudioInputDeviceList) => {
//             // An array of MediaDeviceInfo objects
//             freshAudioInputDeviceList.forEach((mediaDeviceInfo) => {
//                 console.log(
//                     `Device ID: ${mediaDeviceInfo.deviceId} Microphone: ${mediaDeviceInfo.label}`
//                 );
//             });
//         },
//         audioOutputsChanged: (freshAudioOutputDeviceList) => {
//             console.log("Audio outputs updated: ", freshAudioOutputDeviceList);
//         },
//         videoInputsChanged: (freshVideoInputDeviceList) => {
//             console.log("Video inputs updated: ", freshVideoInputDeviceList);
//         },
//         audioVideoDidStart: () => {
//             console.log("Started");
//         },
//         audioVideoDidStop: (sessionStatus) => {
//             // See the "Stopping a session" section for details.
//             console.log(
//                 "Stopped with a session status code: ",
//                 sessionStatus.statusCode()
//             );
//         },
//         audioVideoDidStartConnecting: (reconnecting) => {
//             if (reconnecting) {
//                 // e.g. the WiFi connection is dropped.
//                 console.log("Attempting to reconnect");
//             }
//         },
//     };

//     meetingSession.audioVideo.addDeviceChangeObserver(observer);

//     // セッションを開始します。音声を聞くには、デバイスをバインドして<audio>要素にストリーミングする必要があります。
//     // セッションが開始されると、参加者と話したり聞いたりすることができます。
//     // マイクとスピーカーを選択し（「デバイス」セクションを参照）、少なくとも1人の他の参加者がセッションに参加していることを確認してください。
//     const audioElement = document.getElementById("sample-audio-area");
//     meetingSession.audioVideo.bindAudioElement(audioElement);
//     meetingSession.audioVideo.addObserver(observer);
//     meetingSession.audioVideo.start();

//     // 注：これまで、デバイスとセッションのライフサイクルイベントを受信するためのオブザーバーを追加しました。
//     // 次のユースケースでは、リアルタイムAPIメソッドを使用して、ボリュームインジケーターを送受信し、ミュート状態を制御します。

//     // ユースケース7。オーディオ入力をミュートおよびミュート解除します。
//     // Mute
//     meetingSession.audioVideo.realtimeMuteLocalAudio();

//     // Unmute
//     const unmuted = meetingSession.audioVideo.realtimeUnmuteLocalAudio();
//     if (unmuted) {
//         console.log("Other attendees can hear your audio");
//     } else {
//         // See the realtimeSetCanUnmuteLocalAudio use case below.
//         console.log("You cannot unmute yourself");
//     }

//     // ユースケース8。ローカルマイクがミュートされているかどうかを確認するには、自分のミュート状態を追跡するのではなく、この方法を使用します。
//     const muted = meetingSession.audioVideo.realtimeIsLocalAudioMuted();
//     if (muted) {
//         console.log("You are muted");
//     } else {
//         console.log("Other attendees can hear your audio");
//     }
// } catch (error) {
//     console.log(error);
// }
// },
// methods: {
//         createMeeting: async function() {
//             let payload = {};

//             let result;
//             result = await this.axiosSevice(payload, "create-meeting");
//             this.meetingData = result.data.Meeting.MeetingId;
//             this.meetingId = result.data.Meeting.MeetingId;

//             return result.data;
//         },
//         createAttendees: async function() {
//             let payload = {
//                 meetingId: this.meetingId,
//             };
//             let result = await this.axiosSevice(payload, "create-attendee");
//             this.attendeesData = JSON.stringify(result.data);

//             return result.data;
//         },
//         axiosSevice: async function(data, uri) {
//             const axiosConfig = {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             };

//             let payload = data;

//             try {
//                 let response = await axios.post(
//                     this.apiURL + uri,
//                     JSON.stringify(payload),
//                     axiosConfig
//                 );
//                 console.log(response);
//                 return response;
//             } catch (error) {
//                 console.log(error);
//                 throw error;
//             }
//         },