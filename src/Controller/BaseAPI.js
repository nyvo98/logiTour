import axios from 'axios'
import { getItemStorage } from '../common/function'
import QueryString from 'query-string'
import Resizer from 'react-image-file-resizer'
const POST = 'post'
const PUT = 'put'
const DELETE = 'delete'
const GET = 'get'

export default class BaseAPI {
  static async loginAdmin (email, password) {
    const body = {
      email,
      password,
      isLogin: true
    }
    return this.postGateWay(POST, 'user/reg/admin', body)
  }

  static async getData (type) {
    return this.postGateWay(GET, type)
  }

  static async getDataWebsite (type) {
    return this.postGateWayWebsite(GET, type)
  }

  static async getDataAll (type) {
    return this.postGateWay(GET, type + '/getAll/')
  }

  static async postCreateData (body, type) {
    return this.postGateWay(POST, type, body)
  }

  static async putUpdateData (body, type) {
    return this.postGateWay(PUT, type, body)
  }

  static async putUpdateDataWebsite (body, type) {
    return this.postGateWayWebsite(PUT, type, body)
  }

  static async deleteData (body, type) {
    return this.postGateWay(DELETE, type + '?' + QueryString.stringify(body))
  }

  static async getConfig () {
    return this.postGateWay(GET, 'config/')
  }

  static async updateConfig (body) {
    return this.postGateWay(PUT, 'config', body)
  }

  static async uploadImage (files) {
    const resizeImage = () => {
      return new Promise(async (resolve, reject) => {
        Resizer.imageFileResizer(
          files,
          1024,
          768,
          'PNG',
          70,
          0,
          async (uri) => {
            resolve(uri)
          },
          'base64'
        )
      })
    }

    const base64 = await resizeImage()
    const linkImage = await this.postGateWay(POST, 'upload', { base64 }, process.env.REACT_APP_LINK_PRODUCT + 'api/')

    return process.env.REACT_APP_LINK_PRODUCT + linkImage
  }

  static async postGateWayWebsite (method, action, body, linkServer) {
    try {
      let serverUrl = process.env.REACT_APP_LINK_WEBSITE
      const token = getItemStorage('auth')
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'osVersion': 'website',
          'Authorization': token
        }
      }
      let axiosInstance = axios.create(config)
      console.log(serverUrl + action)
      const response = await axiosInstance[method](serverUrl + action, body, config)
      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  static async postGateWay (method, action, body, linkServer) {
    try {
      let serverUrl = linkServer || global.BASE_URL
      const token = getItemStorage('auth')
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'osVersion': 'website',
          'Authorization': token
        }
      }

      let axiosInstance = axios.create(config)

      const response = await axiosInstance[method](serverUrl + action, body, config)
      console.log('response', response)
      if (response.status === 200) {
        return response.data
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
