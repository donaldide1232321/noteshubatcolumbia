import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '../components/Footer';

const Index = () => {
  const navigate = useNavigate();
  const { getUploadCount } = useAuth();
  const [uploadCount, setUploadCount] = useState(0);

  useEffect(() => {
    const fetchUploadCount = async () => {
      const count = await getUploadCount();
      setUploadCount(count);
    };
    fetchUploadCount();
  }, [getUploadCount]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-columbia-blue rounded-lg flex items-center justify-center text-xl text-white">
                ✏️
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">NotesHub @Columbia</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Join the Community</span>
            <span className="block text-columbia-blue">Share & Access Study Materials</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Columbia's 1st anonymous note-sharing platform. Share and discover academic materials anonymously.
          </p>
        </div>

        <div className="mt-10">
          <Card className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-columbia-blue bg-opacity-10 mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to explore?</h2>
              <p className="text-gray-600 mb-6">
                {uploadCount} study materials shared so far
              </p>
              <Button 
                onClick={() => navigate('/browse')}
                className="w-full bg-columbia-blue hover:bg-columbia-blue-dark"
              >
                Let's check it out!
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Why use NotesHub?
          </h2>
          <div className="mt-10 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900">Easy Sharing</p>
                  <p className="mt-3 text-base text-gray-500">
                    Upload and share your study materials with fellow students in just a few clicks.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900">Quick Access</p>
                  <p className="mt-3 text-base text-gray-500">
                    Find the materials you need instantly with our organized system.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900">Community Driven</p>
                  <p className="mt-3 text-base text-gray-500">
                    Join a community of students helping each other succeed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
