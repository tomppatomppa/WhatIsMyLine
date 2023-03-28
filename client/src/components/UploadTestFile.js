import React from 'react'
import { useNavigate } from 'react-router-dom'
import useCurrentScripts from '../hooks/useCurrentScripts'
import axios from 'axios'
import { BASE_URI } from '../config'

const UploadTestFile = () => {
  const navigate = useNavigate()
  const { setCurrentScripts } = useCurrentScripts()

  const handleSend = async () => {
    try {
      const { data } = await axios.get(`${BASE_URI}/api/testfile`)
      setCurrentScripts(data)
      navigate('/home')
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <button
      className="mt-24 border border-black animate-pulse bg-primary p-2 rounded-md"
      onClick={handleSend}
    >
      Upload Testfile
    </button>
  )
}

export default UploadTestFile
