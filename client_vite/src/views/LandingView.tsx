
import Card from '../components /common/Card'
import GridLayout from '../layout/GridLayout'
import GithubIcon from '../components /icons/GithubIcon'
import { AiOutlineGoogle, AiOutlineUpload, AiOutlineEdit, AiFillPlaySquare, AiTwotoneAlert } from 'react-icons/ai'
import LoginButton from '../components /LoginButton/LoginButton'

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
            <LoginButton />
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
