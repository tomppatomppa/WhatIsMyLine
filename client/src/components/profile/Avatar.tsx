import { User } from 'src/store/userStore'

interface AvatarProps {
  user: User
  onClick: () => void
}

const Avatar = ({ user, onClick }: AvatarProps) => {
  return (
    <span
      className="w-12 h-12 gap-x-4 cursor-pointer rounded-full ring-offset-2 ring-gray-800 focus:ring-2 duration-150"
      onClick={onClick}
    >
      <img
        src={user.picture}
        alt="user avatar"
        className="w-8 h-8 rounded-full mx-auto"
      />
    </span>
  )
}

export default Avatar
