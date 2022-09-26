import { useRouter } from "next/router";
import AddressPage from "./index";

export default function TokenPage() {
  const router = useRouter();
  const token = router.query.token as string | undefined;

  return <AddressPage token={token} />;
}
