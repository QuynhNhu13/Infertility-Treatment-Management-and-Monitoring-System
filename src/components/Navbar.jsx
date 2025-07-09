import "../styles/Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import ROUTES from "../routes/RoutePath";


const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/api/search?query=${encodeURIComponent(query)}`); //api tìm kiếm
      const data = await response.json();
      console.log("Kết quả tìm kiếm:", data);

      navigate(`/search?query=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error("Lỗi khi gọi API tìm kiếm:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-links1">
        <Link to={ROUTES.HOME} className={location.pathname === ROUTES.HOME ? 'nav-link active' : 'nav-link'}
        >TRANG CHỦ</Link>
        <Link to={ROUTES.LIST_SERVICE} className={location.pathname === ROUTES.LIST_SERVICE ? "nav-link active" : "nav-link"}>PHƯƠNG PHÁP</Link>
        <Link to="/chuyen-gia-bac-si" className={location.pathname === "/chuyen-gia-bac-si" ? "nav-link active" : "nav-link"}>CHUYÊN GIA - BÁC SĨ</Link>
        <Link to="/thanh-tuu" className={location.pathname === "/thanh-tuu" ? "nav-link active" : "nav-link"}>THÀNH TỰU</Link>
        <Link to="/goc-chia-se" className={location.pathname === "/goc-chia-se" ? "nav-link active" : "nav-link"}>GÓC CHIA SẺ</Link>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <SearchIcon className="search-icon" />
      </div>
    </nav>
  );
};

export default Navbar;
