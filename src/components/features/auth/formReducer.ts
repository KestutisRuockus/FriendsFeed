import { FormStateProps, FormActionProps } from './types';

export const initialize: FormStateProps = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  birthdate: "",
  location: "",
  gender: "",
};

export const formReducer = (state: FormStateProps, action: FormActionProps): FormStateProps => {
  switch (action.type) {
    case "SET_FULLNAME":
      return { ...state, fullName: action.fullName };
    case "SET_EMAIL":
      return { ...state, email: action.email };
    case "SET_PASSWORD":
      return { ...state, password: action.password };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.confirmPassword };
    case "SET_BIRTHDATE":
      return { ...state, birthdate: action.birthdate };
    case "SET_LOCATION":
      return { ...state, location: action.location };
    case "SET_GENDER":
      return { ...state, gender: action.gender };
    case "RESET_FORM":
      return initialize;
    default:
      return state;
  }
};
