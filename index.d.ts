import './util/polyfill'
import CanvasWM from './types/CanvasWM'
import SvgWM from './types/SvgWM'
export { CanvasWM, SvgWM }
export const AddWaterMark:any
export declare enum WatermarkType {
  SVG = 'svg',
  CanvasWM = 'canvas',
}
export interface IWatermarkOptions {
  color?: string
  fontSize?: number
  fontWeight?: string
  fontFamily?: string
  gap?: number
  inline?: boolean
  invisibleColor?: string
  rotate?: number
  selector?: string
  type?: WatermarkType
}
export declare class Watermark {
  private text
  private options
  constructor(text: string, options?: IWatermarkOptions)
  update(text: string, options?: IWatermarkOptions): void
  /**
   * 冻结水印DOM，不允许修改和删除操作
   */
  freeze(cb?: (params?: any) => void): void
  destroy(): void
  private addInlineStyle
  /**
   * 在`<head>`标签中添加内联的样式
   *
   * @param style 需要被内联的样式
   */
  private addStyleElement
}
declare const _default: (text: string, options?: IWatermarkOptions) => Watermark
export default _default
