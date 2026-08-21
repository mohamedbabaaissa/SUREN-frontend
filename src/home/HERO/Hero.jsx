import "./Hero.css";
import Img, { homeimg } from "../../assets/Export";

function Hero() {
  return (
    <>
      {" "}
      <section className="hero">
        <Img src={homeimg} alt="SUREN Collection" className="hero-image" />

        <div className="hero-overlays"></div>

        <div className="hero-content">
          <p className="hero-season">SPRING / SUMMER 2026</p>

          <h1>The Art of</h1>

          <h2>the Escape</h2>

          <button
            className="hero-button"
            onClick={() => {
              document.getElementById("collection")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            DISCOVER THE COLLECTION
          </button>
        </div>
      </section>
      <section className="brand-story">
        <div className="story-content">
          <p className="story-main">
            Rooted in the timeless elegance of the Aegean coast, Suren crafts
            garments that celebrate the slow rhythm of the Mediterranean sun.
          </p>

          <p className="story-small">
            Our designs are a study in refined leisure — where lightweight
            linens, structural silhouettes, and an unhurried approach to
            tailoring meet.
          </p>
        </div>
      </section>
    </>
  );
}

export default Hero;
