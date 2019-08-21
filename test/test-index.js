import test from 'ava'
import AxiosAgent from '../index'

// Mocky endpoint
const API_URI = 'https://www.mocky.io/v2'
const RETRY_LIMIT = 2
const NO_RETRY_CODE = 'code 401'

const headers = {}
const action = '5185415ba171ea3a00704eed'
const params = {}

const axios = new AxiosAgent({ baseURL: API_URI, headers }, RETRY_LIMIT, NO_RETRY_CODE)

test('Successful axios call', async t => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  const result =  await axios.get(action, params)

  t.is(result.status, 200)
})

test('Successful axios patch call', async t => {
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
  const result =  await axios.call(action, 'patch', params)

  t.is(result.status, 200)
})

test('Failure axios call', async t => {
  const result = await axios.get('hhh', params)
                            .catch(error => {
                              // catch is required to not to dump exception message
                              return error
                            })
  
  t.is(result.response.status, 500)
})
