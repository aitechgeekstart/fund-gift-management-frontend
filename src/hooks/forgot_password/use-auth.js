"use client";
import { getApiPath } from "@/helpers";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { createContext, useContext, useState } from "react";

const API_LOGIN_PATH = "/api/v2/user/sessions";
const API_LOGOUT_PATH = "/api/v2/user/sessions";
const API_AVATAR_PATH = "/api/v2/user/avatar";
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
    let isFormData = null;
    if (options.is_form_data !== null) {
      isFormData = options.is_form_data;
    }
    if (!isFormData) {
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

  const login = async (email, password) => {
    const json = await fetcher(API_LOGIN_PATH, {
      method: "POST",
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
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
    router.replace("/login");
  };

  //code for avatar function, may need to find better place to put the code
  if (typeof window !== "undefined") {
    window.avatar = async (email) => {
      const response = await fetcherWithToken(API_AVATAR_PATH, {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
      });
      if (response.success) {
        window.location.reload();
      }
    };
  }

  return {
    authStatus,
    fetcher,
    fetcherWithToken,
    login,
    logout,
  };
}
