// filepath: /home/ragil/Desktop/zaza/play-haven-frontend/src/pages/news/News.jsx
import React from 'react';
import './News.css';

const mockNews = [
  {
    title: 'Play Haven Summer Sale Announced!',
    date: '2025-06-20',
    summary: 'Get ready for massive discounts on your favorite games. The Summer Sale starts June 25th!'
  },
  {
    title: 'New Feature: Game Library Sync',
    date: '2025-06-15',
    summary: 'You can now sync your Steam library with Play Haven and track your achievements.'
  },
  {
    title: 'Patch Notes v2.1 Released',
    date: '2025-06-10',
    summary: 'Bug fixes, performance improvements, and a new dark mode for the store.'
  }
];

function News() {
  return (
    <div className="news-page">
      <div className="container py-5">
        <h1 className="mb-4 text-center">Latest News</h1>
        <div className="news-list">
          {mockNews.map((item, idx) => (
            <div className="news-item mb-4 p-4 rounded shadow-sm" key={idx}>
              <h3 className="news-title">{item.title}</h3>
              <div className="news-date text-muted mb-2">{item.date}</div>
              <div className="news-summary">{item.summary}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
