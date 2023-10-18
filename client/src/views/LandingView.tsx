import { useNavigate } from 'react-router-dom'
import Card from 'src/components/Card'
import Button from 'src/components/common/Button'
import GithubIcon from 'src/components/icons/GithubIcon'
import GridLayout from 'src/layout/GridLayout'
import {
  AiOutlineClose,
  AiOutlineUpload,
  AiOutlineGoogle,
  AiOutlineEdit,
  AiFillPlaySquare,
  AiTwotoneAlert,
} from 'react-icons/ai'
import { useAuth } from 'src/store/userStore'
const heroVideo = require('../assets/video/hero_video.mp4')

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

const LandingView = () => {
  const isLoggedIn = useAuth()
  const navigate = useNavigate()

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
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>
          <div className="z-0">
            <Heading />
            <Subheading>
              Upload your script and streamline your creative workflow
            </Subheading>
            <div className="mt-12"></div>
            <Button onClick={() => navigate('/login')}>
              <span className="font">{isLoggedIn ? 'Dashboard' : 'Login'}</span>
            </Button>
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
