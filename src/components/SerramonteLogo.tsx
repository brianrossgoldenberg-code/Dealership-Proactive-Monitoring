interface Props {
  size?: number;
}

export default function SerramonteLogo({ size = 40 }: Props) {
  return (
    <img
      src="/serramonte-logo.png"
      alt="Serramonte Ford"
      style={{ height: size, width: "auto" }}
    />
  );
}
