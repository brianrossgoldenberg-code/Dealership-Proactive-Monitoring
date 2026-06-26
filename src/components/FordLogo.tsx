interface Props {
  size?: number;
  className?: string;
}

export default function FordLogo({ size = 48, className }: Props) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.45)}
      viewBox="0 0 120 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="60" cy="27" rx="59" ry="26" fill="#003087" />
      <ellipse cx="60" cy="27" rx="56" ry="23" fill="none" stroke="#B8A000" strokeWidth="1.5" />
      <text
        x="60"
        y="36"
        textAnchor="middle"
        fill="white"
        fontSize="26"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontStyle="italic"
      >
        Ford
      </text>
    </svg>
  );
}
