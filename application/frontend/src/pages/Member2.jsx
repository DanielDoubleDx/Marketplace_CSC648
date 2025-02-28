import { Link } from "react-router-dom";
import "../styles/member.css";

function Member2() {
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
                        <Link to="/member3">Trinity Godwin</Link>
                        <Link to="/member4">Daniel Lee</Link>
                        <Link to="/member5">Caleb Onuonga</Link>
                    </div>
                </div>
            </div>

            {/* Member Name */}
            <div className="name">Thanh Duong</div>

            {/* Profile Section */}
            <div className="container">
                <div className="picture-container">
                    <h1>Portfolio</h1>
                    <img className="img" src="/images/thanh.jpg" alt="Clark Batungbakal" />
                </div>

                <div className="about-container">
                    <h2>About Me</h2>
                    <div className="about-box">
                        <p>
                            I am Thanh Cong Duong. I am Front-end Lead.
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

export default Member2;
