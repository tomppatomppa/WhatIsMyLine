import JSZip from 'jszip'
import { useMutation } from 'react-query'
import { createTextToSpeechFromScene } from 'src/API/googleApi'

const useTextToSpeech = () => {
  const { mutate: upload } = useMutation(createTextToSpeechFromScene, {
    onSuccess: async (data) => {
      const files = await extractFolderContent(data)
      console.log(files)
    },
    onError: (error) => {
      console.log(error)
    },
  })
  return { upload }
}

export default useTextToSpeech

const extractFolderContent = async (blob: Blob) => {
  const zip = new JSZip()

  const zipData = await zip.loadAsync(blob)

  let folderContent = {} as any

  zipData.forEach(async (relativePath, zipEntry) => {
    if (zipEntry.dir) {
      return
    }

    const fileContent = await zipEntry.async('blob')

    folderContent[relativePath] = fileContent
  })

  return folderContent
}
