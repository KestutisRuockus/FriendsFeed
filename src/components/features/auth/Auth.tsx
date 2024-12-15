import { useState } from "react";
import Logo from "../../../assets/Logo.png";
import SignUp from "./SignUp";
import LogIn from "./LogIn";
import useScreenWidth from "../../../hooks/useScreenWidth";

const Auth = () => {
  const screenWidth = useScreenWidth();
  const [isRegistrationComponent, setIsRegistrationComponent] =
    useState<boolean>(false);

  const formStructure = () => {
    if (screenWidth >= 768) {
      return (
        <>
          <SignUp
            setIsRegistrationComponent={setIsRegistrationComponent}
            isRegistrationComponent={isRegistrationComponent}
          />
          <LogIn
            setIsRegistrationComponent={setIsRegistrationComponent}
            isRegistrationComponent={isRegistrationComponent}
          />
        </>
      );
    } else {
      return isRegistrationComponent ? (
        <SignUp
          setIsRegistrationComponent={setIsRegistrationComponent}
          isRegistrationComponent={isRegistrationComponent}
        />
      ) : (
        <LogIn
          setIsRegistrationComponent={setIsRegistrationComponent}
          isRegistrationComponent={isRegistrationComponent}
        />
      );
    }
  };

  const logoElement = () => (
    <div
      className={`md:visible hidden w-1/2 h-full md:flex justify-center items-center bg-primary absolute transition-transform duration-300 ease-in-out 
            ${
              isRegistrationComponent
                ? "translate-x-full rounded-r-xl"
                : "translate-x-0 rounded-l-xl"
            }
            ${screenWidth < 768 ? "hidden" : "block"}`}
      style={{ left: 0 }}
    >
      <img className="lg:w-1/2 w-2/3" src={Logo} alt="logo" />
    </div>
  );

  return (
    <div className="w-full min-h-screen py-20 bg-gradient-to-r from-bgColor to-bgColorSecondary">
      <div className="w-4/5 m-auto text-center flex md:flex-row flex-col justify-center relative">
        {formStructure()}
        {logoElement()}
      </div>
    </div>
  );
};

export default Auth;
