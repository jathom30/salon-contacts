import axios from "axios";

const baseUrl = 'https://file.io/'
const apiKey = process.env.REACT_APP_FILE_IO_API_KEY || ''

const config = {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Access-Control-Allow-Origin': '*',
  }
}

export const postPhoto = (photo: Blob) => {
  let formData = new FormData();
  formData.append("file", photo);
  return axios.post(`${baseUrl}`, formData, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getPhoto = (id: string) => {
  return axios.get(`${baseUrl}${id}`, config)
}