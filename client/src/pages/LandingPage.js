import React from 'react'
import { useNavigate } from 'react-router-dom'
import FileButton from '../components/FileLoader/FileButton'
import UploadTestFile from '../components/UploadTestFile'

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center  h-screen justify-center text-center">
      <div className="flex items-center justify-center flex-col">
        <button
          className="border rounded-md bg-primary p-2"
          onClick={() => navigate('/V2')}
        >
          Switch to V2
        </button>
        <h1 className="my-24 text-4xl uppercase font-bold">Script Converter</h1>
        <span className="block">Add PDF(s)</span>
        <FileButton />
      </div>
      <UploadTestFile />
    </div>
  )
}

export default LandingPage
