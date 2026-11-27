"use client";
import { getApiPath } from "@/helpers";
import { intersection } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";

const API_LOGIN_PATH = "/api/v1/user/sessions";
const API_VERIFY_OTP_PATH = "/api/v1/user/sessions/verify_otp";
const API_LOGOUT_PATH = "/api/v1/user/sessions";
const API_PROFILE_PATH = "/api/v1/user/sessions/me";

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  return useContext(AuthContext);
};

function useAuthProvider() {
  const [authStatus, setAuthStatus] = useState("preparing");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const pathname = usePathname();

  const can = (permissions = []) => {
    if (permissions === "no_permission") {
      return true;
    }
    if (typeof permissions === "string") {
      permissions = [permissions];
    }
    return intersection(permissions, user?.permissions).length > 0;
  };

  const fetcher = async (...args) => {
    const replaceParams = {};
    args[0] = getApiPath(args[0], true, replaceParams);
    if (args.length <= 1) {
      args.push({});
    }
    const options = args[1];
    if (!options.headers) {
      options.headers = {};
    }
    options.credentials = "include";
    const isFormData = options.body instanceof FormData;

    if (isFormData) {
      delete options.headers["content-type"];
      delete options.headers["Content-Type"];
    } else {
      options.headers["content-type"] = "application/json";
    }
    let response = await fetch(...args);
    if (response.status >= 500) {
      enqueueSnackbar(`INTERNAL SERVER ERROR: ${response.status}`, {
        variant: "error",
      });
    } else if (response.status >= 404) {
      enqueueSnackbar(`ERROR: ${response.status}`, {
        variant: "error",
      });
    } else if (response.status === 401) {
      enqueueSnackbar("Please Login.", {
        variant: "error",
      });
      await logout();
    }
    let json = await response.json();
    json.response = response;
    return json;
  };
  const fetcherWithToken = async (...args) => {
    if (args.length <= 1) {
      args.push({});
    }
    const options = args[1];
    if (!options.headers) {
      options.headers = {};
    }
    const json = await fetcher(...args);
    if (json?.response.status === 401) {
      await logout();
    } else if (json?.response.status === 403) {
      enqueueSnackbar(`CHECK PERMISSIONS: ${args[0]} forbidden`, {
        variant: "error",
      });
    }
    return json;
  };
  const {
    data: user,
    error: userError,
    mutate: mutateCurrentUser,
  } = useSWR(authStatus === "no" ? null : API_PROFILE_PATH, async (...args) => {
    const json = await fetcherWithToken(...args);
    if (!json) {
      setAuthStatus("no");
      return;
    }
    return json.user;
  });
  const login = async (email, password, deviceToken) => {
    const json = await fetcher(API_LOGIN_PATH, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        device_token: deviceToken,
      }),
    });
    if (json?.response.status === 201) {
      setAuthStatus("preparing");
    }
    return json;
  };
  const verifyOtp = async (jwt, otp) => {
    const json = await fetcher(API_VERIFY_OTP_PATH, {
      method: "POST",
      body: JSON.stringify({ otp }),
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (json?.response.status === 201) {
      setAuthStatus("preparing");
      mutateCurrentUser();
    }
    return json;
  };
  const logout = async () => {
    if (authStatus === "yes") {
      try {
        await fetcherWithToken(API_LOGOUT_PATH, {
          method: "DELETE",
        });
        setAuthStatus("no");
      } catch (e) {}
    }
    if (!pathname.includes("login")) {
      router.replace("/login");
    }
  };
  useEffect(() => {
    if (!!user) {
      setAuthStatus("yes");
    }
  }, [user]);

  return {
    user,
    userError,
    mutateCurrentUser,
    authStatus,
    can,
    fetcher,
    fetcherWithToken,
    login,
    logout,
    verifyOtp,
  };
}
