import React, { useState } from 'react';
import { useRegisterForm } from './useRegisterForm';
import { FormStateProps, SignUpProps } from './types';
import Button from './Button';
import ErrorMessage from "./ErrorMessage";
import { auth, db } from '../../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = ({ isRegistrationComponent, setIsRegistrationComponent }: SignUpProps) => {
  const { formState, handleInputsChange, resetForm } = useRegisterForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateInputs = () => {
    const validations: {
      field: keyof FormStateProps,
      error: string,
      condition?: () => boolean,
    }[] = [
      {field: 'fullName', error: 'Name is required'},
      {field: 'email', error: 'Email is required'},
      {field: 'password', error: 'Password is required'},
      {field: 'confirmPassword', error: 'Passwords does not match', condition: () => formState.password === formState.confirmPassword},
      {field: 'birthdate', error: 'Birthdate is required'},
      {field: 'location', error: 'Location is required'},
      {field: 'gender', error: 'Gender is required'},
    ]

    for(const {field, error, condition} of validations) {
      if(!formState[field] || (condition && !condition())){
        setErrorMessage(error);
        return false;
      }
    }
    console.log(formState);
    return true;
  }

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validatedNewUser = validateInputs();

    if(validatedNewUser){
      try {
        await createUserWithEmailAndPassword(auth, formState.email, formState.password);
        const user = auth.currentUser;
        if(user){
          await setDoc(doc(db, "users", user.uid), {
            name: formState.fullName,
            email: formState.email,
            birthdate: formState.birthdate,
            location: formState.location,
            gender: formState.gender,
          });
        }

        if(auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: formState.fullName,
          });
        }

        console.log("User Registered Successfully!!");
        setErrorMessage("User Registered Successfully!!");
        resetForm();
      } catch (error) {
        if(error instanceof Error) {
          console.log(error.message);
          setErrorMessage(error.message);
        } else {
          console.log('Unknown error occurred');
        }
      }
    }
  }

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
                  value='Male'
                  checked={formState.gender ==='male'}
                  onChange={handleInputsChange}
                />
                Male
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender"
                  value='Female'
                  checked={formState.gender ==='female'}
                  onChange={handleInputsChange}
                />
                Female
              </label>
              <label>
                <input 
                  type="radio" 
                  name="gender"
                  value='Other'
                  checked={formState.gender ==='other'}
                  onChange={handleInputsChange}
                />
                Other
              </label>
              
            </div>
            <div className="flex flex-wrap gap-4 lg:mt-0 mt-6 m-auto px-10">
              <Button text='Create new account' fn={handleRegister}/>
              <Button text='Log In To Existing' fn={handleTransitionToLogInComponent}/>
            </div>
            <ErrorMessage message={errorMessage}/>
        </form>
    </div>
  )
}

export default SignUp;