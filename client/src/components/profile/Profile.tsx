import { useLogout, useUserStore } from 'src/store/userStore'
import ProfileInfo from './ProfileInfo'

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
  const { user } = useUserStore()
  const logout = useLogout()

  if (!user) return
  return (
    <div className="items-center p-2 ">
      <ul className="flex flex-col">
        <ProfileInfo user={user} />
        {links.map((link) => (
          <a href={link.href}>{link.label}</a>
        ))}
        <button className="hover:bg-blue-200">Sync Drive</button>
        <button onClick={logout}>logout</button>
      </ul>
    </div>
  )
}

export default Profile
