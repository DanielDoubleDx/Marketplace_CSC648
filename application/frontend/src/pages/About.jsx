import { Link } from "react-router-dom";
import "../styles/about.css";

function About() {
  return (
    <div className="text-center min-h-screen bg-white">
      <h1 className="bg-blue-900 text-white p-5 text-3xl font-bold">
        Software Engineering Class SFSU
      </h1>
      <h2 className="bg-yellow-400 text-black p-3 text-2xl">&lt;Spring, 2025&gt;</h2>
      <h2 className="bg-yellow-400 text-black p-3 text-2xl">Section 01</h2>
      <h3 className="text-blue-700 text-4xl font-bold p-5">Team 04</h3>

      <div className="flex flex-col items-center space-y-4">
        {[
          { name: "Clark Batungbakal", path: "/member1" },
          { name: "Thanh Duong", path: "/member2" },
          { name: "Trinity Godwin", path: "/member3" },
          { name: "Daniel Lee", path: "/member4" },
          { name: "Caleb Onuonga", path: "/member5" },
        ].map((member, index) => (
          <div key={index} className="button-box">
            <Link to={member.path}>
              <button>{member.name}</button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10 text-gray-600 font-semibold">
        THIS IS A FAKE SITE! MADE FOR EDUCATIONAL PURPOSES SFSU CSC 648
      </div>
    </div>
  );
}

export default About;
