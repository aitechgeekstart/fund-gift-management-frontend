import { useAuth } from "@/hooks/use-auth";
import crypto from "crypto";
import { omit } from "lodash";
import QueryString from "query-string";
import useSWR from "swr";

export default function useCustomSWR(
  ready,
  path,
  auth,
  options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    permissions: [],
  },
  queryParams = {},
  method = "GET",
  requestBody = null,
) {
  const { fetcherWithToken, fetcher, can } = useAuth();

  options = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    permissions: [],
    ...options,
  };
  // check permissions
  if (options.permissions.length > 0 && !can(options.permissions)) {
    ready = false;
  } else {
    options = omit(options, ["permissions"]);
  }
  if (!queryParams) {
    queryParams = {};
  }
  if (!requestBody) {
    requestBody = {};
  }
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify({ ...queryParams, ...requestBody }))
    .digest("hex")
    .substring(0, 8);

  queryParams.sha = hash;
  let _path = path;
  if (Object.keys(queryParams).length > 0) {
    const query = QueryString.stringify(queryParams, {
      arrayFormat: "bracket",
    });
    _path = [_path, query].join("?");
  }

  let _fetcher = fetcher;
  if (auth) {
    _fetcher = fetcherWithToken;
  }
  const __fetcher = async (...args) => {
    if (!args[1]) args.push({});
    if (method !== "GET") {
      args[1].method = method;
      if (!!requestBody) {
        args[1].body = JSON.stringify(requestBody);
      }
    }
    return _fetcher(...args);
  };
  return useSWR(ready ? _path : null, __fetcher, {
    ...options,
    dedupingInterval: 60000, // แคชข้อมูลเป็นเวลา 60 วินาที
  });
}
