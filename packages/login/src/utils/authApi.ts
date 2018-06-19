import axios, { AxiosError } from 'axios'
import { IAPIOptions } from './type/API'
import { config } from '../config'
import { IStepOne } from '../login/type/Login'
import { resolve } from 'url'

const client = axios.create({
  baseURL: config.AUTH_API_URL
})

const request = (options: IAPIOptions) => {
  const onSuccess = (response: any) => {
    return response.data
  }

  const onError = (error: AxiosError) => {
    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
      console.error('Headers:', error.response.headers)
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error('Error Message:', error.message)
    }

    return Promise.reject(error.response || error.message)
  }

  return client(options)
    .then(onSuccess)
    .catch(onError)
}

const submitStepOne = (data: IStepOne) => {
  return request({
    url: resolve(config.AUTH_API_URL, 'authenticate'),
    method: 'POST',
    data
  } as IAPIOptions)
}

export const authApi = {
  submitStepOne
}
