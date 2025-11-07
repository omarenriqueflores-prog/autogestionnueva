
import React, { useState, useEffect } from 'react';
import type { NewsItem } from '../types';
import { api } from '../services/api';
import Card from './shared/Card';
import Spinner from './shared/Spinner';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const data = await api.getNews();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Novedades</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-6">
          {news.length > 0 ? (
            news.map(item => (
              <Card key={item.id} className="p-6">
                <p className="text-sm text-gray-500 mb-1">{new Date(item.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-gray-600">{item.content}</p>
              </Card>
            ))
          ) : (
            <Card className="p-6">
              <p className="text-center text-gray-500">No hay novedades en este momento.</p>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default News;
