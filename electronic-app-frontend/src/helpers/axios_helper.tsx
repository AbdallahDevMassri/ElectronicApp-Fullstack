import axios from "axios";
import type { AxiosRequestConfig, Method } from "axios";

// This file contains helper functions for making HTTP requests using axios.
// It includes functions to get and set the authentication token in local storage,
// as well as a function to make requests with the specified method, URL, and data.
// The base URL for the requests is set to "http://localhost:8080" and the content type for POST requests is set to "application/json".
export const getAuthToken = (): string | null => {
  return window.localStorage.getItem("auth_token");
};

export const setAuthHeader = (token: string | null): void => {
  if (token !== null) {
    window.localStorage.setItem("auth_token", token);
  } else {
    window.localStorage.removeItem("auth_token");
  }
};

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const request = (method: Method, url: string, data?: unknown) => {
  const headers: AxiosRequestConfig["headers"] = {};
  const token = getAuthToken();
  if (token && token !== "null") {
    headers.Authorization = `Bearer ${token}`;
  }

  return axios({
    method,
    url,
    headers,
    data,
  });
};
