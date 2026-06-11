import { Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router-dom";

const AuthLayout = () => {

  const { isAuthentication } = useAuthStore();
 

  return !isAuthentication ? (
    <>
      <main className="min-h-[80vh] flex items-center justify-center bg-base-200">
        <Outlet />
      </main>
      <footer className="footer footer-horizontal footer-center bg-info/5 text-base-content rounded p-10">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>

        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by ME
          </p>
        </aside>
      </footer>
    </>
  ) : (
    <Navigate to={"/"} replace />
  );
};

export default AuthLayout;
