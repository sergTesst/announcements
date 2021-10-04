import { Link } from "react-router-dom";
import styles from "./NavBar.module.scss";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light shadow bg-light fixed-top ">
      <div className="container-sm">
        <section className="">
          <div className={styles.navContent}>
            <div className={styles.navLinks}>
              <Link className="link-dark text-decoration-none" to="/">
                Announcements
              </Link>
            </div>
          </div>
        </section>
      </div>
    </nav>
  );
};
