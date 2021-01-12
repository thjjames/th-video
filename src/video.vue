<template>
  <div class="tuhu-video-wrap">
    <div id="video" class="wrap" ref="wrap">
      <div class="wrap-inner">
        <div class="container">
          <div class="ui-area" :style="videoStyle" v-if="!(controls === 'default' && isActive)" @click.self="clickUiArea">
            <span class="play-btn" @click.stop="play" v-show="!isPlaying"></span>
            <div :class="['control-bar', !isShowControlBar && 'hidden']" ref="controlBar" @click="onControlBarPersist" @touchmove="onControlBarPersist">
              <i :class="['icon left-btn', isPlaying ? 'icon-zanting' : 'icon-bofang1']" @click="togglePlay" />
              <span class="control-bar-progress">
                <span class="time">{{ `${formatMediaTime(currentTime)}/${formatMediaTime(duration)}` }}</span>
                <media-progress
                  ref="progress"
                  class="progress"
                  v-model="percent"
                  :isControlDraggable="isControlDraggable"
                  @change="onPercentChange"
                />
              </span>
              <span class="right-btn-group">
                <template v-for="item in buttonGroup">
                  <i v-if="item === 'barrage'" :class="['icon right-btn icon-danmu']" />
                  <i v-else-if="item === 'volume'" :class="['icon right-btn icon-yuyin']" />
                  <i v-else-if="item === 'systemFullscreen' || item === 'fullscreen'" :class="['icon right-btn', isFullscreen ? 'icon-suoxiao' : 'icon-fangda']" @click="toggleFullscreen()" />
                </template>
              </span>
            </div>
            <div class="ended-wrap" v-if="isEnded && endedConfig">
              <div class="ended-btn-group">
                <button 
                  v-for="item in endedConfig.buttonGroup" 
                  :style="{color: item.color, borderColor: item.color}"
                  @click.stop="isEnded = false; item.callback($refs.video);"
                >
                  {{item.text}}
                </button>
              </div>
            </div>
            <div class="barrage-wrap" ref="barrage"></div>
          </div>
          <div class="player-area" :style="videoStyle">
            <video 
              ref="video"
              :src="src" 
              :style="videoStyle"
              :controls="controls === 'default'"
              :muted="curVolume <= 0"
              :x5-video-player-type="x5Type && 'h5'"
              :x5-video-player-fullscreen="true"
              preload
              playsinline
              webkit-playsinline
              x-webkit-airplay="allow"
              @play="onPlay"
              @pause="onPause"
              @loadedmetadata="onLoadedmetadata"
              @loadeddata="onLoadeddata"
              @progress="onProgress"
              @timeupdate="onTimeUpdate"
              @ended="onEnded"
              @error="onError"
              @volumechange="onVolumeChange"
            />
            <div class="poster" :style="videoStyle" v-if="poster && !isActive">
              <img 
                :class="[poster.style ? poster.style : 'default']"
                :src="poster.src || poster" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MediaProgress from './mediaProgress.vue';
import throttle from 'lodash.throttle';

