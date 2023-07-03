import React from 'react'
import { User } from 'src/store/userStore'

interface ProfileInfoProps {
  user: User
}
const ProfileInfo = ({ user }: ProfileInfoProps) => {
  return (
    <div className="my-2">
      <label className="text-sm">Logged in as {user.email}</label>
    </div>
  )
}

export default ProfileInfo
