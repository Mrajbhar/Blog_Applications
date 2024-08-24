import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import "../styles/Header.css";
import { FaBookOpen } from "react-icons/fa";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const navbarClasses =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";

  return (
    <Navbar
      className={`border-b-2 ${navbarClasses} transition-colors duration-300`}
      fluid
    >
      <Navbar.Brand>
        <Link
          to="/"
          className="flex items-center space-x-2 text-sm sm:text-xl font-semibold"
        >
          <FaBookOpen
            className={`text-4xl ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          />
          <span
            className={`text-xl font-extrabold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            ViewBlog
          </span>
        </Link>
      </Navbar.Brand>

      <Navbar.Toggle />

      <Navbar.Collapse>
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 md:space-x-4"
        >
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="w-full max-w-xs rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            type="submit"
            className="hidden md:inline-block bg-black text-white hover:bg-blue-600"
          >
            Search
          </Button>
        </form>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            className="w-10 h-10 p-2"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">@{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </Navbar.Collapse>

      <Navbar.Collapse className="md:flex">
        <Navbar.Link active={path === "/"} as="div">
          <Link
            to="/"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-black"
            } hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:via-cyan-500 hover:to-blue-600`}
          >
            Home
          </Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/about"} as="div">
          <Link
            to="/about"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-black"
            } hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:via-cyan-500 hover:to-blue-600`}
          >
            About
          </Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/projects"} as="div">
          <Link
            to="/projects"
            className={`transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-black"
            } hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:via-cyan-500 hover:to-blue-600`}
          >
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
