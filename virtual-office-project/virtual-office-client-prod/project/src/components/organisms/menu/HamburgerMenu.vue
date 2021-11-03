<template>
  <div class="humburger_menu_container">
    <ul class="list">
      <li v-for="(list, key) in listlabel" :key="key" class="list-item">
        <a
          href="#"
          v-bind:class="{ active: active === list }"
          @click="dropdown(list)"
          >{{ list }}</a
        >
        <ul v-if="active === list">
          <li
            v-for="(item, key) in sublistlabel"
            :key="key"
            class="sublist-item"
          >
            <a href="#" v-bind:label="item">{{ item }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "HumbrgerMenu",
  props: {},
  data: () => ({
    listlabel: ["Mens", "Womens", "Kids"],
    sublistlabel: ["Cloth", "Pants", "Shoes", "Goods"],
    active: "",
  }),
  created: function () {},
  methods: {
    dropdown(list) {
      console.log(this.active);
      this.active = this.active === list ? "" : list;
    },
  },
};
</script>

<style lang="scss" scoped>
.humburger_menu_container {
  width: 100%;
  height: 100%;
}

ul {
  padding: 0;
}
li {
  list-style: none;
}
a {
  color: #333;
  text-decoration: none;
}
.list {
  padding: 0;
  border: solid 1px #ccc;
}
.list-item a {
  position: relative;
  padding: 8px;
  border-bottom: solid 1px #ccc;
}
.list-item a {
  display: block;
}
.list-item:last-of-type a {
  border-bottom: none;
}
.list-item > a::after {
  content: "▼";
  position: absolute;
  top: 12px;
  right: 10px;
  font-size: 10px;
}
.list-item > a.active::after {
  content: "▲";
}
.sublist-item {
  font-size: 0.75rem;
}
@media screen and (max-width: 600px) {
}

@media screen and (min-width: 601px) and (max-width: 1024px) {
}
</style>
