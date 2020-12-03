import BaseWM from './BaseWM'
export default class SvgWM extends BaseWM {
  toDataURI(wmText: string): string
  genStyle(wmText: string): string
}
