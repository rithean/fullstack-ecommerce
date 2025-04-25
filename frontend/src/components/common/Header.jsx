import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { FaCartPlus, FaUserCircle } from "react-icons/fa";
import { AdminAuthContext } from "../context/AdminAuth";
import { CartContext } from "../context/CartContext";
import { BaseUrl } from "./BaseUrl";
import axios from "axios";

const Header = () => {
  const { logout } = useContext(AdminAuthContext);
  const { cartData } = useContext(CartContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = () => {
      const adminInfo = localStorage.getItem("adminInfo");
      setIsLoggedIn(!!adminInfo);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin); // Sync across tabs

    const fetchLogo = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/logos");
        const logoPath = res.data.data[0]?.image;
        if (logoPath) {
          setLogoUrl(`${BaseUrl}${logoPath}`);
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    };

    fetchLogo();

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const cartItemCount = cartData.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("adminInfo");
    setIsLoggedIn(false); 
    navigate("/");
    alert("Logout successful");
  };

  return (
    <Navbar className="navbar" bg="dark" variant="dark" expand="lg">
      <div className="container">
        <Navbar.Brand href="/">
          {logoUrl ? (
            <img src={logoUrl} alt="RT Store Logo" style={{ height: "50px" }} />
          ) : (
            "RT Store"
          )}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/shop">
              Shop
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
          </Nav>
          <Nav>
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/auth/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/auth/signup">
                  Sign Up
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/cart" className="cart-link">
                  <FaCartPlus size={28} />
                  {cartItemCount > 0 && (
                    <Badge pill bg="danger" className="cart-badge">
                      {cartItemCount}
                    </Badge>
                  )}
                </Nav.Link>
                <NavDropdown
                  title={<FaUserCircle size={28} />}
                  id="navbarDropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <FaUserCircle /> Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Log out
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
