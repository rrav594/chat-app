import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({
    firstname,
    lastname,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleInputErrors({
      firstname,
      lastname,
      username,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          password,
          confirmPassword,
          gender,
        }),
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      //   localstorage + context
      localStorage.setItem("user-info", JSON.stringify(data));
      setAuthUser(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
}

export default useSignup;

function handleInputErrors({
  firstname,
  lastname,
  username,
  password,
  confirmPassword,
  gender,
}) {
  if (
    !firstname ||
    !lastname ||
    !username ||
    !password ||
    !confirmPassword ||
    !gender
  ) {
    toast.error("Please fill in all fields.");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Password do not match.");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be minimum 6 letters.");
    return false;
  }
  return true;
}
