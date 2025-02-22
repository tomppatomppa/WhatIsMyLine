
import { Link } from '@tanstack/react-router'
import { AiFillPlaySquare, AiOutlineEdit, AiOutlineGoogle, AiOutlineUpload, AiTwotoneAlert } from 'react-icons/ai'
import Card from '../components /common/Card'
import GithubIcon from '../components /icons/GithubIcon'
import GridLayout from '../layout/GridLayout'

const Heading = () => {
  return (
    <h1 className="text-4xl font-bold uppercase">
      Whats My <span className="text-indigo-400 drop-shadow-2xl">Line</span>
    </h1>
  )
}

interface SubheadingProps {
  children: React.ReactNode
}
const Subheading = ({ children }: SubheadingProps) => {
  return (
    <h2 className="max-w-3xl mx-auto md:px-2 text-4xl mt-12">{children}</h2>
  )
}

type CardType = { text: string; icon: React.ReactNode }[]

const cards: CardType = [
  {
    text: 'Simplify your access and enhance security by logging in with your Google account seamlessly.',
    icon: <AiOutlineGoogle size={40} />,
  },
  {
    text: 'Effortlessly upload and manage your documents with our user-friendly file upload feature, simplifying your document management process.',
    icon: <AiOutlineUpload size={40} />,
  },
  {
    text: 'Refine your script effortlessly with our powerful editing tools for a seamless content creation experience.',
    icon: <AiOutlineEdit size={40} />,
  },
  {
    text: 'Prepare for perfection with our script rehearsal feature, ensuring your performance shines.',
    icon: <AiFillPlaySquare size={40} />,
  },
  {
    text: 'Bring your script to life with our Google Text-to-Speech feature, making your content resonate with clarity and professionalism.',
    icon: <AiTwotoneAlert size={40} />,
  },
]

export const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">WhatsMyLine</h1>
          <div className="flex gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Examples</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">GitHub</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Intelligent PDF Document Management</h2>
          <p className="text-xl text-gray-600 mb-8">
            WhatsMyLine helps PDF document management by enabling users to effortlessly parse and interact with individual components in a script.
          </p>
          <div className="flex gap-4 justify-center">
         
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
              Get Started
              <Link to='/login'>Login</Link>
              {/* <FileText size={18} /> */}
            </button>
            <button className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 flex items-center gap-2">
              View on GitHub
              {/* <Github size={18} /> */}
            </button>
          </div>
        </div>
      </header>

      {/* Feature Sections */}
      <main className="flex-grow bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Parse Section */}
          <section className="mb-24">
            <div className="flex items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Effortless Parsing</h2>
                <p className="text-gray-600 text-lg">
                  Automatically extract and organize content from your PDF documents. WhatsMyLine intelligently identifies headings, paragraphs, lists, and other structural elements with precision.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <img src="/api/placeholder/400/300" alt="PDF parsing illustration" className="w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Section */}
          <section className="mb-24">
            <div className="flex items-center gap-12 flex-row-reverse">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Interactive Components</h2>
                <p className="text-gray-600 text-lg">
                  Work with PDF content like never before. Select, copy, search, and manipulate individual components while maintaining the document's structure and formatting.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <img src="/api/placeholder/400/300" alt="Interactive features illustration" className="w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <section className="mb-24">
            <div className="flex items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Smart Search</h2>
                <p className="text-gray-600 text-lg">
                  Find exactly what you need with our advanced search capabilities. Search across multiple documents, within specific sections, or by content type.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <img src="/api/placeholder/400/300" alt="Search functionality illustration" className="w-full" />
                </div>
              </div>
            </div>
          </section>

          {/* Script Integration Section */}
          <section>
            <div className="flex items-center gap-12 flex-row-reverse">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-4">Seamless Integration</h2>
                <p className="text-gray-600 text-lg">
                  Integrate WhatsMyLine into your existing workflow with our simple API. Build powerful document management solutions with just a few lines of code.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <img src="/api/placeholder/400/300" alt="Integration illustration" className="w-full" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">WhatsMyLine</h3>
              <p className="text-gray-600">Making PDF document management effortless and intuitive.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Documentation</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Quick Start</a></li>
                <li><a href="#" className="hover:text-gray-900">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900">Examples</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Tutorials</a></li>
                <li><a href="#" className="hover:text-gray-900">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">GitHub</a></li>
                <li><a href="#" className="hover:text-gray-900">Discord</a></li>
                <li><a href="#" className="hover:text-gray-900">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-gray-600">
            <p>© 2025 WhatsMyLine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
const LandingView = () => {
  return (
    <>
      <div className="max-w-6xl justify-center mx-auto text-center">
        <section className="relative flex items-center text-white h-[80vh] justify-center bg-blue-200 flex-col gap-y-2">
          <div className="absolute w-full h-full">
            <video
              className="object-cover w-full h-full brightness-75"
              autoPlay
              loop
              muted
            >
              <source src={"https://drive.google.com/file/d/1zb0q0XLxWe4-Pd1OESxZCRlgedlCvUJj/view?usp=sharing"} type="video/mp4" />
            </video>
          </div>
          <div className="z-0">
            <Heading />
            <Subheading>
              Upload your script and streamline your creative workflow
            </Subheading>
            <div className="mt-12"></div>
            <Link to='/login'>Login</Link>
            {/* <LoginButton /> */}
          </div>
        </section>
        <section className="my-12 max-w-2xl mx-auto ">
          <Subheading>
            <span className="uppercase text-left font-black">
              What Does It Do?
            </span>
          </Subheading>
          <p className="text-md md:text-xl mt-2">
            WhatsMyLine helps PDF document management by enabling users to
            effortlessly parse and interact with individual components in a
            script.
          </p>
        </section>
        <section className="flex justify-center">
          <GridLayout>
            {cards.map((card, index) => (
              <div key={index} className="flex items-center justify-center">
                <Card {...card} index={index}></Card>
              </div>
            ))}
          </GridLayout>
        </section>
      </div>
      <section className="bg-blue-100 flex flex-row justify-center py-12">
        <div className="">
          <GithubIcon />
          <p>Github</p>
          <a
            href="https://github.com/tomppatomppa/WhatIsMyLine"
            target="_blank"
            rel="noreferrer"
          >
            Visit Repository
          </a>
        </div>
      </section>
    </>
  )
}

export default LandingView
