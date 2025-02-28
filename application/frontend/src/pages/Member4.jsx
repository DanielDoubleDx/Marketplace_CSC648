import { Link } from "react-router-dom";
import "../styles/member.css";

function Member4() {
    return (
        <div>
            {/* Header */}
            <div className="header">Team 04</div>

            {/* Navigation Menu */}
            <div className="menu">
                <div className="dropdown" style={{ float: "left" }}>
                    <button className="dropbtn">Menu</button>
                    <div className="dropdown-content">
                        <Link to="/member1">Clark Batungbakal</Link>
                        <Link to="/member2">Thanh Duong</Link>
                        <Link to="/member3">Trinity Godwin</Link>
                        <Link to="/member5">Caleb Onuonga</Link>
                    </div>
                </div>
            </div>

            {/* Member Name */}
            <div className="name">Daniel Lee</div>

            {/* Profile Section */}
            <div className="container">
                <div className="picture-container">
                    <h1>Portfolio</h1>
                    <img className="img" src="/images/daniel.png" alt="Daniel Lee" />
                </div>

                <div className="about-container">
                    <h2>About Me</h2>
                    <div className="about-box">
                        <p>
                            Ello, I'm a double major in computer science and physiology. I like
                            to try new things and the way I live is to go where the wind takes
                            me. Currently I'm looking into pharmacy school or veterinary school
                            but who knows, just keeping my doors open.
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

export default Member4;
