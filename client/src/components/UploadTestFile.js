import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { BASE_URI } from '../config'

const UploadTestFile = () => {
  const [error, setError] = useState('')
  const navigate = useNavigate()


  const handleSend = async () => {
    try {
      const { data } = await axios.get(`${BASE_URI}/api/v3/`)
   
     
      navigate('/reader')
    } catch (e) {
      setError(e.message)
      setTimeout(() => {
        setError('')
      }, 2000)
    }
  }
  return (
    <div>
      <button
        className="mt-24 border border-black animate-pulse bg-primary p-2 rounded-md"
        onClick={handleSend}
      >
        Upload Testfile
      </button>
      <p className="text-red-500">{error}</p>
    </div>
  )
}

export default UploadTestFile
