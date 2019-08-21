const axios = require('axios');

class AxiosAgent {
  constructor(params = {}, retryLimit = 2, noRetryCode = null) {
    this.retryLimit = retryLimit
    this.noRetryCode = noRetryCode
    this.axios = axios.create(params)
  }

  call(action, method, params = {}) {
    let paramsToSend = null
    if (['get', 'delete', 'head', 'options'].includes(method)) {
      paramsToSend = { params }
    } else if (['post', 'put', 'patch'].includes(method)) {
      if (params === null) params = {}
      paramsToSend = new URLSearchParams(params)
    } else {
      return false
    }
    const call = this.axios[method](`/${action}`, paramsToSend)
    return this.callAndRetry(call)
  }

  // get and post are deprecated. these will be removed in the future
  get(action, params = {}) {
    const call = this.axios.get(`/${action}`, { params })
    return this.callAndRetry(call)
  }

  post(action, params = {}) {
    if (params === null) params = {}
    let paramsToSend = new URLSearchParams(params)

    const call = this.axios.post(`/${action}`, paramsToSend)
    return this.callAndRetry(call)
  }

  callAndRetry(call, count = 0) {
    return call
      .then( response => {
        return response
      }).catch( error => {
        if (count < this.retryLimit) {
          ++count
          if (error.message.indexOf(this.noRetryCode) > -1) {
            console.log('HTTP Network Error. No retry')
            throw error
          }
          return this.callAndRetry(call, count)
        } else {
          console.log('HTTP Network Error')
          throw error
        }
      })
  }
}
module.exports = AxiosAgent
