interface Props {
  size?: number;
  color?: string;
}

const Tick = ({ size = 24, color = "#000000" }: Props) => {
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
            d="M4.89163 13.2687L9.16582 17.5427L18.7085 8"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

export default Tick;
