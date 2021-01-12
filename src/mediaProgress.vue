<template>
  <div class="media-progress" ref="progress">
    <div class="media-progress-outer">
      <div class="media-progress-inner" :style="{ background: progressColor, width: `${progressWidth}px` }">
        <span
          v-if="showSlider"
          class="media-progress-slider"
          :style="{ background: progressColor }"
          ref="slider"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaProgress',
  model: {
    prop: 'percent'
  },
  props: {
    percent: {
      type: Number,
      default: 0
    },
    // 进度条的颜色
    progressColor: {
      type: String,
      default: '#345dde'
    },
    showSlider: {
      type: Boolean,
      default: true
    },
    isControlDraggable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      curPercent: this.percent,
      width: 0, // 进度条的宽度
      isOperating: false
    };
  },
  computed: {
    // 进度条当前的宽度
    progressWidth() {
      return this.width / 100 * this.curPercent;
    }
  },
  watch: {
    percent: function(newValue) {
      if (this.isOperating) return;
      this.curPercent = newValue;
    }
  },
  mounted() {
    this.width = this.$refs.progress.offsetWidth;
    this.addListener();
  },
  beforeDestroy() {
    this.removeListener();
  },
  methods: {
    addListener() {
      const $progress = this.$refs.progress;

      // reCalculate progress.width when progress resize
      const $video = document.getElementById('video');
      this.observer = new MutationObserver(() => {
        this.width = $progress.offsetWidth;
      });
      this.observer.observe($video, { attributes: true, attributesFilter: ['style'] });

      let distance = 0;
      $progress.ontouchstart = e => {
        if (!this.isControlDraggable) return;

        this.isOperating = true;
        distance = $progress.offsetLeft; // 得出progress距离左视口距离
        const touchPos = this.getTouchPosition(e);
        this.calcuPercent(touchPos - distance);
        this.$emit('input', this.curPercent);
      };
      $progress.ontouchmove = e => {
        e.preventDefault();
        if (!this.isControlDraggable) return;
        // if (!this.isOperating) return;

        // 判断是否已经超出进度条的长度
        const touchPos = this.getTouchPosition(e);
        if (touchPos - distance >= 0 && touchPos - distance <= this.width) {
          this.calcuPercent(touchPos - distance);
          this.$emit('input', this.curPercent);
        }
      };
      $progress.ontouchend = () => {
        this.isOperating = false;
        this.$emit('change', this.curPercent);
      };
    },
    removeListener() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
    getTouchPosition(e) {
      const $video = document.getElementById('video');
      const orientation = $video.classList.contains('rotate') ? 'pageY' : 'pageX';
      return e.touches && e.touches[0] && e.touches[0][orientation] || 0;
    },
    // 算出百分比
    calcuPercent(progressWidth) {
      this.curPercent = progressWidth / this.width * 100;
    }
  }
};
</script>

<style scoped lang="less">
@width: 100%;
@height: 8px;
@border-radius: 4px;
@background-color: #345dde;
.media-progress {
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .media-progress-outer {
    width: @width;
    height: @height;
    border-radius: @border-radius;
    background: #eef1f7;
    position: relative;
    display: flex;
    align-items: center;

    .media-progress-inner {
      position: absolute;
      height: @height;
      background: @background-color;
      border-radius: @border-radius;
      .media-progress-slider {
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: @background-color;
        border: 4px solid #a3b6f0;
        z-index: 10;
        top: -10px;
        right: -14px;
        transition: all .3s;
      }
    }
  }
}
</style>
