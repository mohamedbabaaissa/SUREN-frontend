import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <section className="footer">
      <div className="boutiques">
        <h3>Boutiques</h3>
        <ul className="listfooter">
          <li>
            <Link to="/man">man</Link>
          </li>
          <li>
            <Link to="/woman">woman</Link>
          </li>
          <li>
            <Link to="/accessories">accessories</Link>
          </li>
        </ul>
      </div>

      <div className="services">
        <h3>services</h3>
        <ul>
          <li>Easy Returns & Exchanges</li>
          <li>Free Shipping</li>
        </ul>
      </div>

      <div className="social">
        <h3>social</h3>
        <a
          href="https://instagram.com/mohaaa1.h"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        <a
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
      </div>

      <div className="read">
        <h3>SUREN</h3>
        <p>Fashion made for those who choose to stand out</p>
      </div>
    </section>
  );
}

export default Footer;