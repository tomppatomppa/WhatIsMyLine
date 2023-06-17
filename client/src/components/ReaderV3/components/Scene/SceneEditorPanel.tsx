import { useFormikContext } from 'formik'
import useVerifyAudio from '../../hooks/useVerifyAudio'
import { useMutation } from 'react-query'
import { getGoogleDriveFileById } from 'src/API/googleApi'
import { useAccessToken } from 'src/store/userStore'
import { useState } from 'react'

const SceneEditorPanel = (props: any) => {
  const access_token = useAccessToken()
  const { dirty, resetForm, values } = useFormikContext()
  const { isEditing, setIsEditing, addLine } = props
  const { setVerify, isValid, data } = useVerifyAudio(values as any)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const { mutate } = useMutation(getGoogleDriveFileById, {
    onSuccess: (file, variables) => {
      const fileUrl = URL.createObjectURL(
        new Blob([file], { type: 'audio/mpeg' })
      )
      setAudio(new Audio(fileUrl) as any)
    },
  })
  const handleVerify = () => {
    if (!isValid) {
      setVerify(true)
      return
    }
    console.log('Start Rehearsing')
  }

  return (
    <div className="flex justify-end gap-2 bg-blue-200 p-2">
      {isEditing ? (
        <>
          <button
            disabled={!dirty}
            type="button"
            className={dirty ? 'text-black' : 'text-gray-400'}
            onClick={() => resetForm()}
          >
            Undo
          </button>
          <button type="button" onClick={addLine}>
            Add Line
          </button>
          <button
            disabled={!dirty}
            className={dirty ? 'text-black' : 'text-gray-400'}
            type="submit"
          >
            Save
          </button>
        </>
      ) : null}
      <button type="button" onClick={handleVerify}>
        {isValid ? 'Ok' : 'Verify'}
      </button>
      <button type="button" onClick={() => setIsEditing(!isEditing)}>
        Edit
      </button>
      <button
        onClick={() => {
          if (access_token) {
            mutate({
              docs: data[0],
              access_token,
            })
          }
        }}
      >
        Get
      </button>
      {audio && <audio src={audio?.src} controls></audio>}
    </div>
  )
}

export default SceneEditorPanel
