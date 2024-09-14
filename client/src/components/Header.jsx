import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun, FaBookOpen,FaHome ,FaProjectDiagram,FaInfoCircle} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import "../styles/Header.css";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState("");
  const [submenuOpen, setSubmenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
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
      className={`border-b-2 ${navbarClasses} transition-colors duration-300 shadow-md`}
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

      <Navbar.Collapse className="w-full md:flex items-center justify-between">
        <div className="search-container relative flex items-center">
          <form
            onSubmit={handleSubmit}
            className="flex items-center space-x-2 md:space-x-4 w-full"
          >
            <div className="search-input-wrapper flex items-center">
              <TextInput
                type="text"
                placeholder="Search..."
                rightIcon={AiOutlineSearch}
                className="search-input rounded-md pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            className="w-10 h-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "light" ? (
              <FaSun className="text-yellow-500" />
            ) : (
              <FaMoon className="text-blue-400" />
            )}
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

      <Navbar.Collapse className="md:flex justify-between w-full">
  {/* Blog Menu */}
  <div
    className="relative menu-item"
    onClick={() => setSubmenuOpen(!submenuOpen)}
  >
    <div className="cursor-pointer">
      <Link
        to="/"
        className="menu-item transition-transform transform hover:scale-105"
      >
        <FaBookOpen className="text-2xl" /> {/* Icon */}
        <span>Blogs</span>
      </Link>
    </div>

    {(submenuOpen || window.innerWidth > 768) && (
      <div
        className={`submenu ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <Link
          to="/blog/tech"
          className="submenu-item hover:bg-gradient-to-r hover:from-teal-400 hover:via-cyan-500 hover:to-blue-600 hover:text-white"
        >
          <div className="flex items-center">
            <span className="mr-2 text-xl">💻</span> Tech Blog
          </div>
          <p className="text-xs mt-1">
            Latest trends in technology and development.
          </p>
        </Link>
        <Link
          to="/blog/lifestyle"
          className="submenu-item hover:bg-gradient-to-r hover:from-teal-400 hover:via-cyan-500 hover:to-blue-600 hover:text-white"
        >
          <div className="flex items-center">
            <span className="mr-2 text-xl">🌸</span> Lifestyle Blog
          </div>
          <p className="text-xs mt-1">
            Tips and insights for a better lifestyle.
          </p>
        </Link>
        <Link
          to="/blog/travel"
          className="submenu-item hover:bg-gradient-to-r hover:from-teal-400 hover:via-cyan-500 hover:to-blue-600 hover:text-white"
        >
          <div className="flex items-center">
            <span className="mr-2 text-xl">✈️</span> Travel Blog
          </div>
          <p className="text-xs mt-1">
            Explore travel destinations and experiences.
          </p>
        </Link>
      </div>
    )}
  </div>

  <Navbar.Link active={path === "/"} as="div">
    <Link
      to="/"
      className="menu-item transition-transform transform hover:scale-105"
    >
      <FaHome className="text-lg" /> {/* Icon */}
      <span>Home</span>
    </Link>
  </Navbar.Link>

  <Navbar.Link active={path === "/about"} as="div">
    <Link
      to="/about"
      className="menu-item transition-transform transform hover:scale-105"
    >
      <FaInfoCircle className="text-lg" /> {/* Icon */}
      <span>About</span>
    </Link>
  </Navbar.Link>

  <Navbar.Link active={path === "/projects"} as="div">
    <Link
      to="/projects"
      className="menu-item transition-transform transform hover:scale-105"
    >
      <FaProjectDiagram className="text-lg" /> {/* Icon */}
      <span>Projects</span>
    </Link>
  </Navbar.Link>
</Navbar.Collapse>

    </Navbar>
  );
}
