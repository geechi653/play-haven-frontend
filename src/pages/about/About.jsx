
import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="container py-5">
        <h1 className="mb-4 text-center">About Us</h1>
        <div className="about-content p-4 rounded shadow-sm">
          <p>
            <strong>Play Haven</strong> is your ultimate destination for discovering, buying, and playing the best PC games. Our mission is to bring gamers together and make gaming accessible, fun, and social for everyone.
          </p>
          <ul>
            <li>🌟 Curated game store with the latest releases and timeless classics</li>
            <li>🛒 Seamless cart and checkout experience</li>
            <li>🎮 Sync your Steam library and track your achievements</li>
            <li>📰 Stay up to date with the latest gaming news and updates</li>
            <li>💜 Built by gamers, for gamers</li>
          </ul>
          <p className="mt-3">
            <em>Thank you for being part of the Play Haven community!!</em>
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
