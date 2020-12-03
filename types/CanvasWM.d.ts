import BaseWM from './BaseWM'
export default class CanvasWM extends BaseWM {
  toDataURI(wmText: string): string
  genStyle(wmText: string): string
}
