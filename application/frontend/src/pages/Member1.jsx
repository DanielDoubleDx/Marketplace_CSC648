import { Link } from "react-router-dom";
import "../styles/member.css";

function Member1() {
  return (
    <div>
      {/* Header */}
      <div className="header">Team 04</div>

      {/* Navigation Menu */}
      <div className="menu">
        <div className="dropdown" style={{ float: "left" }}>
          <button className="dropbtn">Menu</button>
          <div className="dropdown-content">
            <Link to="/member2">Thanh Duong</Link>
            <Link to="/member3">Trinity Godwin</Link>
            <Link to="/member4">Daniel Lee</Link>
            <Link to="/member5">Caleb Onuonga</Link>
          </div>
        </div>
      </div>

      {/* Member Name */}
      <div className="name">Clark Batungbakal</div>

      {/* Profile Section */}
      <div className="container">
        <div className="picture-container">
          <h1>Portfolio</h1>
          <img className="img" src="/images/clark.jpeg" alt="Clark Batungbakal" />
        </div>

        <div className="about-container">
          <h2>About Me</h2>
          <div className="about-box">
            <p>
              I’m a Marine Corps veteran and a Computer Science student at San
              Francisco State University, set to graduate in December 2025. My
              interests lie in cloud application development. I have a deep
              appreciation for Korean history and culture, which I’ve explored
              through coursework and personal experiences. I also enjoy traveling,
              especially to South Korea, where I’ve gained a new perspective on
              food, language, and traditions. Feel free to connect with me—I’m
              always open to new opportunities and collaborations!
            </p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Link to="/about">
        <button className="back-button">Back</button>
      </Link>
    </div>
  );
}

export default Member1;
