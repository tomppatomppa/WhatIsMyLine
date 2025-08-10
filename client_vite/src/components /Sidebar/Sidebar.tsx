import { Suspense, useState } from "react";
import { FcReadingEbook } from "react-icons/fc";
import { ErrorBoundary } from "../../ErrorBoundary";
import Drawer from "../common/Drawer";
import Spacer from "../common/Spacer";
import FileUpload from "../FileUpload/FileUpload";
import HelpIcon from "../icons/HelpIcon";
import LogoutIcon from "../icons/LogoutIcon";
import ScriptsIcon from "../icons/ScriptsIcon";
import SettingsIcon from "../icons/SettingsIcon";
import Profile from "../profile/Profile";
import ScriptsContainer from "./Scripts/ScriptsContainer";
import SidebarList from "./SidebarList";
import { useRouter } from "@tanstack/react-router";

interface SidebarProps {
  handleLogout: () => void;
}
const Sidebar = ({ handleLogout }: SidebarProps) => {
  const router = useRouter();
  const [showScripts, setShowScripts] = useState(false);

  const navigation = [
    {
      onClick: () => {
        setShowScripts(() => !showScripts);
      },
      name: "All Scripts",
      icon: <ScriptsIcon />,
    },
    // {
    //   onClick: () => {
    //     router.navigate({ to: "/user/upload" });
    //   },
    //   name: "Upload",
    //   icon: <FaUpload />,
    // },
  ];

  const navigationFooter = [
    {
      onClick: () => {
        console.log("Help");
      },
      name: "Help",
      icon: <HelpIcon />,
    },
    {
      onClick: () => {
        router.navigate({ to: "/user/settings" });
      },
      name: "Settings",
      icon: <SettingsIcon />,
    },
    {
      onClick: () => {
        handleLogout();
      },
      name: "Logout",
      icon: <LogoutIcon />,
    },
  ];

  return (
    <nav
      className={`sticky flex flex-row top-0 left-0 h-screen border-r bg-white`}
    >
      <div className="flex flex-col w-12 h-full bg-gray-200">
        <div className="h-20 flex items-center justify-center">
          <button
            onClick={() => router.navigate({ to: "/dashboard" })}
            className="flex-none"
          >
            <FcReadingEbook size={24} />
          </button>
        </div>
        <div className="flex-1 flex flex-col h-full">
          <SidebarList data={navigation} />
          <Spacer />
          <SidebarList data={navigationFooter} />
          <Profile />
        </div>
      </div>
      <Drawer show={showScripts}>
        <ErrorBoundary fallback={<div>Oops something went terribly wrong</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <ScriptsContainer onScriptChange={() => setShowScripts(false)}>
              <FileUpload />
            </ScriptsContainer>
          </Suspense>
        </ErrorBoundary>
      </Drawer>
    </nav>
  );
};

export default Sidebar;
