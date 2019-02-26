var base = `http://localhost:443/c/v1`
// base = 'https://test.nodetribe.com/c/v1'

const createReq = (url, type, token, body) => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest()
    req.onreadystatechange = () => {
      if (req.readyState == 4 && req.status == 200) {
        resolve(JSON.parse(req.responseText))
      } else if (req.readyState == 4 && req.status !== 200) {
        console.log(req)
        reject(req.responseText)
      }
    }
    req.open(type, base + url, true)
    if (token) req.setRequestHeader('Authorization', token)
    if (type == 'post') req.setRequestHeader("Content-type","application/json")
    req.send(JSON.stringify(body))
  })

}

const apis = {
  checkUsername: (username) => {
    let url = `/user/phone/check?phone=${username}`
    return createReq(url, 'get')
  },

  login: (username, password) => {
    let url = `/user/password/token?`
    url += `username=${username}`
    url += `&password=${password}`
    url += `&clientId=web&type=web`
    return createReq(url, 'get')
  },

  getStationList: (token) => {
    let url = `/station`
    return createReq(url, 'get', token)
  },

  sendCode: (phone) => {
    let url = `/user/smsCode`
    return createReq(url, 'post', null, { phone, type: 'deviceChange'})
  },

  getTicket: (phone, code) => {
    let url = `/user/smsCode/ticket`
    return createReq(url, 'post', null, { phone, code, type: 'deviceChange' })
  },

  getStationUsers: (token, sn) => {
    let url = `/station/${sn}/user`
    return createReq(url, 'get', token)
  },

  deleteStation: (token, sn, ticket, manager) => {
    let url = `/station?_method=DELETE`
    let body = { sn, ticket, manager }
    return createReq(url, 'post', token, body)
  }
}

module.exports = apis