import {
  AiFillPlaySquare,
  AiOutlineEdit,
  AiOutlineGoogle,
  AiOutlineUpload,
  AiTwotoneAlert,
} from "react-icons/ai";
import { motion } from "framer-motion";
import GridLayout from "../layout/GridLayout";
import backgroundSvg from "../assets/hero-background.svg";
import { NavbarPublic } from "../layout/Navbar";

const features = [
  {
    text: "Sign in instantly with Google and jump straight into your creative process.",
    icon: <AiOutlineGoogle size={32} />,
  },
  {
    text: "Upload scripts in seconds, keep them safe, and access them anytime.",
    icon: <AiOutlineUpload size={32} />,
  },
  {
    text: "Edit, reformat, and polish your work with professional-grade script tools.",
    icon: <AiOutlineEdit size={32} />,
  },
  {
    text: "Practice with real-time playback to perfect your delivery.",
    icon: <AiFillPlaySquare size={32} />,
  },
  {
    text: "Hear your words come alive with realistic text-to-speech.",
    icon: <AiTwotoneAlert size={32} />,
  },
];

export default function LandingView() {
  return (

    <div className="bg-white text-gray-900">
      <NavbarPublic />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-100"></div>
        <div className="absolute inset-0">
          <img
            src={backgroundSvg}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-light mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-slate-800 font-medium">What's My Line</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl font-light text-gray-600 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Step Into the{" "}
            <span className="text-slate-700 font-medium">Spotlight</span>
          </motion.p>

          <motion.p
            className="text-lg text-gray-500 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            From scriptwriting to final performance — your all-in-one creative
            hub
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="/api/auth/login"
              className="inline-block bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Scene
            </a>
          </motion.div>
        </div>
      </section>
      {/* Intro / Value Proposition Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-light text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Built for Storytellers,{" "}
            <span className="text-slate-600">By Storytellers</span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Whether you’re crafting scripts, brainstorming concepts, or
            collaborating with your team, our platform gives you the clarity and
            flow to bring your vision to life.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Seamless Collaboration",
                desc: "Work together in real-time with writers, editors, and producers.",
              },
              {
                title: "Creative Freedom",
                desc: "Stay flexible with tools that adapt to your workflow, not the other way around.",
              },
              {
                title: "Focus on Story",
                desc: "Minimize distractions and keep your energy where it matters most — your ideas.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Your Creative Workflow, Scene by Scene
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional tools designed to streamline your creative process
            </p>
          </div>

          <GridLayout>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="text-slate-700 mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <p className="text-gray-600 leading-relaxed text-center">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </GridLayout>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-500">
            © 2025 What's My Line • Empowering Creative Communities
          </p>
        </div>
      </footer>
    </div>
  );
}
