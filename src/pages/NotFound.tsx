import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="max-w-lg w-full px-4">
          <div className="text-center">
            {/* 404 Icon */}
            <div className="mx-auto w-24 h-24 bg-columbia-blue/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">📚</span>
            </div>
            
            {/* Error Message */}
            <h1 className="text-6xl font-bold text-columbia-blue mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
            
            {/* Description */}
            <p className="text-gray-600 mb-8">
              Oops! Looks like this page is still in the library's restricted section.
              Let's get you back to where the knowledge flows freely.
            </p>

            {/* Navigation Buttons */}
            <div className="space-x-4">
              <Button
                onClick={() => navigate('/')}
                className="bg-columbia-blue hover:bg-columbia-blue-dark"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => navigate('/browse')}
                variant="outline"
              >
                Browse Materials
              </Button>
            </div>

            {/* Path Info - Only in Development */}
            {process.env.NODE_ENV === 'development' && (
              <p className="mt-8 text-sm text-gray-500">
                Attempted path: {location.pathname}
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            NotesHub @Columbia • Share Knowledge, Excel Together
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
