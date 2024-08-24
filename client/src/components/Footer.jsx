import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsTwitter, BsGithub } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { useSelector } from "react-redux"; // To get the theme from the store

export default function FooterCom() {
  const { theme } = useSelector((state) => state.theme); // Access the theme from the Redux store

  // Determine the background gradient based on the current theme
  const footerBackground =
    theme === "dark"
      ? "bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white"
      : "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-black";

  return (
    <Footer
      container
      className={`${footerBackground} transition-colors duration-300`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Brand Section */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-3 text-lg font-bold"
            >
              <FaBookOpen className="text-4xl" />
              <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-500 to-blue-500">
                ViewBlog
              </span>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col md:flex-row gap-8 mt-8 md:mt-0">
            <div className="text-center md:text-left">
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://mohan-portfolio-react.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Projects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ViewBlog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="text-center md:text-left">
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/Mrajbhar"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="text-center md:text-left">
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider className="my-6 border-t border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <Footer.Copyright
            href="#"
            by="ViewBlog"
            year={new Date().getFullYear()}
            className="text-center md:text-left"
          />
          <div className="flex gap-6 mt-4 md:mt-0">
            <Footer.Icon
              href="https://www.facebook.com"
              icon={BsFacebook}
              className="text-xl transition-transform transform hover:scale-110"
            />
            <Footer.Icon
              href="https://www.instagram.com"
              icon={BsInstagram}
              className="text-xl transition-transform transform hover:scale-110"
            />
            <Footer.Icon
              href="https://twitter.com"
              icon={BsTwitter}
              className="text-xl transition-transform transform hover:scale-110"
            />
            <Footer.Icon
              href="https://github.com/Mrajbhar"
              icon={BsGithub}
              className="text-xl transition-transform transform hover:scale-110"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
