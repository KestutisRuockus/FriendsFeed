import { useReducer } from 'react';
import { formReducer, initialize } from './formReducer';

export const useForm = () => {
  const [formState, dispatch] = useReducer(formReducer, initialize);

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "fullName":
        dispatch({ type: "SET_FULLNAME", fullName: value });
        break;
      case "email":
        dispatch({ type: "SET_EMAIL", email: value });
        break;
      case "password":
        dispatch({ type: "SET_PASSWORD", password: value });
        break;
      case "confirmPassword":
        dispatch({ type: "SET_CONFIRM_PASSWORD", confirmPassword: value });
        break;
      case "birthdate":
        dispatch({ type: "SET_BIRTHDATE", birthdate: value });
        break;
      case "location":
        dispatch({ type: "SET_LOCATION", location: value });
        break;
      case "gender":
        dispatch({ type: "SET_GENDER", gender: value });
        break;
      default:
        break;
    }
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  return { formState, handleInputsChange, resetForm };
};
