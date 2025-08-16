import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { scriptsQueryOptions } from "../API/queryOptions";
import { logout } from "../API/authApi";
import { clearCookiesAndLogout } from "../utils/helpers";
import { useAuth } from "../auth";
import Button from "../components /common/Button";

export function NavbarPublic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-xl font-medium text-slate-800">
              What's My Line
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <a
              href="#features"
              className="text-gray-600 hover:text-slate-800 transition-colors duration-200"
            >
              Features
            </a> */}
            <a
              href="#about"
              className="text-gray-600 hover:text-slate-800 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-slate-800 transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="/api/auth/login"
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-slate-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-slate-800 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-slate-800 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-slate-800 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </a>
              <a
                href="/api/auth/login"
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

export function NavbarPrivate() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScriptsList, setShowScriptsList] = useState(false);
  const auth = useAuth();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearCookiesAndLogout();
      auth.logout();
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // scrolling down
        setShow(false);
      } else {
        // scrolling up
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Mobile/Desktop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        w-80
      `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Scripts</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 flex-row">
          {!showScriptsList ? (
            <>
              {/* Initial Menu */}
              <button
                onClick={() => setShowScriptsList(true)}
                className="block w-full px-4 py-3 mb-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
              >
                📄 View Scripts
              </button>
              <Link
                to="/markdown-edit/{-$id}"
                className="block w-full px-4 py-3 mb-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                ➕ Create New Script
              </Link>
              <Link
                to="/scripts-list"
                className="block w-full px-4 py-3 text-center text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors duration-200 font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                Show All Scripts
              </Link>
            </>
          ) : (
            <>
              {/* Scripts List View */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setShowScriptsList(false)}
                  className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <Link
                  to="/scripts-list"
                  className="text-sm text-slate-600 hover:text-slate-800 transition-colors duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2">
                <ScriptList setSidebarOpen={sidebarOpen} />
              </div>
            </>
          )}
        </div>
        <Button
          onClick={() => console.log()}
          className="group mt-16 inline-flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50/80 border border-red-200/60 rounded-lg hover:bg-red-100 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg
            className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </Button>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed top-0 w-full z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 transition-transform duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-medium text-slate-800">
                What's My Line
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-slate-800 transition-colors duration-200 font-medium"
              >
                Scripts
              </button>
              <Button
                onClick={() => mutate()}
                className="group inline-flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50/80 border border-red-200/60 rounded-lg hover:bg-red-100 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-slate-800 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-gray-200"
            >
              <div className="flex flex-col space-y-10">
                <button
                  onClick={() => {
                    setSidebarOpen(true);
                    setIsOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-slate-800 transition-colors duration-200"
                >
                  Scripts
                </button>
                <Button
                  onClick={() => mutate()}
                  className="group inline-flex items-center px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50/80 border border-red-200/60 rounded-lg hover:bg-red-100 hover:border-red-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </>
  );
}

const ScriptList = ({ setSidebarOpen }: { setSidebarOpen: any }) => {
  const { data: scripts } = useSuspenseQuery(scriptsQueryOptions());

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
        Recent Scripts ({scripts.length})
      </h3>

      {scripts.length > 0 ? (
        scripts.map((script) => (
          <Link
            key={script.id}
            to={`/scripts/` + script.id}
            className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 text-sm group"
          >
            <div className="flex items-center justify-between">
              <span className="truncate flex-1">
                {script.filename || `Script ${script.id}`}
              </span>
              <svg
                className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
            {script && (
              <div className="text-xs text-gray-500 mt-1">
                {new Date(script.updated).toLocaleDateString()}
              </div>
            )}
          </Link>
        ))
      ) : (
        <div className="px-3 py-8 text-center text-gray-500 text-sm">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>No scripts found</p>
          <Link
            to="/markdown-edit/{-$id}"
            className="inline-block mt-2 text-slate-600 hover:text-slate-800 font-medium text-xs"
            onClick={() => setSidebarOpen && setSidebarOpen(false)}
            search={{ redirect: "" }}
          >
            Create your first script →
          </Link>
        </div>
      )}

      {scripts.length > 8 && (
        <div className="pt-2 mt-3 border-t border-gray-100">
          <Link
            to="/scripts-list"
            className="block px-3 py-2 text-center text-slate-600 hover:text-slate-800 hover:bg-gray-50 rounded-md transition-colors duration-200 text-xs font-medium"
            onClick={() => setSidebarOpen && setSidebarOpen(false)}
          >
            View all {scripts.length} scripts →
          </Link>
        </div>
      )}
    </div>
  );
};
