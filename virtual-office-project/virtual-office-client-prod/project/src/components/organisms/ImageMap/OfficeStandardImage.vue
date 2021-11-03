<template>
  <div id="target">
    <canvas id="image_board" width="800" height="500"></canvas>
  </div>
</template>

<script>
import imageAreaMixin from "../../../mixin/imageAreaMixin";
import API, { graphqlOperation } from "@aws-amplify/api";
import { updateOfficeMapTable } from "../../../graphql/mutations";
import { onUpdateOfficeMapTable } from "../../../graphql/subscriptions";
import { getOfficeMapTable } from "../../../graphql/queries";

export default {
  name: "OfficeStandardImage",
  data: () => ({
    offsetX: 0,
    offsetY: 0,
    tables: ["first_session", "second_session", "third_session"],
    iconLogo: "",
    image: "",
    officeMapId: "",
    mapData: null,
    myDestination: null,
    filledDestination: [],
    inRoom: false,
  }),
  mixins: [imageAreaMixin],
  methods: {
    sendMyDestination: async function () {
      let payload = {
        id: this.officeMapId,
        map_data: JSON.stringify(this.mapData),
      };

      try {
        await API.graphql(
          graphqlOperation(updateOfficeMapTable, { input: payload })
        );
      } catch (error) {
        console.log(error);
      }
    },
    subscribeMapData: async function () {
      const self = this;
      await API.graphql(graphqlOperation(onUpdateOfficeMapTable)).subscribe({
        next: (mapData) => {
          if (self.inRoom && mapData.value.data.onUpdateOfficeMapTable) {
            this.mapData = JSON.parse(
              mapData.value.data.onUpdateOfficeMapTable.map_data
            );
            let filledDestination = this.getFilledDestination(this.mapData);

            const canvas = document.getElementById("image_board");
            let imagePath = require("../../../assets/office-image-standard.png");
            this.drawImage(canvas, imagePath, filledDestination);
          }
        },
      });
    },
    getRemoteMapData: async function () {
      let result;
      result = await API.graphql(
        graphqlOperation(getOfficeMapTable, { id: this.officeMapId })
      );
      console.log(result);
      this.mapData = JSON.parse(result.data.getOfficeMapTable.map_data);
    },
    initializeMap: async function () {
      console.log("initializeMap");
      this.inRoom = true;
      this.officeMapId = this.$store.getters["mapStore/getOfficeMapId"];
      this.mapData = this.$store.getters["mapStore/getMapData"];
      await this.getRemoteMapData();
      this.myDestination = this.getStartDestination(this.mapData);
      let filledDestination = this.getFilledDestination(this.mapData);

      this.iconLogo = this.$store.getters["commonStore/getUserName"].substr(
        0,
        1
      );
      this.subscribeMapData();

      let target;
      let self = this;
      setTimeout(() => {
        const canvas = document.getElementById("image_board");
        let imagePath = require("../../../assets/office-image-standard.png");
        this.drawImage(canvas, imagePath, filledDestination);
        self.sendMyDestination(self.myDestination);

        target = document.getElementById("target");
        target.addEventListener("dblclick", async function (e) {
          self.offsetX = e.offsetX; // =>要素左上からのx座標
          self.offsetY = e.offsetY; // =>要素左上からのy座標

          self.myDestination = await self.getDestination(self.mapData);
          self.sendMyDestination();

          if (self.myDestination.change_session)
            self.$emit("changeSession", self.myDestination);
        });
      }, 100);

      this.$emit("connect", this.myDestination.session_id);
    },
    leaveMap: function () {
      this.inRoom = false;

      this.deleteMyDestination();
      this.sendMyDestination();

      // initialize room data
      this.officeMapId = "";
      this.mapData = null;
      this.myDestination = null;
      this.filledDestination.splice(0);
    },
    drawImage: function (canvas, imagePath, filledDestination) {
      // 画像読み込み
      const image = new Image();

      let self = this;
      image.addEventListener("load", () => {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, 800, 500);
        self.drawAttendeesIcon(filledDestination);
      });

      image.src = imagePath;
    },
    drawAttendeesIcon: function (filledDestination) {
      if (!filledDestination) return;

      let userInitial;
      let x;
      let y;

      let self = this;
      for (let i = 0; i < filledDestination.length; i++) {
        x =
          self.mapData[self.tables[filledDestination[i].table_num]][
            [`chair_${filledDestination[i].chair_num}`]
          ].centerX;
        y =
          self.mapData[self.tables[filledDestination[i].table_num]][
            [`chair_${filledDestination[i].chair_num}`]
          ].centerY;

        userInitial = filledDestination[i].seated_person.substr(0, 1);
        self.createIcon(x, y, userInitial);
      }
    },
    createIcon: function (x, y, userInitial) {
      const canvas = document.getElementById("image_board");
      const ctx = canvas.getContext("2d"); // コンテキストの取得

      let contextColor = "#ff7f50";

      /* コンテキスト設定 */
      // ctx.globalAlpha = 0.5; // 塗りつぶしは暗めの色
      ctx.fillStyle = contextColor; // 線は赤色
      ctx.strokeStyle = contextColor; // 塗りつぶしは暗めの色
      ctx.lineWidth = 5; // 線の幅は5px

      /* 円の描画 */
      ctx.beginPath(); // パスの初期化
      ctx.arc(x, y, 20, 0, 2 * Math.PI); // (100, 50)の位置に半径30pxの円
      ctx.closePath(); // パスを閉じる
      ctx.fill(); // 軌跡の範囲を塗りつぶす

      contextColor = "black";
      ctx.font = "36px Arial";
      ctx.fillStyle = contextColor; // 線は赤色
      ctx.strokeStyle = contextColor; // 塗りつぶしは暗めの色
      ctx.fillText(userInitial, x - 12, y + 12);
    },
  },
};
</script>

<style lang="scss" scoped>
#target {
  width: 1000px;
  height: 500px;
}

#target-imange {
  min-width: 100%;
  max-height: 100%;
}
</style>
