import Logo from "@/assets/image/social-media.png";
import { Link, useNavigate } from "react-router-dom";
import customAPI from "../config/axios";
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

const LoginView = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [disable, setDisable] = useState(false);

  const { setTokenData } = useAuthStore();

  const navigate = useNavigate();

  const HandleLogin = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const { data } = await customAPI.post("/auth/login", formData);
      
      setTokenData(data.data, data.token);

      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="flex w-full max-w-5xl">
      {/* Left Side */}
      <div className="hidden md:flex flex-1 items-center justify-center">
        <img src={Logo} alt="Logo" className="w-96 h-96 mt-3 mx-auto" />
      </div>
      {/* Right Side */}
      <form onSubmit={HandleLogin}>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xs">
            {/* Login Form */}
            <div className=" card bg-base-100">
              <div className="card-body px-8 py-10">
                {/* text */}
                <div className="text-center mb-8">
                  <h1 className="text-5xl  font-logo">JustGram</h1>
                </div>
                {errorMessage && (
                  <p className="text-error text-center">{errorMessage}</p>
                )}
                <input
                  type="text"
                  placeholder="Email"
                  className="input input-bordered w-full bg-base-200"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full bg-base-200 mb-3"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

                <button className="btn w-full bg-info" type="submit" disabled={disable}>Log In</button>
              </div>
            </div>

            <div className="divider">OR</div>

            {/* Register Link */}
            <div className="card bg-base-100 mt-4">
              <div className="card-body py-4 text-center text-sm">
                Don't have an account?
                <Link to={"/register"} className="link link-info">
                  <span className="link link-primary font-semibold cursor-pointer">
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginView;
