type ButtonProps = {
  text: string;
  fn: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

const Button = ({ text, fn }: ButtonProps) => {
  return (
    <button
      className="border-2 w-fit m-auto px-4 py-1 rounded-lg bg-primary text-secondary font-semibold hover:text-primary hover:bg-secondary hover:scale-110 transition-all duration-300"
      onClick={fn}
    >
      {text}
    </button>
  );
};

export default Button;
