import axios from 'axios'
import { baseURI } from '../../../config'

function getPromises(files) {
  return files.map((file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${baseURI}/api/convert`, formData)
  })
}
function getFulfilled(response) {
  const result = []
  response.forEach((element) => {
    if (element.status === 'fulfilled') {
      result.push(element.value.data)
    }
  })
  return result
}

const useSendFiles = () => {
  const sendFiles = async (files) => {
    const promises = getPromises(files)
    try {
      const response = await Promise.allSettled(promises)
      const result = getFulfilled(response)
      return result
    } catch (error) {
      console.error(error)
    }
  }
  return { sendFiles }
}

export default useSendFiles
