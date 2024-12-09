import logo from '../img/logo.png';
import Image from "react-bootstrap/Image";
import "../css/Header.css";

const Logo = () => {
    return (
      <>
      <div>
      <h1><Image src={logo} id="logo"/></h1>
      </div>
      </>
    );
};

export default Logo;
