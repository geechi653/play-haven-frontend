// filepath: /home/ragil/Desktop/zaza/play-haven-frontend/src/pages/news/News.jsx
import React, { useEffect, useState } from 'react';
import './News.css';
import { fetchGameNews } from '../../utils/api.js';

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example: fetch news for Team Fortress 2 (appid 440)
  useEffect(() => {
    setLoading(true);
    fetchGameNews(440, 5, 500)
      .then(data => {
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setError('Failed to load news.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load news.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="news-page">
      <div className="container py-5">
        <h1 className="mb-4 text-center">Latest News</h1>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <div className="news-list">
            {news.map((item, idx) => (
              <div className="news-item mb-4 p-4 rounded shadow-sm" key={idx}>
                <h3 className="news-title">{item.title}</h3>
                <div className="news-date text-muted mb-2">{item.date}</div>
                <div className="news-summary">{item.summary}</div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-link p-0">
                    Read more
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default News;
