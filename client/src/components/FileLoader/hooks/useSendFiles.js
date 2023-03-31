import axios from 'axios'
import { baseURI } from '../../../config'
import { parseHTML } from '../../ReaderV2/ReaderSection'

function getPromises(files) {
  return files.map((file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${baseURI}/api/v2/upload`, formData)
  })
}
function getFulfilled(response) {
  const result = []
  response.forEach((element) => {
    if (element.status === 'fulfilled') {
      const script = parseHTML(element.value.data)
      result.push(script)
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
