# watermarkerjs

一个可以给页面添加水印的插件，提供两种显示方式svg和canvas
## Usage

```js
import Watermark from 'watermarkerjs'
 Watermark('水印', {
     color: string,
      fontSize: number,
      fontWeight: string,
      fontFamily: string,
      gap: number,
      inline: boolean,
      invisibleColor: string,
      rotate: number,
      selector: string,
      type: WatermarkType,
  })
```
返回一个实例对象
```
实例方法
freeze          冻结防止修改样式
destroy         实例销毁
```
