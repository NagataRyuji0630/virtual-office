<template>
  <div id="target">
    <!-- <img src="../../../assets/house-type.png" id="target-imange" /> -->
    <canvas id="image_board" width="800" height="500"></canvas>
  </div>
</template>

<script>
import homeStyleImageSetting from "../../../assets/config/home-style-config";
import imageAreaMixin from "../../../mixin/imageAreaMixin";
export default {
  name: "HomeStyleImage",
  data: () => ({
    offsetX: 0,
    offsetY: 0,
    chairs: [
      homeStyleImageSetting.leftSofa.action.name,
      homeStyleImageSetting.rightSofa.action.name,
      homeStyleImageSetting.topLivingChair.action.name,
      homeStyleImageSetting.bottomLivingChair.action.name,
    ],
    iconLogo: "",
    image: "",
  }),
  mixins: [imageAreaMixin],
  created: function () {
    this.iconLogo = this.$store.getters["commonStore/getUserName"].substr(0, 1);
    let target;
    let self = this;
    setTimeout(() => {
      const canvas = document.getElementById("image_board");
      let imagePath = require("../../../assets/house-type.png");
      this.drawImage(canvas, imagePath);

      target = document.getElementById("target");
      target.addEventListener("dblclick", function (e) {
        self.offsetX = e.offsetX; // =>要素左上からのx座標
        self.offsetY = e.offsetY; // =>要素左上からのy座標

        let destination = self.getDestination();

        if (destination != null) self.drawMyIcon(destination);
      });
    }, 100);
  },
  methods: {
    drawImage: function (canvas, imagePath) {
      // 画像読み込み
      const image = new Image();

      image.addEventListener("load", () => {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, 1000, 500);
      });

      image.src = imagePath;
    },
    drawMyIcon: function (destination) {
      let x = homeStyleImageSetting[destination].centerX;
      let y = homeStyleImageSetting[destination].centerY;

      const canvas = document.getElementById("image_board");
      const ctx = canvas.getContext("2d"); // コンテキストの取得

      /* コンテキスト設定 */
      ctx.strokeStyle = "#333"; // 塗りつぶしは暗めの色
      ctx.fillStyle = "#f00"; // 線は赤色
      ctx.lineWidth = 5; // 線の幅は5px

      /* 円の描画 */
      ctx.beginPath(); // パスの初期化
      ctx.arc(x, y, 20, 0, 2 * Math.PI); // (100, 50)の位置に半径30pxの円
      ctx.closePath(); // パスを閉じる
      ctx.fill(); // 軌跡の範囲を塗りつぶす
    },
    cutCircle: function (ctx) {
      ctx.clearRect(0, 0, 100, 100);
      ctx.beginPath(); //これが必要！！！!!!
      ctx.arc(200, 100, 20, 0, Math.PI * 2, true);
      ctx.stroke();
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
