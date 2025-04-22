import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaCartPlus, FaUserCircle } from "react-icons/fa"; 
import { AdminAuthContext } from "../context/AdminAuth";
const Header = () => {
  const { logout } = useContext(AdminAuthContext)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const adminInfo = localStorage.getItem("adminInfo");
    setIsLoggedIn(!adminInfo.token); 
  }, []);

  return (
    <Navbar className="navbar" bg="dark" variant="dark" expand="lg">
      <div className="container">
        <Navbar.Brand href="/">RT Store</Navbar.Brand>
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
                <Nav.Link as={Link} to="/cart">
                  <FaCartPlus size={28} />
                </Nav.Link>
                <NavDropdown
                  title={
                    <>
                      <FaUserCircle size={28} /> 
                    </>
                  }
                  id="navbarDropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    <FaUserCircle /> Profile {/* Using FaUserCircle icon */}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>
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