export default {
  name: 'th-video',
  components: {
    MediaProgress
  },
  props: {
    src: {
      type: String
    },
    poster: {
      type: [String, Object]
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    volume: {
      type: Number,
      default: 0.5
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    controls: {
      type: String,
      default: 'default' // oneOf ['default', 'none', 'custom']
    },
    buttonGroup: {
      type: Array,
      default: () => { return ['systemFullscreen']; }
    },
    isControlDraggable: {
      type: Boolean,
      default: true
    },
    x5Type: {
      type: Boolean,
      default: true
    },
    endedConfig: {
      type: Object,
      default: () => { return null; }
    }
  },
  data() {
    return {
      isPlaying: false, // 是否播放中
      isEnded: false, // 是否触发播放结束状态
      isActive: false, // 是否激活->取消封面
      curVolume: this.volume,
      percent: 0, // 媒体进度条百分比
      duration: 0, // 媒体长度(秒)
      currentTime: 0, // 视频当前播放位置(秒)
      isShowControlBar: false, // 控件栏展示状态
      controlBarTimeout: null, // 控件栏隐藏延时时间(毫秒)
      isFullscreen: false, // 是否全屏状态
      isInApp: (() => {
        const ua = navigator.userAgent.toLowerCase();
        return ua.includes('lanhu') || ua.includes('tuhuyixing');
      })()
    };
  },
  computed: {
    videoStyle() {
      return {
        width: this.width ? `${this.width}px` : '100%',
        height: this.height ? `${this.height}px` : '100%'
      };
    }
  },
  watch: {
    src(newVal, oldVal) {
      if (newVal === oldVal) return;

      this.isEnded = false;
      if (this.autoplay) {
        const volume = this.curVolume;
        this.curVolume = 0;
        setTimeout(() => {
          this.play();
          // this.curVolume = volume;
        }, 500);
      } else {
        // this.pause();
        this.isPlaying = false;
        this.isActive = false;
      }
    },
    volume(newVal) {
      this.curVolume = newVal;
    },
    percent(newVal) {
      this.currentTime = this.duration * newVal / 100;
    }
  },
  mounted() {
  },
  methods: {
    play: throttle(function() {
      this.$refs.video.play();
    }, 888, { trailing: false }),
    pause: throttle(function() {
      this.$refs.video.pause();
    }, 888, { trailing: false }),
    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play()
      }
    },
    toggleFullscreen() {
      const isSystem = this.buttonGroup.includes('systemFullscreen');
      const element = this.$refs[isSystem ? 'video' : 'wrap'];
      const isSystemFullscreen = document.fullscreen ||
        document.webkitIsFullscreen ||
        document.webkitRequestFullscreen ||
        document.mozFullscreen ||
        document.mozRequestFullscreen ||
        document.msFullscreenEnabled;

      if (isSystem) {
        if (isSystemFullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullscreen) {
            document.mozCancelFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullscreen) {
            element.mozRequestFullscreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.webkitEnterFullscreen) {
            element.webkitEnterFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        }
      } else {
        if (this.isFullscreen) {
          element.classList.remove('fullscreen', this.isInApp && 'rotate');
        } else {
          element.classList.add('fullscreen', this.isInApp && 'rotate');
        }
        this.isFullscreen = !this.isFullscreen;
      }
    },
    clickUiArea() {
      // 非播放或非控制栏时
      if (!this.isPlaying) return;

      if (this.isShowControlBar) {
        clearTimeout(this.controlBarTimeout);
        this.isShowControlBar = false;
      } else {
        this.isShowControlBar = true;
        this.controlBarTimeout = setTimeout(() => {
          this.isShowControlBar = false;
        }, 2000);
      }
    },
    formatMediaTime(time) {
      const hour = ~~(time / 3600);
      let min = ~~(time / 60) % 60;
      let sec = ~~time % 60;

      if (min < 10) {
        min = '0' + min;
      }
      if (sec < 10) {
        sec = '0' + sec;
      }
      return hour > 0 ? `${hour}:${min}:${sec}` : `${min}:${sec}`;
    },
    onPercentChange(per) {
      const currentTime = this.duration * per / 100;
      this.$refs.video.currentTime = currentTime;
    },
    onControlBarPersist() {
      clearTimeout(this.controlBarTimeout);
      this.controlBarTimeout = setTimeout(() => {
        this.isShowControlBar = false;
      }, 2000);
    },

    /* video events start */
    onPlay(e) {
      this.isPlaying = true;
      this.isActive = true;
      this.$emit('play', e);
    },
    onPause(e) {
      this.isPlaying = false;
      this.$emit('pause', e);
    },
    onLoadedmetadata(e) {
      this.duration = e.target.duration;
      this.$emit('loadedmetadata', e);
    },
    onLoadeddata(e) {
      this.$emit('loadeddata', e);
    },
    onProgress(e) {
      this.$emit('progress', e);
    },
    onTimeUpdate(e) {
      // Fix部分安卓机必须播放后才能取到时长
      if (this.duration !== e.target.duration) {
        this.duration = e.target.duration;
      }

      // 防止playing下遮罩存在
      if (this.isEnded) {
        this.isEnded = false;
      }

      // 操作进度条时 更新进度条操作时间而非当前时间
      const $progress = this.$refs.progress;
      if ($progress && $progress.isOperating) return;

      this.currentTime = e.target.currentTime;
      this.percent = this.currentTime / this.duration * 100;
      this.$emit('time-update', e);
    },
    onEnded(e) {
      this.isEnded = true;
      this.$emit('ended', e);
    },
    onError(e) {
      this.$emit('error', e);
    },
    onVolumeChange(e) {
      this.$emit('volume-change', e);
    }
    /* video events end */
  }
};
</script>

