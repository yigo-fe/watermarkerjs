import { IWatermarkOptions } from '../index'
export default abstract class BaseWM {
  protected options: IWatermarkOptions
  private readonly DefaultFontFamily
  constructor(options: IWatermarkOptions)
  /**
   * 将水印文字转换成水印图片的Base64编码
   * @param wmText 水印文字
   */
  abstract toDataURI(wmText: string): string
  /**
   * 生成样式字符串
   *
   * @param wmText 水印文字
   * @param selector 样式选择器
   */
  abstract genStyle(wmText: string): string
  /**
   * 获取真实的8位长度，这是由于浏览器在进行渲染的时候
   * 8位的字符算作0.5个font，16位字符算作一个font
   *
   * @param text 待测试的字符串
   */
  protected getActualLength(text: string): number
}
