if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    configurable: true,
    value: function assign(target, varArgs) {
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object')
      }
      let to = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        let nextSource = arguments[index]
        if (nextSource != null) {
          // Skip over if undefined or null
          for (let nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
  })
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt#Polyfill
/* ! https://mths.be/codepointat v0.2.0 by @mathias */
if (typeof String.prototype.codePointAt !== 'function') {
  let codePointAt = function(position) {
    if (this === null) {
      throw TypeError()
    }
    let str = String(this)
    let size = str.length
    // `ToInteger`
    let index = position ? Number(position) : 0
    if (index !== index) {
      // better `isNaN`
      index = 0
    }
    // Account for out-of-bounds indices:
    if (index < 0 || index >= size) {
      return undefined
    }
    // Get the first code unit
    let first = str.charCodeAt(index)
    let second
    if (
      // check if it’s the start of a surrogate pair
      first >= 0xd800 &&
      first <= 0xdbff && // high surrogate
      size > index + 1 // there is a next code unit
    ) {
      second = str.charCodeAt(index + 1)
      if (second >= 0xdc00 && second <= 0xdfff) {
        // low surrogate
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        return (first - 0xd800) * 0x400 + second - 0xdc00 + 0x10000
      }
    }
    return first
  }
  Object.defineProperty(String.prototype, 'codePointAt', {
    configurable: true,
    value: codePointAt,
    writable: true,
  })
}

/* ! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
  extendStatics =
    Object.setPrototypeOf ||
    ({
      __proto__: [],
    } instanceof Array &&
      function(d, b) {
        d.__proto__ = b
      }) ||
    function(d, b) {
      for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
    }
  return extendStatics(d, b)
}

function __extends(d, b) {
  extendStatics(d, b)

  function __() {
    this.constructor = d
  }
  d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
}

let BaseWM = /** @class */ (function() {
  function BaseWM(options) {
    this.DefaultFontFamily = "'PingFang SC', 'Microsoft YaHei',\n  'Helvetica Neue', Helvetica, Arial, sans-serif"
    this.options = options
    this.options.color = this.options.color || 'rgba(0, 0, 0, .07)'
    this.options.fontSize = this.options.fontSize || 16
    this.options.fontWeight = this.options.fontWeight || 'normal'
    this.options.fontFamily = this.options.fontFamily || this.DefaultFontFamily
    this.options.invisibleColor = this.options.invisibleColor || 'transparent'
    this.options.rotate = this.options.rotate || -20
    this.options.gap = this.options.gap || 120
  }
  /**
   * 获取真实的8位长度，这是由于浏览器在进行渲染的时候
   * 8位的字符算作0.5个font，16位字符算作一个font
   *
   * @param text 待测试的字符串
   */
  BaseWM.prototype.getActualLength = function(text) {
    let len = 0
    for (let _i = 0, text_1 = text; _i < text_1.length; _i++) {
      let t = text_1[_i]
      if (t.codePointAt(0) >= 256) {
        len += 2
      } else {
        len += 1
      }
    }
    return len
  }
  return BaseWM
})()

let CanvasWM = /** @class */ (function(_super) {
  __extends(CanvasWM, _super)

  function CanvasWM() {
    return _super.apply(this, arguments) || this
  }
  CanvasWM.prototype.toDataURI = function(wmText) {
    let len = this.getActualLength(wmText)
    let _a = this.options
    let color = _a.color
    let fontFamily = _a.fontFamily
    let fontSize = _a.fontSize
    let fontWeight = _a.fontWeight
    let gap = _a.gap
    let rotate = _a.rotate
    let width = (len * fontSize) / 2 + gap
    let canvas = document.createElement('canvas')
    canvas.setAttribute('width', width + 'px')
    canvas.setAttribute('height', width + 'px')
    let ctx = canvas.getContext('2d')
    // canvas rotate 方法
    // https://segmentfault.com/a/1190000009449999
    ctx.translate(width / 2, width / 2)
    ctx.rotate((rotate * Math.PI) / 180)
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, width, width)
    ctx.translate(-width / 2, -width / 2)
    ctx.fillStyle = String(color)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = fontWeight + ' ' + fontSize + 'px  ' + fontFamily
    ctx.fillText(wmText, width / 2, width / 2)
    return canvas.toDataURL()
  }
  CanvasWM.prototype.genStyle = function(wmText) {
    let dataURI = this.toDataURI(wmText)
    let len = this.getActualLength(wmText)
    let _a = this.options
    let fontSize = _a.fontSize
    let gap = _a.gap
    let width = (len * fontSize) / 2 + gap
    return (
        '\n      background-image: url(' +
        dataURI +
        '), url(' +
        dataURI +
        ');\n      background-repeat: repeat, repeat;\n      background-position: ' +
        width / 2 +
        'px ' +
        width / 2 +
        'px, 0 0;\n    '
    )
  }
  return CanvasWM
})(BaseWM)

