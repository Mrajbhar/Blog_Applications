import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { FaBookOpen } from "react-icons/fa";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold dark:text-white text-4xl flex items-center space-x-2"
          >
            <FaBookOpen className="text-5xl text-gradient" />
            <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600">
              View
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            <span className="text-lg font-semibold text-gradient bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-500 to-blue-500">
              Join ViewBlog Today!
            </span>
            <br />
            Create your account to unlock a world of insightful articles,
            tutorials, and engaging content.
            <br />
            Sign up easily with your{" "}
            <span className="font-semibold text-green-500">
              username email and password{" "}
            </span>
            or use <span className="font-semibold text-blue-500">Google</span>{" "}
            for a quick start.
            <br />
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="font-semibold text-teal-500 hover:underline"
            >
              Sign in{" "}
            </Link>
            and continue exploring!
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              gradientDuoTone="cyanToBlue"
              className="text-white font-semibold py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
