// GET
function get (url, callback) {
  let request = new XMLHttpRequest()

  request.open('GET', url)

  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      let type = request.getResponseHeader('Content-Type')
      if (type.indexOf('xml') !== -1 && request.responseXML) {
        callback(request.responseXML)
      } else if (type === 'application/json') {
        callback(JSON.stringify(request.responseText))
      } else {
        callback(request.responseText)  // 字符串响应
      }
    }
  }

  request.send(null)
}

// 表单编码的请求
// 编码对象
function encodeFormData (data) {
  if (!data) return ''
  let pairs = []
  for (let name in data) {
    if (!data.hasOwnProperty(name)) continue
    if (typeof data[name] === 'functiin') continue
    let value = data[name]
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    name = encodeURIComponent(name)
    value = encodeURIComponent(value)
    pairs.push(name + '=' + value)
  }
  return pairs.join('&')
}
// 表单编码 POST 请求
function postData (url, data, callback) {
  let request = new XMLHttpRequest()
  request.open('POST', url)
  request.onreadystatechange = function () {
    if (request.readyState === 4 && callback) {
      callback(request)
    }
  }

  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

  request.send(encodeFormData(data))
}
// 表单编码 GET 请求
function getData (url, data, callback) {
  let request = new XMLHttpRequest()
  request.open('GET', url + '?' + encodeFormData(data))

  request.onreadystatechange = function () {
    if (request.readyState === 4 && callback) {
      callback(request)
    }
  }

  request.send(null)
}

// JSON 编码 POST 请求
function postJSON (url, data, callback) {
  let request = new XMLHttpRequest()
  request.open('POST', url)

  request.onreadystatechange = function () {
    if (request.readyState === 4 && callback) {
      callback(request)
    }

    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(data))
  }
}

// 上传文件 POST
whenReady(function () {
  let elts = document.getElementsByTagName('input')
  let len = elts.length
  for (let i = 0; i < len; i++) {
    let input = elts[i]
    if (input.type !== 'file') continue
    let url = input.getAttribute('data-uploadto')
    if (!url) return

    input.addEventListener('change', function () {
      let file = this.files[0]
      if (!file) return
      let xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.send(file)
    }, false)
  }
})

// 超时请求
function timeGetText (url, timeout, callback) {
  let request = new XMLHttpRequest()
  let timeout = false
  let timer = setTimeout(function () {
    timeout = true
    request.abort()
  }, timeout)
  request.open('GET', url)

  request.onreadystatechange = function () {
    if (request.readyState !== 4) return
    if (timeout) return
    clearTimeout(timer)
    if (request.status === 200) {
      callback(request.responseText)
    }
  }
  request.send(null)
}