export type FormStateProps = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    birthdate: string;
    location: string;
    gender: string;
  };
  
  export type FormActionProps =
    | { type: "SET_FULLNAME"; fullName: string }
    | { type: "SET_EMAIL"; email: string }
    | { type: "SET_PASSWORD"; password: string }
    | { type: "SET_CONFIRM_PASSWORD"; confirmPassword: string }
    | { type: "SET_LOCATION"; location: string }
    | { type: "SET_BIRTHDATE"; birthdate: string }
    | { type: "SET_GENDER"; gender: string }
    | { type: "RESET_FORM" };
  
    export type LogInProps = {
      setIsRegistrationComponent: React.Dispatch<React.SetStateAction<boolean>>;
      isRegistrationComponent: boolean
    }

    export type SignUpProps = {
      isRegistrationComponent: boolean
      setIsRegistrationComponent: React.Dispatch<React.SetStateAction<boolean>>;
    };

    export type ErrorMessageProps = {
      message: string | null;
    };
    