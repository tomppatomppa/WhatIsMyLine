import useDrivePicker from "react-google-drive-picker";
import { useMutation } from "react-query";
import { PickerCallback } from "react-google-drive-picker/dist/typeDefs";
import { FaGoogleDrive } from "react-icons/fa";

import Spinner from "../common/Spinner";

import Tooltip from "../common/Tooltip";
import { getGoogleDriveFileById } from "../../API/googleApi";
import { CLIENT_ID, API_KEY } from "../../config";

interface GooglePickerProps {
  className?: string;
  onFileSelect: (result: File) => void;
  access_token: string;
}

const GooglePicker = ({
  className,
  onFileSelect,
  access_token,
}: GooglePickerProps) => {
  const [openPicker] = useDrivePicker();
  const { mutate, isLoading } = useMutation(getGoogleDriveFileById, {
    onSuccess: (pdfFile, variables) => {
      const file = new File([pdfFile], variables.docs.name, {
        type: variables.docs.mimeType,
      });
      onFileSelect(file);
    },
  });

  const handleOpenPicker = () => {
    openPicker({
      clientId: CLIENT_ID as string,
      developerKey: API_KEY as string,
      viewId: "PDFS",
      token: access_token,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: async (data: PickerCallback) => {
        if (data.action === "picked" && access_token) {
          mutate({ docs: data.docs[0], access_token: access_token });
        }
      },
    });
  };

  return isLoading ? (
    <Spinner show={isLoading} delay={400} />
  ) : (
    <Tooltip text="Google Drive">
      <button className={className} onClick={() => handleOpenPicker()}>
        <FaGoogleDrive color="gray" size={22} />
      </button>
    </Tooltip>
  );
};

export default GooglePicker;
