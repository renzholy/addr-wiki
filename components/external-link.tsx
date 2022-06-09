/* eslint-disable @next/next/no-img-element */

export default function ExternalLink(props: {
  icon: string;
  href: string;
  size?: number;
}) {
  const size = props.size || 30;

  return (
    <a href={props.href} style={{ display: "inline-block", margin: 10 }}>
      <img
        src={
          props.icon.startsWith("http") ? props.icon : `/icons/${props.icon}`
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
