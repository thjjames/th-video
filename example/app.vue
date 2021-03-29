<template>
  <div class="container">
    <th-video 
      ref="video"
      :src="src"
      :poster="poster"
      title="田豪峻测试"
      :controls="'custom'"
      :button-group="['fullscreen']"
    >
      <template v-slot:end>
        <button @click="$refs.video.play()">再看一遍</button>
      </template>
    </th-video> 
    <button @click="clickButton">切换视频</button>
    <th-video 
      :src="src"
      :poster="poster"
      :autoplay="true"
    />
  </div>
</template>

<script >
import thVideo from '@/video.vue';

export default {
  components: {
    thVideo
  },
  data() {
    return {
      index: 0,
      src: '',
      poster: {
        src: 'https://img2.tuhu.org/tech/pic/ea5PVZGEz4jM5XOYBoHG5A_w700_h747.png',
        style: 'cover'
      }
    }
  },
  mounted() {
    this.src = 'https://v.tuhu.org/videos/tech/video/lgnKTfTT-cu9YNR1nJWSOXka5s9h.mp4';
  },
  methods: {
    clickButton() {
      this.index = ++this.index;
      this.src = [
        'https://v.tuhu.org/videos/tech/video/lgnKTfTT-cu9YNR1nJWSOXka5s9h.mp4',
        'https://img1.tuhu.org/videos/tech/video/lv8QcJAkwBVyB8AVAD9uiYxLAwCc.mp4',
        'https://img1.tuhu.org/videos/tech/video/llv5lIZRf6_wcJv8xP_sowMPbNCO.mp4'
      ][this.index];
    }
  }
};
</script>

<style lang="less">
@import "~tuhu-iconfont-miniprogram/src/shopApp.less";
body {
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  .container {
    margin: 0;
    .tuhu-video-wrap {
      margin-top: 20px;
      button {
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        border: 2px solid #345dde;
        user-select: none;
        outline: 0;
        min-height: 64px;
        min-width: 96px;
        padding: 8px 16px;
        border-radius: 16px;
        color: #345dde;
        background-color: transparent;
        font-size: 28px;
        font-weight: 500;
      }
    }
  }
}
</style>
