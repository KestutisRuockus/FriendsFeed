import React, { useState } from 'react';
import { useForm } from './useForm';
import { SignUpProps } from './types';
import Button from './Button';
import ErrorMessage from "./ErrorMessage";

const SignUp = ({ isRegistrationComponent, setIsRegistrationComponent }: SignUpProps) => {
  const { formState, handleInputsChange, resetForm } = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(formState);
    setIsRegistrationComponent(false);
    resetForm();
    setErrorMessage(null);
  };

  const handleTransitionToLogInComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsRegistrationComponent(false);
    setErrorMessage(null);
  }

  return (
    <div className={`md:w-1/2 w-full bg-secondary flex flex-col justify-center items-center py-16 md:rounded-l-xl md:rounded-none rounded-xl 
                      ${isRegistrationComponent ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out animate-fade-in`}>
        <h1 className="font-bold text-3xl">Sign Up</h1>
        <form className="w-full flex lg:flex-row flex-col flex-wrap lg:items-start items-center gap-4 mt-12 m-auto">
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Full name:</label>
            <input 
                value={formState.fullName}
                onChange={handleInputsChange}
                type="text" 
                name="fullName"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
                placeholder="Enter your full name"
            />
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Email:</label>
            <input 
                value={formState.email}
                onChange={handleInputsChange}
                type="email" 
                name="email"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
                placeholder="Enter your email"
            />
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Password:</label>
            <input
                value={formState.password}
                onChange={handleInputsChange} 
                type="password" 
                name="password"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
                placeholder="Password"
            />
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Confirm password:</label>
            <input
                value={formState.confirmPassword}
                onChange={handleInputsChange} 
                type="password" 
                name="confirmPassword"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
                placeholder="Confirm password"
            />
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Birthdate:</label>
            <input
                value={formState.birthdate}
                onChange={handleInputsChange} 
                type="date" 
                name="birthdate"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
            />
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Your location:</label>
            <input
                value={formState.location}
                onChange={handleInputsChange} 
                type="text" 
                name="location"
                className="outline-none px-2 rounded-lg lg:w-1/2 w-2/3"
                placeholder="Your Location"
            />
            <label className="lg:w-1/3 w-2/3 lg:text-end text-start">Gender:</label>
            <div className="flex flex-wrap gap-1 lg:w-1/2 w-2/3 m-auto">
              <label>
                <input 
                  type="radio" 
                  name="gender"
                  value='male'
                  checked={formState.gender ==='male'}
                  onChange={handleInputsChange}
                />
                Male
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender"
                  value='female'
                  checked={formState.gender ==='female'}
                  onChange={handleInputsChange}
                />
                Female
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender"
                  value='other'
                  checked={formState.gender ==='other'}
                  onChange={handleInputsChange}
                />
                Other
              </label>
              
            </div>
            <div className="flex flex-wrap gap-4 lg:mt-0 mt-6 m-auto px-10">
              <Button text='Create new account' fn={handleFormSubmit}/>
              <Button text='Log In To Existing' fn={handleTransitionToLogInComponent}/>
            </div>
            <ErrorMessage message={errorMessage}/>
        </form>
    </div>
  )
}

export default SignUp;