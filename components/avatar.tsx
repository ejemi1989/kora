interface AvatarProps {
  initials: string;
  size?: number;
  radius?: number | string;
  className?: string;
}

export function Avatar({
  initials,
  size = 28,
  radius = 6,
  className = "",
}: AvatarProps) {
  const fontSize = size >= 30 ? 11 : 10;

  return (
    <span
      className={`avatar ${className}`.trim()}
      style={{
        width: size,
        height: size,
        borderRadius: typeof radius === "number" ? radius : undefined,
        fontSize,
      }}
    >
      {initials}
    </span>
  );
}
