interface Props {
  size?: number;
  color?: string;
}

const Plus = ({ size = 24, color = "#000000" }: Props) => {
  return (
    <>
      <div className="w-[48px] h-[48px] flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 7V17M7 12H17"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

export default Plus;
