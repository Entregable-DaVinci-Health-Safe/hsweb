import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import Header from "./Header";

const Layout = () => {
  return (
    <>
          <NavBar />
      <Header />
      <div style={{
        height: "calc(100vh - 64px)", // altura total - altura del NavBar y del Header
        overflowY: "auto", // solo se agrega scrollbar vertical cuando se necesita
      }}>
        <div>
        <Outlet/>
        </div>
      </div>
    </>
  );
};

export default Layout;
