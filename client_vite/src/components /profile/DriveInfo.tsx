import { RootFolder } from "../../store/scriptStore";

interface ProfileDriveInfoProps {
  rootFolder: RootFolder;
}

const DriveInfo = ({ rootFolder }: ProfileDriveInfoProps) => {
  return (
    <div className="my-2">
      <strong className="block">Google Drive Folder</strong>
      <label className="text-sm block">{rootFolder?.name}</label>
    </div>
  );
};

export default DriveInfo;
