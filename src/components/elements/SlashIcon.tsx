interface SlashIconProps {
  color?: string;
  hoverColor?: string;
  className?: string;
}

const SlashIcon = ({
  color = "#000000",
  hoverColor = "#000000",
  className = "",
}: SlashIconProps) => {
  return (
    <div
      style={{
        overflowX: "hidden",
      }}
      className={className}
      onMouseEnter={(e) => {
        const icon = e.currentTarget.querySelector("path");
        if (icon) icon.setAttribute("fill", hoverColor);
      }}
      onMouseLeave={(e) => {
        const icon = e.currentTarget.querySelector("path");
        if (icon) icon.setAttribute("fill", color);
      }}
    >
      <svg
        className={className}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_88_4)">
          <path
            d="M206.851 0H241.051L82.2002 317.702H48L206.851 0Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_88_4">
            <rect width="300" height="300" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default SlashIcon;
