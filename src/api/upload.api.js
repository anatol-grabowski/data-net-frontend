import axios from 'axios'
import { apiUrl } from './api-url'

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('foo', 'bar')
  formData.append('file', file)
  const config = {
    onUploadProgress: function(progressEvent) {
      console.log('uploading', progressEvent.loaded, progressEvent.total)
    }
  }
  const url = apiUrl + '/upload'
  const res = await axios.post(url, formData, config)
  console.log('uploaded', res)
  return res
}