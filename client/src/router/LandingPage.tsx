import GoogleLoginButton from 'src/components/auth/GoogleLoginButton'

const LandingPage = () => {
  return (
    <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center  h-screen justify-center text-center">
      <div className="flex items-center justify-center flex-col">
        <h1 className="my-24 text-4xl uppercase font-bold">Script Converter</h1>
        <span className="block">Add PDF(s)</span>
        <GoogleLoginButton />
      </div>
    </div>
  )
}

export default LandingPage
