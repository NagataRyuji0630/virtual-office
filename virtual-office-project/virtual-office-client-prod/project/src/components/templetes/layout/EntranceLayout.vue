<template>
  <div class="layout_container flex_container flex_container image_area">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
.flex_container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout_container {
  width: 100%;
  height: 100%;
}

.flex_direction_column {
  flex-direction: column;
}

.flex_direction_row {
  flex-direction: row;
}

.image_area {
  background: transparent linear-gradient(237deg, #1a94b1 0%, #5a55aa 100%) 0%
    0% no-repeat padding-box;
}

.form_area {
  width: 40%;
  height: 60%;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 40px;
}

@media screen and (max-width: 600px) {
  .form_area {
    width: 80%;
    height: 70%;
  }
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
  .form_area {
    width: 60%;
    height: 60%;
  }
}
</style>
