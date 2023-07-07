import { useLogout, useUserStore } from 'src/store/userStore'
import { useMutation } from 'react-query'
import { syncGoogleDrive } from 'src/API/googleApi'
import { useRootFolder, useSetRootFolder } from 'src/store/scriptStore'
import DriveInfo from './DriveInfo'
import Avatar from './Avatar'
import { makeRequestWithJWT } from 'src/API/loginApi'

const links = [
  {
    label: 'Profile',
    href: '/',
  },
  {
    label: 'Settings',
    href: '/',
  },
]

const Profile = () => {
  const logout = useLogout()
  const { user } = useUserStore()
  const rootFolder = useRootFolder()
  const setRootFolder = useSetRootFolder()

  const { mutate } = useMutation(syncGoogleDrive, {
    onSuccess: (data) => {
      setRootFolder(data)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  const { mutate: protect } = useMutation(makeRequestWithJWT, {
    onSuccess: (data) => {
      console.log(data)
    },
  })

  if (!user) return
  return (
    <div className="items-center p-2">
      <Avatar user={user} />
      <ul className="flex flex-col mt-2 text-gray-700">
        {links.map((link, index) => (
          <a key={index} href={link.href}>
            {link.label}
          </a>
        ))}
        <button
          className={`${
            rootFolder ? 'bg-green-200' : 'bg-red-200'
          } hover:bg-blue-200`}
          onClick={() => mutate()}
        >
          Sync Drive
        </button>
        {rootFolder ? <DriveInfo rootFolder={rootFolder} /> : null}
        <button onClick={logout}>logout</button>

        <button onClick={() => protect()}>protected</button>
      </ul>
    </div>
  )
}

export default Profile
