import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Signup");
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const { token, setToken, backEndUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    console.log(token);

    e.preventDefault();
    try {
      if (state == "Signup") {
        const { data } = await axios.post(backEndUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backEndUrl + "/api/user/userLogin", {
          email,
          password,
        });
        if (data.success) {
          console.log(data.token);
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err);
      console.log(err);
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center "
    >
      <div className="flex flex-col  gap-3  m-auto  items-start p-8 min-w-[340px] sm:min-w-96 border  rounded-xl text-zinc-600  text-sm  shadow-lg">
        <p className="text-2xl font-semibold ">
          {state == "Signup" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state == "Signup" ? "Sign up" : "login"} to Book a Appointment
        </p>
        {state === "Signup" && (
          <div className=" w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className=" w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className=" w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2  rounded-md text-base"
        >
          {state == "Signup" ? "Sign up" : "Login"}
        </button>
        {state == "Signup" ? (
          <p>
            Already Have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>{" "}
          </p>
        ) : (
          <p>
            Create a new Account ?{" "}
            <span
              onClick={() => setState("Signup")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>{" "}
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
