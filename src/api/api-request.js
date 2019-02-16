import axios from 'axios'
import { apiUrl } from './api-url'

export default async function apiRequest(opitons) {
  const config = {
    ...opitons,
    url: apiUrl + opitons.url,
  }
  const response = await axios.request(config)
  return response
}
