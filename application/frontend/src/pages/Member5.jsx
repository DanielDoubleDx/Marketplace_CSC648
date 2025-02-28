import { Link } from "react-router-dom";
import "../styles/member.css";

function Member5() {
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
                        <Link to="/member4">Daniel Lee</Link>
                    </div>
                </div>
            </div>

            {/* Member Name */}
            <div className="name">Caleb Onuonga</div>

            {/* Profile Section */}
            <div className="container">
                <div className="picture-container">
                    <h1>Portfolio</h1>
                    <img className="img" src="/images/caleb.jpeg" alt="Caleb Onuonga" />
                </div>

                <div className="about-container">
                    <h2>About Me</h2>
                    <div className="about-box">
                        <p>
                            Hi everyone my name is Caleb Onuonga. I am team 4's backend lead. In
                            my freetime I enjoy reading, playing video games, watching anime,
                            hiking, playing basketball and hanging with my friends.
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

export default Member5;
