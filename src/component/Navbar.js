import navStyle from "./Nav.module.css";

function Navbar(){


    const handleLogoClick = () => {
        //e.preventDefault();
        window.location.reload();
    }


    return(
        <>
        <div className={navStyle.nav}>
      <div className={navStyle.logo} onClick={handleLogoClick}>
      <img src="https://mellow-seahorse-fc9268.netlify.app/assets/logo.png"/>
        <span>PhotoFolio</span>

        </div>
        </div>
        </>
    )
}

export default Navbar;