<style lang="less">
@import "~tuhu-iconfont-miniprogram/src/shopApp.less";
.tuhu-video-wrap {
  -webkit-tap-highlight-color: transparent;
  padding-top: 56.25%;
  position: relative;
  width: 100%;
  height: 0;
  .wrap {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    &.fullscreen {
      object-fit: contain;
      position: fixed !important;
      top: 0px !important;
      right: 0px !important;
      bottom: 0px !important;
      left: 0px !important;
      box-sizing: border-box !important;
      min-width: 0px !important;
      max-width: none !important;
      min-height: 0px !important;
      max-height: none !important;
      width: 100% !important;
      height: 100% !important;
      transform: none !important;
      margin: 0px !important;
      z-index: 10000 !important;
    }
    &.rotate {
      transform: rotate(90deg) translate3d(0, 0, 0) !important;
      transform-origin: 0 !important;
      top: -50vw !important;
      left: 50% !important;
      width: 100vh !important; // H5浏览器需要另外减去头部高度
      height: 100vw !important;
    }
    .wrap-inner {
      display: inline-block;
      width: 100%;
      height: 100%;
      .container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        .ui-area {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          user-select: none;
          z-index: 2;
          transform: translateZ(0);
          .play-btn {
            position: relative;
            display: block;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 104px;
            height: 104px;
            background-image: url(data:image/png;base64,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);
            background-size: 100% 100%;
            z-index: 10;
          }
          .control-bar {
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            height: 88px;
            line-height: 88px;
            color: #fff;
            z-index: 5;
            background-image: linear-gradient(-180deg, transparent 27%, rgba(0, 0, 0, .65));
            opacity: 1;
            transition: all .3s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &.hidden {
              opacity: 0 !important;
              transform: translate(0, 100%) !important;
            }
            span, i {
              // width: 36px;
              // height: 36px;
              font-size: 36px;
            }
            .control-bar-progress {
              margin: 0 32px;
              width: 100%;
              height: 100%;
              flex: 0 1 auto;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .time {
                width: 180px;
                margin-right: 12px + 14px;
                font-size: 24px !important;
                color: #fff;
                text-align: right;
                flex: 0 0 auto;
              }
              .progress {
                width: 100%;
                height: 100%;
                flex: 0 1 auto;
              }
            }
            .left-btn {
              float: left;
              margin-left: 32px;
            }
            .right-btn-group {
              display: flex;
              align-items: center;
              flex: 0 1 auto;
              .right-btn {
                float: right;
                margin-right: 32px;
                &.selected {
                  color: #345dde !important;
                }
              }
            }
          }
          .ended-wrap {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            z-index: 1000;
            background-color: rgba(0, 0, 0, .8);
            display: flex;
            align-items: center;
            justify-content: center;
            .ended-btn-group {
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
                &:not(:first-child) {
                  margin-left: 16px;
                }
              }
            }
          }
          .barrage-wrap {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
          }
        }
        .player-area {
          z-index: 0;
          background-color: #000;
          // width: 100%;
          // height: 100%;
          video {
            display: block;
            overflow: hidden;
            // width: 100%;
            // height: 100%;
          }
          .poster {
            position: absolute;
            left: 0;
            top: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
            // display: none;
            img {
              position: relative;
              &.default, &.cover {
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
              }
              &.stretch {
                width: 100%;
                height: 100%;
              }
              &.cover {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>