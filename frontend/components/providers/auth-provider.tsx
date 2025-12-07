"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
type Props = {
  children: ReactNode;
};
type ValueProps = {
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  loginRequiredRedirect: () => void;
  username:string;
};
const LOCAL_STORAGE_KEY = "is-logged-in";
const LOGIN_REDIRECT_URL = "/";
const LOGOUT_REDIRECT_URL = "/login";
const LOGIN_REQUIRED_URL = "/login";
const LOCAL_USERNAME_KEY = "username";

const AuthContext = createContext<ValueProps | null>(null);
export const AuthProvider = ({ children }: Props) => {
  const [username, setUsername] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedUsername = localStorage.getItem(LOCAL_USERNAME_KEY)
    if (storedAuthStatus) {
      const storedAuthStatusInt = parseInt(storedAuthStatus);
      setIsAuthenticated(storedAuthStatusInt === 1);
    }
    if (storedUsername){
      setUsername(storedUsername)
    }
  }, []);
  const login = (username: string) => {
    setIsAuthenticated(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, "1");
    // check username exist send from login api
    if (username) {
      localStorage.setItem(LOCAL_USERNAME_KEY, `${username}`);
    }
     else {
      localStorage.removeItem(LOCAL_USERNAME_KEY);
    }
    // set Username for Children
    setUsername(username);
    const nextUrl = searchParams.get("next");
    const invalidNextUrl = ["/login", "/logout"];
    const nextUrlValid =
      nextUrl && nextUrl.startsWith("/") && !invalidNextUrl.includes(nextUrl);
    if (nextUrlValid) {
      router.replace(nextUrl);
    } else {
      router.replace(LOGIN_REDIRECT_URL);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, "0");
    router.replace(LOGOUT_REDIRECT_URL);
  };

  const loginRequiredRedirect = () => {
    // User in not logged in via API
    setIsAuthenticated(false);
    localStorage.setItem(LOCAL_STORAGE_KEY, "0");
    let loginwithNextUrl = `${LOGIN_REQUIRED_URL}?next=${pathname}`;

    if (LOGIN_REQUIRED_URL === pathname) {
      loginwithNextUrl = `${LOGIN_REQUIRED_URL}`;
    }
    router.replace(loginwithNextUrl);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loginRequiredRedirect,username }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
