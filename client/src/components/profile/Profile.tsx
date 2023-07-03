import { useLogout, useUserStore } from 'src/store/userStore'
import ProfileInfo from './ProfileInfo'
import { useMutation } from 'react-query'
import { syncGoogleDrive } from 'src/API/googleApi'
import { useRootFolder, useSetRootFolder } from 'src/store/scriptStore'
import ProfileDriveInfo from './ProfileDriveInfo'

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

  if (!user) return
  return (
    <div className="items-center p-2">
      <ul className="flex flex-col">
        <ProfileInfo user={user} />
        {links.map((link) => (
          <a href={link.href}>{link.label}</a>
        ))}
        {rootFolder ? (
          <ProfileDriveInfo rootFolder={rootFolder} />
        ) : (
          <button
            className="hover:bg-blue-200"
            onClick={() => mutate(user.access_token)}
          >
            Sync Drive
          </button>
        )}
        <button onClick={logout}>logout</button>
      </ul>
    </div>
  )
}

export default Profile
