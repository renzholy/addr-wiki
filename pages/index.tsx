import { isAddress } from "ethers/lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function IndexPage() {
  const [address, setAddress] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (isAddress(address)) {
      router.push(`/${address}`);
    }
  }, [address, router]);

  return (
    <div
      style={{
        margin: "0 auto",
        padding: 20,
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height:
          "calc(100vh - env(safe-area-inset-top, 0) - env(safe-area-inset-bottom, 0))",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        ADDR<span style={{ color: "#878d96" }}>·</span>WIKI
      </h1>
      <input
        value={address}
        placeholder="0x"
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        autoSave="off"
        spellCheck="false"
        onChange={(e) => setAddress(e.target.value)}
        style={{
          width: "100%",
          background: "#21262a",
          border: "none",
          outline: "none",
          marginTop: 40,
          marginBottom: 40,
          padding: 5,
        }}
      />
      <p
        style={{
          textAlign: "center",
          color: "#a2a9b0",
          fontSize: "0.9em",
        }}
      >
        a wiki for evm 0x addresses
      </p>
    </div>
  );
}
