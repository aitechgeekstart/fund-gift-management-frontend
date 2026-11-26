import { useAuth } from "@/hooks/use-auth";
import LoadingScreen from "./LoadingScreen";
import NoPermission from "./NoPermission";

export default function CheckLayoutPermission({ permissions, children }) {
  const { can, authStatus } = useAuth();
  if (authStatus === "preparing") {
    return <LoadingScreen></LoadingScreen>;
  }
  if (can(permissions)) {
    return children;
  }
  return <NoPermission />;
}
