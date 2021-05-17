## Video Component
视频播放器

## Features
- 支持自定义控制栏（伪全屏、进度条拖动）  
- 支持多个视频切换播放  
- 支持同层播放  
- 播放完毕自定义插槽  

### Props
<table>
  <tr>
    <th>参数</th>
    <th>说明</th>
    <th>类型</th>  
    <th>默认值</th>  
  </tr>
  <tr>
    <td>src</td>
    <td>视频播放地址</td>
    <td>String</td>  
    <td>无</td>  
  </tr>
  <tr>
    <td>poster</td>
    <td>预览封面，可以传入图片地址或者图片地址 src 和显示样式 style 的对象。<br />style 可选属性：<br />- default 居中1：1显示。<br />- stretch 拉伸铺满播放器区域，图片可能会变形。<br />- cover 优先横向等比拉伸铺满播放器区域，图片某些部分可能无法显示在区域内。</td>
    <td>String/Object</td>  
    <td>无</td>  
  </tr>
  <tr>
    <td>title</td>
    <td>视频标题</td>
    <td>String</td>  
    <td>无</td>  
  </tr>
  <tr>
    <td>width</td>
    <td>设置播放器宽度，单位为像素</td>
    <td>Number</td>  
    <td>100% (16:9)</td>  
  </tr>
  <tr>
    <td>height</td>
    <td>设置播放器高度，单位为像素</td>
    <td>Number</td>  
    <td>100% (16:9)</td>  
  </tr>
  <tr>
    <td>volume</td>
    <td>设置初始音量，范围0-1</td>
    <td>Number</td>  
    <td>0.5</td>  
  </tr>
  <tr>
    <td>autoplay</td>
    <td>是否自动播放<br /><span style="color: red;">大部分移动端浏览器不生效，必须静音播放</span></td>
    <td>Boolean</td>  
    <td>false</td>  
  </tr>
  <tr>
    <td>controls</td>
    <td>default 显示默认控件<br />none 不显示控件<br />custom 定制控件</td>
    <td>String</td>  
    <td>'default'</td>  
  </tr>
  <tr>
    <td>button-group</td>
    <td>controls = 'custom' 时定制控件按钮<br />控件可选属性(从左往右)：<br />- barrage 弹幕。<br />- volume 音量。<br />- systemFullscreen/fullscreen 全屏(系统/伪)。</td>
    <td>Array</td>  
    <td>['systemFullscreen']</td>  
  </tr>
  <tr>
    <td>x5-type</td>
    <td>video 属性'x5-video-player-type'声明 调用同层播放器</td>
    <td>Boolean</td>  
    <td>true</td>  
  </tr>
</table>

### Slots
| 事件 | 说明 |
| --- | --- |
| end | 视频播放结束时的自定义内容<template v-slot:end></template> |

### Events
| 事件 | 说明 | 参数 |
| --- | --- | --- |
| play | 播放视频回调事件 | event |
| pause | 暂停视频回调事件 | event |
| loaded-metadata | 元数据（比如分辨率和时长）被加载时运行的回调事件 | event |
| loaded-data | 媒介数据已加载时回调事件 | event |
| progress | 当浏览器正在获取媒介数据时运行的回调事件 | event |
| time-update | 当播放位置改变时（比如用户快进时）运行的回调事件 | event |
| ended | 当媒介已到达结尾时运行的回调事件 | event |
| error | 当在文件加载期间发生错误时运行的回调事件 | event |
| volume-change | 音量变化回调事件 | event |
| playing | 视频已开始播放时视频 | event |
| waiting | 视频已停止播放但打算继续播放时（缓冲中）事件 | event |

当音频/视频处于加载过程中时，会依次发生以下事件：
- [loadstart](https://www.w3school.com.cn/tags/av_event_loadstart.asp)
- [durationchange](https://www.w3school.com.cn/tags/av_event_durationchange.asp)
- [loadedmetadata](https://www.w3school.com.cn/tags/av_event_loadedmetadata.asp)
- [loadeddata](https://www.w3school.com.cn/tags/av_event_loadeddata.asp)
- [progress](https://www.w3school.com.cn/tags/av_event_progress.asp)
- [canplay](https://www.w3school.com.cn/tags/av_event_canplay.asp)
- [canplaythrough](https://www.w3school.com.cn/tags/av_event_canplaythrough.asp)
