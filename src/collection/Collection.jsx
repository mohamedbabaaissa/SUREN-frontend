import "./Collection.css";

import { Link } from "react-router-dom";
import  {accessoriescoll , mancoll ,womancoll} from "../assets/Export";

/*
  Collection
  ----------
  Fetches one representative product thumbnail per category to use as
  the collection card image. Replace the fetch calls with your own
  category-image API when ready.
*/

function Collection() {
  return (
    <>
      {/* COLLECTION TITLE */}
      <section className="collectiontext">
        <div className="collection-content">
          <h1>The Mediterranean Estate Collection</h1>
        </div>
      </section>

      {/* COLLECTION CARDS */}
      <section id="collection" className="collection">

        {/* WOMEN */}
        <div className="collectionn-container">
          <Link to="/woman">
            <img
              src={womancoll}
              alt="Women's Collection"
              loading="lazy"
              decoding="async"
            />
            <div className="collection-info">
              <div>
                <h2 className="collection-title">Women's Collection</h2>
                <p>Flowing silhouettes &amp; sun-bleached hues.</p>
              </div>
              <i className="fa-solid fa-arrow-right" />
            </div>
          </Link>
        </div>

        {/* MEN */}
        <div className="collectionn-container">
          <Link to="/man">
            <img
              src={mancoll}
              alt="Men's Collection"
              loading="lazy"
              decoding="async"
            />
            <div className="collection-info">
              <div>
                <h2 className="collection-title">Men's Collection</h2>
                <p>Unstructured tailoring.</p>
              </div>
              <i className="fa-solid fa-arrow-right" />
            </div>
          </Link>
        </div>

        {/* ACCESSORIES — fixed: was "/Accessories" (wrong case) */}
        <div className="collectionn-container">
          <Link to="/accessories">
            <img
              src={accessoriescoll}
              alt="Accessories Collection"
              loading="lazy"
              decoding="async"
            />
            <div className="collection-info">
              <div>
                <h2 className="collection-title">Accessories</h2>
                <p>Artisan crafted essentials.</p>
              </div>
              <i className="fa-solid fa-arrow-right" />
            </div>
          </Link>
        </div>

      </section>
    </>
  );
}

export default Collection;
