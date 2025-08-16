import { Suspense, useState } from "react";
import { FcReadingEbook } from "react-icons/fc";
import { ErrorBoundary } from "../../ErrorBoundary";
import Drawer from "../common/Drawer";

import FileUpload from "../FileUpload/FileUpload";
import HelpIcon from "../icons/HelpIcon";
import LogoutIcon from "../icons/LogoutIcon";
import ScriptsIcon from "../icons/ScriptsIcon";
import SettingsIcon from "../icons/SettingsIcon";
import Profile from "../profile/Profile";
import ScriptsContainer from "./Scripts/ScriptsContainer";
import SidebarList from "./SidebarList"; // You can rename to NavList if preferred
import { useRouter } from "@tanstack/react-router";

interface TopNavbarProps {
  handleLogout: () => void;
}

const TopNavbar = ({ handleLogout }: TopNavbarProps) => {
  const router = useRouter();
  const [showScripts, setShowScripts] = useState(false);

  const navigation = [
    {
      onClick: () => setShowScripts((prev) => !prev),
      name: "All Scripts",
      icon: <ScriptsIcon />,
    },
  ];

  const navigationFooter = [
    {
      onClick: () => console.log("Help"),
      name: "Help",
      icon: <HelpIcon />,
    },
    {
      onClick: () => router.navigate({ to: "/user/settings" }),
      name: "Settings",
      icon: <SettingsIcon />,
    },
    {
      onClick: () => handleLogout(),
      name: "Logout",
      icon: <LogoutIcon />,
    },
  ];

  
  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 bg-white shadow-md">
        {/* Logo / Home */}
        <button
          onClick={() => router.navigate({ to: "/dashboard" })}
          className="flex items-center justify-center mr-4"
        >
          <FcReadingEbook size={28} />
        </button>

        {/* Main Navigation */}
        <div className="flex items-center gap-4">
          <SidebarList data={navigation}  />
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          <SidebarList data={navigationFooter}  />
          <Profile />
        </div>
      </nav>

      {/* Scripts Drawer */}
      <Drawer show={showScripts}>
        <ErrorBoundary fallback={<div>Oops something went terribly wrong</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <ScriptsContainer onScriptChange={() => setShowScripts(false)}>
              <FileUpload />
            </ScriptsContainer>
          </Suspense>
        </ErrorBoundary>
      </Drawer>
    </>
  );
};

export default TopNavbar;
