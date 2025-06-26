import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page p-4">
      <h1 className="text-center text-light fw-bolder mb-5">About Us</h1>
      <div className="container text-light">
        <p className="fs-5 mb-4">
          <strong>Play Haven</strong> is a modern platform for customers who want to buy and play online games. We make it easy to discover, purchase, and enjoy your favorite games all in one place.
        </p>
        <h3 className="fw-bold mb-3">Features</h3>
        <ul className="fs-5 mb-4">
          <li>Browse and purchase a wide selection of online games</li>
          <li>Instant access to your purchased games</li>
          <li>Personalized user profiles and secure account management</li>
          <li>Modern, responsive design for all devices</li>
        </ul>
        <h3 className="fw-bold mb-3">Our Mission</h3>
        <p className="fs-5 mb-4">
          We aim to provide a seamless and enjoyable experience for gamers everywhere, making it simple to find and play the games you love.
        </p>
        <h3 className="fw-bold mb-3">Contact Us</h3>
        <p className="fs-5">
          Have questions or feedback? Reach out at <a href="mailto:support@playhaven.com" className="text-info">support@playhaven.com</a>.
        </p>
      </div>
    </div>
  );
}

export default About;