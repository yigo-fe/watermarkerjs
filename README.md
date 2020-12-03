# watermark.js

一个可以给页面添加水印的插件，提供两种显示方式svg和canvas
## Usage

```js
import Watermark from 'watermarkerjs'
 Watermark('水印', {
    selector: '#watermask',
    fontSize: 14,
    type: 'svg'|'canvas',
  })
```
返回一个实例对象
```
实例方法
addInlineStyle  添加行内样式
addStyleElement 添加内联样式
freeze          冻结防止修改样式
destroy         实例销毁
```
