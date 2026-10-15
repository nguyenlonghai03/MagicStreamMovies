import { useEffect, useMemo, useRef } from "react";
import axios from "axios";

import useAuth from "./useAuth";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const useAxiosPrivate = () => {
  const axiosAuth = useMemo(
    () =>
      axios.create({
        baseURL: apiUrl,
        withCredentials: true,
      }),
    [],
  );
  const refreshPromise = useRef(null);
  const { setAuth } = useAuth();

  useEffect(() => {
    const interceptorId = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || !error.response) {
          return Promise.reject(error);
        }

        const isRefreshRequest = originalRequest.url
          ?.split("?")[0]
          .endsWith("/refresh");

        if (
          error.response.status !== 401 ||
          isRefreshRequest ||
          originalRequest._retry
        ) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!refreshPromise.current) {
          refreshPromise.current = axiosAuth
            .post("/refresh")
            .catch((refreshError) => {
              localStorage.removeItem("user");
              setAuth(null);
              throw refreshError;
            })
            .finally(() => {
              refreshPromise.current = null;
            });
        }

        try {
          await refreshPromise.current;
          return await axiosAuth(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      },
    );

    return () => {
      axiosAuth.interceptors.response.eject(interceptorId);
    };
  }, [axiosAuth, setAuth]);

  return axiosAuth;
};

export default useAxiosPrivate;
