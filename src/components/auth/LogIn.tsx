import { SetStateAction, useState } from "react";
import { LogInProps } from './types';
import Button from './Button';
import ErrorMessage from "./ErrorMessage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const LogIn = ({ setIsRegistrationComponent, isRegistrationComponent, setIsUserAuthorized }: LogInProps) => {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      try {
        const userExist = await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in successfully');
        if(userExist) {
          setIsUserAuthorized(true);
          localStorage.setItem('isAuth', JSON.stringify(true))
        }
      } catch (error) {
        if(error instanceof Error) {
          console.log(error.message);
          setErrorMessage(error.message);
        } else {
          console.log('Unknown error occurred');
        }
      }
    }

    const handleTransitionToSignUpComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsRegistrationComponent(true);
      setErrorMessage(null);
    }

    const handleEmail = (e: { target: { value: SetStateAction<string> } }) => setEmail(e.target.value); 

    const handlePassword = (e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value);

  return (
    <div className={`md:w-1/2 w-full bg-secondary flex flex-col justify-center items-center py-16 md:rounded-r-xl md:rounded-none rounded-xl 
                    ${isRegistrationComponent ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ease-in-out animate-fade-in`}>
        <h1 className="font-bold text-3xl">Log In</h1>
        <form className="flex lg:flex-row flex-col gap-4 flex-wrap lg:items-start items-center mt-12 w-full">
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Email:</label>
            <input 
                value={email}
                onChange={handleEmail}
                type="email" 
                name="email"
                placeholder="Enter your email"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
            />
            
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Password:</label>
            <input
                value={password}
                onChange={handlePassword} 
                type="password" 
                name="password"
                placeholder="Enter your password"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
            />
            
            <div className="flex flex-wrap gap-4 m-auto lg:mt-0 mt-6 px-10">
              <Button text='Log In' fn={handleLogin}/>
              <Button text='Create new account' fn={handleTransitionToSignUpComponent}/>
            </div>
            <ErrorMessage message={errorMessage}/>
        </form>
    </div>
  )
}

export default LogIn;