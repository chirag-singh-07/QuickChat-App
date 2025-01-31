import {
  Eye,
  EyeOff,
  Loader,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isSigningUp, signUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return toast.error("Full Name is required");
    }
    if (!formData.email.trim()) {
      return toast.error("Email is required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return toast.error("Invalid email format");
    }
    if (!formData.password.trim()) {
      return toast.error("Password is required");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const succes = validateForm();

    if (succes === true) {
      signUp(formData);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <MessageSquare className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
            <p className="text-base-content/60">
              Get started with your free account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="fullName" className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Johane Doe"
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  id="email"
                  name="eamil"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="**********"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={isSigningUp}
              type="submit"
            >
              {isSigningUp ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <p className="text-base-content/60 text-center">
            {" "}
            Already have an account ? {"    "}
            <Link to={"/login"} className="link link-primary">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
      {/* right side */}

      <AuthImagePattern
        title="Joim our community"
        caption="Connect with fellow chatters, share your experiences, and join the conversation."
      />
    </div>
  );
};

export default SignUpPage;
