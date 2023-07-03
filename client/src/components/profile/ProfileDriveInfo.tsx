import React from 'react'
import { RootFolder } from 'src/store/scriptStore'

interface ProfileDriveInfoProps {
  rootFolder: RootFolder
}
const ProfileDriveInfo = ({ rootFolder }: ProfileDriveInfoProps) => {
  return (
    <div className="my-2">
      <strong className="block">Folder Info</strong>
      <label className="text-sm block">{rootFolder.id}</label>
      <label className="text-sm block">{rootFolder.name}</label>
    </div>
  )
}

export default ProfileDriveInfo