let commonjsGlobal =
    typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : typeof self !== 'undefined'
            ? self
            : {}

function createCommonjsModule(fn, module) {
  return (
      (module = {
        exports: {},
      }),
          fn(module, module.exports),
          module.exports
  )
}

let base64 = createCommonjsModule(function(module, exports) {
  ;(function(global, factory) {
    module.exports = factory(global)
  })(typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : commonjsGlobal, function(global) {
    // existing version for noConflict()
    let _Base64 = global.Base64
    let version = '2.4.9'
    // if node.js and NOT React Native, we use Buffer
    let buffer
    if (module.exports) {
      try {
        buffer = eval("require('buffer').Buffer")
      } catch (err) {
        buffer = undefined
      }
    }
    // constants
    let b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let b64tab = (function(bin) {
      let t = {}
      for (let i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i
      return t
    })(b64chars)
    let fromCharCode = String.fromCharCode
    // encoder stuff
    let cb_utob = function(c) {
      if (c.length < 2) {
        var cc = c.charCodeAt(0)
        return cc < 0x80
            ? c
            : cc < 0x800
                ? fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))
                : fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) +
                fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
                fromCharCode(0x80 | (cc & 0x3f))
      } else {
        var cc = 0x10000 + (c.charCodeAt(0) - 0xd800) * 0x400 + (c.charCodeAt(1) - 0xdc00)
        return (
            fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) +
            fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) +
            fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
            fromCharCode(0x80 | (cc & 0x3f))
        )
      }
    }
    let re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g
    let utob = function(u) {
      return u.replace(re_utob, cb_utob)
    }
    let cb_encode = function(ccc) {
      let padlen = [0, 2, 1][ccc.length % 3]
      let ord =
          (ccc.charCodeAt(0) << 16) |
          ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) |
          (ccc.length > 2 ? ccc.charCodeAt(2) : 0)
      let chars = [
        b64chars.charAt(ord >>> 18),
        b64chars.charAt((ord >>> 12) & 63),
        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
        padlen >= 1 ? '=' : b64chars.charAt(ord & 63),
      ]
      return chars.join('')
    }
    let btoa = global.btoa
        ? function(b) {
          return global.btoa(b)
        }
        : function(b) {
          return b.replace(/[\s\S]{1,3}/g, cb_encode)
        }
    let _encode = buffer
        ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from
            ? function(u) {
              return (u.constructor === buffer.constructor ? u : buffer.from(u)).toString('base64')
            }
            : function(u) {
              return (u.constructor === buffer.constructor ? u : new buffer(u)).toString('base64')
            }
        : function(u) {
          return btoa(utob(u))
        }
    let encode = function(u, urisafe) {
      return !urisafe
          ? _encode(String(u))
          : _encode(String(u))
              .replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_'
              })
              .replace(/=/g, '')
    }
    let encodeURI = function(u) {
      return encode(u, true)
    }
    // decoder stuff
    let re_btou = new RegExp(
        ['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'),
        'g'
    )
    let cb_btou = function(cccc) {
      switch (cccc.length) {
        case 4:
          var cp =
              ((0x07 & cccc.charCodeAt(0)) << 18) |
              ((0x3f & cccc.charCodeAt(1)) << 12) |
              ((0x3f & cccc.charCodeAt(2)) << 6) |
              (0x3f & cccc.charCodeAt(3))
          var offset = cp - 0x10000
          return fromCharCode((offset >>> 10) + 0xd800) + fromCharCode((offset & 0x3ff) + 0xdc00)
        case 3:
          return fromCharCode(
              ((0x0f & cccc.charCodeAt(0)) << 12) | ((0x3f & cccc.charCodeAt(1)) << 6) | (0x3f & cccc.charCodeAt(2))
          )
        default:
          return fromCharCode(((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1)))
      }
    }
    let btou = function(b) {
      return b.replace(re_btou, cb_btou)
    }
    let cb_decode = function(cccc) {
      let len = cccc.length
      let padlen = len % 4
      let n =
          (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) |
          (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) |
          (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) |
          (len > 3 ? b64tab[cccc.charAt(3)] : 0)
      let chars = [fromCharCode(n >>> 16), fromCharCode((n >>> 8) & 0xff), fromCharCode(n & 0xff)]
      chars.length -= [0, 0, 2, 1][padlen]
      return chars.join('')
    }
    let atob = global.atob
        ? function(a) {
          return global.atob(a)
        }
        : function(a) {
          return a.replace(/[\s\S]{1,4}/g, cb_decode)
        }
    let _decode = buffer
        ? buffer.from && Uint8Array && buffer.from !== Uint8Array.from
            ? function(a) {
              return (a.constructor === buffer.constructor ? a : buffer.from(a, 'base64')).toString()
            }
            : function(a) {
              return (a.constructor === buffer.constructor ? a : new buffer(a, 'base64')).toString()
            }
        : function(a) {
          return btou(atob(a))
        }
    let decode = function(a) {
      return _decode(
          String(a)
              .replace(/[-_]/g, function(m0) {
                return m0 == '-' ? '+' : '/'
              })
              .replace(/[^A-Za-z0-9\+\/]/g, '')
      )
    }
    let noConflict = function() {
      let Base64 = global.Base64
      global.Base64 = _Base64
      return Base64
    }
    // export Base64
    global.Base64 = {
      VERSION: version,
      atob: atob,
      btoa: btoa,
      fromBase64: decode,
      toBase64: encode,
      utob: utob,
      encode: encode,
      encodeURI: encodeURI,
      btou: btou,
      decode: decode,
      noConflict: noConflict,
      __buffer__: buffer,
    }
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
      let noEnum = function(v) {
        return {
          value: v,
          enumerable: false,
          writable: true,
          configurable: true,
        }
      }
      global.Base64.extendString = function() {
        Object.defineProperty(
            String.prototype,
            'fromBase64',
            noEnum(function() {
              return decode(this)
            })
        )
        Object.defineProperty(
            String.prototype,
            'toBase64',
            noEnum(function(urisafe) {
              return encode(this, urisafe)
            })
        )
        Object.defineProperty(
            String.prototype,
            'toBase64URI',
            noEnum(function() {
              return encode(this, true)
            })
        )
      }
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) {
      // Meteor.js
      Base64 = global.Base64
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (module.exports) {
      module.exports.Base64 = global.Base64
    }
    // that's it!
    return {
      Base64: global.Base64,
    }
  })
})
let base64_1 = base64.Base64

