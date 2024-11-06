import { ErrorMessageProps } from './types';

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    
  if (!message) return null;

  return (
    <div className="text-red-500 font-semibold text-lg mt-2 w-full">
      {message}
    </div>
  );
};

export default ErrorMessage;
