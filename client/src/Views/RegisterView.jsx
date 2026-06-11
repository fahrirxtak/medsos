import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customAPI from "../config/axios";
import { useAuthStore } from "../stores/authStore";

const RegisterView = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [disable, setDisable] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const {setTokenData} = useAuthStore();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setDisable(true);
    try {
      const { data } = await customAPI.post("/auth/register", formData);

      setTokenData( data.data, data.token )
      navigate("/")
    } catch (error) {
      console.log(error.response);
      const errorMsg = error.response.data.message
      const errorData = Array.isArray(errorMsg) ? errorMsg[0] : errorMsg;
      setErrorMessage(errorData);
    } finally {
      setDisable(false);
    }
  };

  return (
    <div className="flex flex-1 my-5 justify-center">
      <div className="w-full max-w-xs">
        <div className=" card bg-base-100 border border-info-content">
          <form onSubmit={handleRegister}>
            <div className="card-body px-8 py-6">
              {/* Logo */}
              <div className="text-center">
                <h1 className="text-5xl  font-logo">JustGram</h1>
                <p className="font-semibold mt-3 leading-7">
                  Sign up to see photos and videos from your friends.
                </p>
              </div>

              {errorMessage && (
                <p className="text-error texxt-center my-2">{errorMessage}</p>
              )}

              <div className="divider"></div>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full bg-base-300"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full bg-base-300"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Fullname"
                className="input input-bordered w-full bg-base-300"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fullname: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered w-full bg-base-300"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
              />
              <button
                className="btn btn-info w-full mt-4"
                type="submit"
                disabled={disable}
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="divider">OR</div>
          <div className="card bg-base-100 my-3">
            <div className="card-body py-4 text-center text-sm">
              Have an account?{""}
              <Link
                to={"/login"}
                className="link link-info no-underline font-semibold cursor-pointer"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
