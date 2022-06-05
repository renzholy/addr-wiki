/* eslint-disable @next/next/no-img-element */

export default function ExternalLink(props: {
  icon: string;
  href: string;
  size?: number;
}) {
  const size = props.size || 60;

  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      style={{ display: "inline-block", margin: 10 }}
    >
      <img
        src={
          props.icon.startsWith("http")
            ? props.icon
            : `/icons/${props.icon}.svg`
        }
        alt={props.icon}
        width={size}
        height={size}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          width: size,
          height: size,
        }}
      />
    </a>
  );
}
