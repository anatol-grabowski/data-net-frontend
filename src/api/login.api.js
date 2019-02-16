import apiRequest from './api-request'
import basic from 'basic-authorization-header'

export async function login(user, pass) {
  const request = {
    method: 'get',
    url: '/login',
    headers: {
      'Authorization': basic(user, pass)
    },
  }
  const response = await apiRequest(request)
  console.log('login response', response)
  return response
}