let SvgWM = /** @class */ (function(_super) {
  __extends(SvgWM, _super)

  function SvgWM() {
    return _super.apply(this, arguments) || this
  }
  SvgWM.prototype.toDataURI = function(wmText) {
    let len = this.getActualLength(wmText)
    let _a = this.options
    let color = _a.color
    let fontFamily = _a.fontFamily
    let fontSize = _a.fontSize
    let fontWeight = _a.fontWeight
    let gap = _a.gap
    let rotate = _a.rotate
    let width = (len * fontSize) / 2 + gap
    let svg =
      '\n      <svg xmlns="http://www.w3.org/2000/svg"\n        width="' +
      width +
      '" height="' +
      width +
      '"\n        style="transform: rotate(' +
      rotate +
      'deg); transform-origin: 50% 50%;">\n          <text xmlns="http://www.w3.org/2000/svg"\n            x="50%" y="50%" text-anchor="middle" alignment-baseline="middle"\n            fill="' +
      color +
      '"\n            font-weight="' +
      fontWeight +
      '"\n            style="font-size: ' +
      fontSize +
      'px;"\n            font-family="' +
      fontFamily +
      '">\n              ' +
      wmText +
      '\n          </text>\n      </svg>\n    '
    return 'data:image/svg+xml;base64,' + base64_1.encode(svg)
  }
  SvgWM.prototype.genStyle = function(wmText) {
    let dataURI = this.toDataURI(wmText)
    let len = this.getActualLength(wmText)
    let _a = this.options
    let fontSize = _a.fontSize
    let gap = _a.gap
    let width = (len * fontSize) / 2 + gap
    return (
      '\n      background-image: url(' +
      dataURI +
      '), url(' +
      dataURI +
      ');\n      background-repeat: repeat, repeat;\n      background-position: ' +
      width / 2 +
      'px ' +
      width / 2 +
      'px, 0 0;\n    '
    )
  }
  return SvgWM
})(BaseWM)

