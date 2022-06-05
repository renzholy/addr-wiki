/* eslint-disable @next/next/no-img-element */

export default function ExternalLink(props: { icon: string; href: string }) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      style={{ display: "block", margin: 3 }}
    >
      <img
        src={
          props.icon.startsWith("http")
            ? props.icon
            : `/icons/${props.icon}.svg`
        }
        alt={props.icon}
        width={64}
        height={64}
        style={{
          borderRadius: "50%",
          objectFit: "contain",
          width: 64,
          height: 64,
        }}
      />
    </a>
  );
}
