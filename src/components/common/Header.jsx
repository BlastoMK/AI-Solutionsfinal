import { Menu, Search } from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { navlink } from "../data/dummydata";
import logo from "../data/images/logo.png";

export const Header = () => {
  const [responsive, setResponsive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchInput(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header>
      <div className='container flexsb'>
        <div className='logo'>
          <img src={logo} alt='' data-aos='zoom-in-right' />
        </div>
        
        <div className={responsive ? "hideMenu" : "nav"}>
          {/* Search icon positioned before Home link */}
          <div className="search-icon-container" ref={searchRef}>
            <Search 
              className="search-icon" 
              onClick={() => setShowSearchInput(!showSearchInput)}
              style={{ cursor: "pointer" }}
            />
            {showSearchInput && (
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </form>
            )}
          </div>
          
          {navlink.map((links, i) => (
            <Link to={links.url} key={i} data-aos='zoom-in-left'>
              {links.text}
            </Link>
          ))}
        </div>
        
        <button className='toggle' onClick={() => setResponsive(!responsive)}>
          <Menu className='icon' />
        </button>
      </div>
    </header>
  );
};