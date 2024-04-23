import { useMutation } from "react-query";
import DriveInfo from "./DriveInfo";
import Avatar from "./Avatar";
import { useState } from "react";
import { syncGoogleDrive } from "../../API/googleApi";
import { useRootFolder, useSetRootFolder } from "../../store/scriptStore";
import { useLogout, useUserStore } from "../../store/userStore";

const Profile = () => {
  const [isProfileActive, setIsProfileActive] = useState(false);
  const logout = useLogout();
  const { user } = useUserStore();
  const rootFolder = useRootFolder();
  const setRootFolder = useSetRootFolder();

  const { mutate } = useMutation(syncGoogleDrive, {
    onSuccess: (data) => {
      setRootFolder(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (!user) return;

  return (
    <div className="relative py-4 border-t">
      <Avatar
        user={user}
        onClick={() => setIsProfileActive(!isProfileActive)}
      />
      {isProfileActive ? (
        <div className="absolute bottom-4 left-20 w-64 rounded-lg bg-white shadow-md border text-sm text-gray-600">
          <div className="p-2">
            <ul className="flex flex-col mt-2 text-gray-700">
              {rootFolder ? <DriveInfo rootFolder={rootFolder} /> : null}
            </ul>
            <span className="block text-gray-500/80 p-2">{user.email}</span>
            <button
              className={`block w-full p-2 text-left rounded-md ${
                rootFolder ? "bg-green-200" : "bg-red-200"
              }`}
              onClick={() => mutate()}
            >
              Sync Drive
            </button>
            <div className="relative rounded-md hover:bg-gray-50 active:bg-gray-100 duration-150">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 absolute right-1 inset-y-0 my-auto pointer-events-none"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              <select className="w-full cursor-pointer appearance-none bg-transparent p-2 outline-none">
                <option disabled selected>
                  Theme
                </option>
                <option>Dark</option>
                <option>Light</option>
              </select>
            </div>
            <button
              onClick={logout}
              className="block w-full p-2 text-left rounded-md hover:bg-gray-50 active:bg-gray-100 duration-150"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