function observeSelector(targetNode, cb) {
  if (!targetNode) {
    return
  }
  let config = {
    attributes: true,
    childList: true,
    subtree: true,
  }
  // origin dom
  let originNode = targetNode.cloneNode(true)
  let parentNode = targetNode.parentNode || document.body
  let callback = function(mutationsList) {
    if (targetNode) {
      mutationsList.forEach(function(mutation) {
        let target = mutation.target
        let removeTarget = Array.prototype.slice.call(mutation.removedNodes)[0]
        if (target === targetNode) {
          // remove dirty dom
          let newNode = originNode.cloneNode(true)
          parentNode.replaceChild(newNode, targetNode)
          targetNode = newNode
          if (typeof cb === 'function') {
            cb()
          }
        } else if (removeTarget === targetNode) {
          targetNode = targetNode.cloneNode(true)
          parentNode.appendChild(targetNode)
          if (typeof cb === 'function') {
            cb()
          }
        }
      })
    }
  }
  let observer = new MutationObserver(callback)
  observer.observe(document.body, config)
}

function loadjs(url, cb) {
  let head = document.getElementsByTagName('head').item(0)
  let script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', url)
  if (head) {
    head.appendChild(script)
    if (typeof cb === 'function') {
      script.onload = cb
    }
  }
}

function watermarkObserver(selector, cb) {
  let node = document.querySelector(selector)
  if (node) {
    // 移除水印class 防止人为样式修改
    node.removeAttribute('class')
    // https://github.com/Microsoft/TypeScript/issues/11305
    // Node 是 Element 的基类
    if (typeof MutationObserver === 'undefined') {
      loadjs('//unpkg.pstatp.com/mutationobserver-shim/0.3.3/dist/mutationobserver.min.js', function() {
        observeSelector(node, cb)
      })
    } else {
      observeSelector(node, cb)
    }
  }
}

/* tslint:disable */
let WatermarkType
;(function(WatermarkType) {
  WatermarkType['SVG'] = 'svg'
  WatermarkType['CanvasWM'] = 'canvas'
})(WatermarkType || (WatermarkType = {}))
let Watermark = /** @class */ (function() {
  function Watermark(text, options) {
    if (options === void 0) {
      options = {}
    }
    this.text = text
    this.options = options
    this.update(text, options)
  }
  Watermark.prototype.update = function(text, options) {
    if (options === void 0) {
      options = {}
    }
    this.destroy()
    this.text = text
    this.options = Object.assign(this.options, options)
    if (!this.text) {
      throw new Error('水印文字不能为空')
    }
    this.options.selector = this.options.selector || '.watermark'
    this.options.type = this.options.type || WatermarkType.CanvasWM
    let _a = this.options
    let type = _a.type
    let inline = _a.inline
    let wm = null
    switch (type) {
      case WatermarkType.SVG:
        wm = new SvgWM(this.options)
        break
      case WatermarkType.CanvasWM:
        wm = new CanvasWM(this.options)
        break
    }
    let style = wm.genStyle(text)
    if (inline) {
      this.addInlineStyle(style)
    } else {
      this.addStyleElement(style)
    }
  }
  /**
   * 冻结水印DOM，不允许修改和删除操作
   */
  Watermark.prototype.freeze = function(cb) {
    let selector = this.options.selector
    watermarkObserver(selector, cb)
  }
  Watermark.prototype.destroy = function() {
    if (!this.options) {
      return
    }
    let selector = this.options.selector
    let styleEle = document.getElementById(selector)
    if (styleEle !== null) {
      document.head.removeChild(styleEle)
    }
  }
  Watermark.prototype.addInlineStyle = function(style) {
    let eles = document.querySelectorAll(this.options.selector)
    Array.prototype.slice.call(eles).forEach(function(el) {
      let oldStyle = el.getAttribute('style')
      if (oldStyle === null) {
        el.setAttribute('style', style)
      } else if (oldStyle.lastIndexOf(';') === oldStyle.length - 1) {
        el.setAttribute('style', String(oldStyle) + style)
      } else {
        el.setAttribute('style', oldStyle + ';' + style)
      }
    })
  }
  /**
   * 在`<head>`标签中添加内联的样式
   *
   * @param style 需要被内联的样式
   */
  Watermark.prototype.addStyleElement = function(style) {
    let selector = this.options.selector
    let styleEle = document.createElement('style')
    styleEle.type = 'text/css'
    styleEle.innerHTML = selector + ' { ' + style + ' }'
    styleEle.id = selector
    document.head.appendChild(styleEle)
  }
  return Watermark
})()
let index = function(text, options) {
  if (options === void 0) {
    options = {}
  }
  let watermark = new Watermark(text, options)
  return watermark
}


function waterMarkFn(userInfo) {
  return index(`${userInfo.employee_name} ${userInfo.employee_id}`)
}

function AddWaterMark(userInfo) {
  if (userInfo.employee_name && userInfo.employee_id) {
    return waterMarkFn(userInfo)
  } else {
    throw new Error('Failed to get user information')
  }
}



export default index
export { CanvasWM, SvgWM, WatermarkType, Watermark, AddWaterMark }
