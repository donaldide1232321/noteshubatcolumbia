import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, User, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import EditUploadDialog from '@/components/EditUploadDialog';
import Footer from '../components/Footer';

// How many items per "page"
const PAGE_SIZE = 12;

interface Upload {
  id: string;
  user_id: string;
  username: string;
  course: string;
  professor: string;
  file_type: string;
  label: string;
  file_name: string;
  file_url: string;
  upload_date: string;
  upvotes: number;
  downvotes: number;
  mime_type?: string;
}

interface Vote {
  upload_id: string;
  vote_type: 'up' | 'down';
}

const Browse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Set up real-time subscription and fetch user votes
  useEffect(() => {
    fetchUserVotes();

    // Set up real-time subscription
    const uploadsSubscription = supabase
      .channel('uploads-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'uploads' 
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          // Reset pagination and fetch first page
          setUploads([]);
          setPage(0);
          setHasMore(true);
        }
      )
      .subscribe();

    return () => {
      // Clean up subscription
      supabase.removeChannel(uploadsSubscription);
    };
  }, []);

  // Reset pagination when search term changes
  useEffect(() => {
    setUploads([]);
    setPage(0);
    setHasMore(true);
  }, [searchTerm]);

  // Fetch uploads when page or search term changes
  useEffect(() => {
    fetchUploads();
  }, [page, searchTerm]);

  const fetchUploads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Calculate range for pagination
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      // Build query
      let query = supabase
        .from('uploads')
        .select('*')
        .order('upload_date', { ascending: false });
      
      // Add search filters if needed
      if (searchTerm) {
        query = query.or(
          `course.ilike.%${searchTerm}%,professor.ilike.%${searchTerm}%,label.ilike.%${searchTerm}%`
        );
      }
      
      // Apply pagination
      const { data, error } = await query.range(from, to);

      if (error) {
        throw error;
      }

      // Filter out any null or undefined entries
      const validUploads = (data || []).filter(upload => 
        upload && upload.id && upload.file_url && upload.file_name
      );

      // Check if files exist in storage and collect IDs of missing files
      const [existingUploads, missingFileIds] = await validUploads.reduce(
        async (promiseAcc, upload) => {
          const [existing, missing] = await promiseAcc;
          const { data: storageData } = await supabase
            .storage
            .from('uploads')
            .list(upload.file_url.split('/')[0], {
              search: upload.file_url.split('/')[1]
            });
          
          if (storageData && storageData.length > 0) {
            return [[...existing, upload], missing];
          } else {
            return [existing, [...missing, upload.id]];
          }
        },
        Promise.resolve([[] as Upload[], [] as string[]])
      );

      // Clean up database records for missing files
      if (missingFileIds.length > 0) {
        console.log('Cleaning up missing files:', missingFileIds);
        await supabase
          .from('uploads')
          .delete()
          .in('id', missingFileIds);
      }

      // ⚡ **INSERT THIS LOG** ⚡
      console.log(
        `Fetched page ${page}: returned ${existingUploads.length} rows (PAGE_SIZE=${PAGE_SIZE})`
      );

      // Append new uploads to existing ones
      setUploads(prev => [...prev, ...existingUploads]);
      
      // Determine if there are more pages
      const newHasMore = existingUploads.length === PAGE_SIZE;
      setHasMore(newHasMore);
      
      // ⚡ **AND THIS LOG** ⚡
      console.log(
        `After page ${page}, uploads.length=${uploads.length + existingUploads.length}, hasMore=${newHasMore}`
      );
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setError('Failed to load study materials. Please try again later.');
      toast({ 
        title: "Error loading materials", 
        description: "Please refresh the page or try again later.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('upload_id, vote_type')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const votesMap: Record<string, 'up' | 'down'> = {};
      data?.forEach((vote: Vote) => {
        votesMap[vote.upload_id] = vote.vote_type;
      });
      setUserVotes(votesMap);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const handleVote = async (uploadId: string, voteType: 'up' | 'down') => {
    if (!user) return;

    try {
      const currentVote = userVotes[uploadId];
      const upload = uploads.find(u => u.id === uploadId);
      if (!upload) return;
      
      if (currentVote === voteType) {
        // Remove vote
        await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('upload_id', uploadId);
        
        // Update vote counts
        const field = voteType === 'up' ? 'upvotes' : 'downvotes';
        await supabase
          .from('uploads')
          .update({ [field]: upload[field] - 1 })
          .eq('id', uploadId);

        setUserVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[uploadId];
          return newVotes;
        });
        
        // Update local state
        setUploads(prev => 
          prev.map(u => 
            u.id === uploadId 
              ? { ...u, [field]: u[field] - 1 } 
              : u
          )
        );
      } else {
        // Add or update vote
        await supabase
          .from('votes')
          .upsert({
            user_id: user.id,
            upload_id: uploadId,
            vote_type: voteType
          });

        // Calculate new vote counts
        let newUpvotes = upload.upvotes;
        let newDownvotes = upload.downvotes;

        // Remove previous vote if exists
        if (currentVote === 'up') {
          newUpvotes--;
        } else if (currentVote === 'down') {
          newDownvotes--;
        }

        // Add new vote
        if (voteType === 'up') {
          newUpvotes++;
        } else {
          newDownvotes++;
        }

        await supabase
          .from('uploads')
          .update({ upvotes: newUpvotes, downvotes: newDownvotes })
          .eq('id', uploadId);

        setUserVotes(prev => ({ ...prev, [uploadId]: voteType }));
        
        // Update local state
        setUploads(prev => 
          prev.map(u => 
            u.id === uploadId 
              ? { ...u, upvotes: newUpvotes, downvotes: newDownvotes } 
              : u
          )
        );
      }
    } catch (error) {
      console.error('Error handling vote:', error);
      toast({ title: "Error updating vote", variant: "destructive" });
    }
  };

  const handleDownload = async (upload: Upload) => {
    try {
      console.log('Starting download for:', upload.file_url);
      
      // Get the public URL for the file
      const { data: publicUrl } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(upload.file_url);

      if (!publicUrl?.publicUrl) {
        throw new Error('Could not generate public URL');
      }

      console.log('Got public URL, starting download...');

      // Use fetch with specific headers
      const response = await fetch(publicUrl.publicUrl, {
        headers: {
          'Accept': upload.mime_type || 'application/octet-stream',
        },
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      console.log('Received content type:', contentType);

      // Get the blob with the correct type
      const blob = await response.blob();
      console.log('Downloaded blob size:', blob.size, 'type:', blob.type);

      // Create object URL
      const url = URL.createObjectURL(
        new Blob([blob], { type: upload.mime_type || 'application/octet-stream' })
      );

      // Create download link
      const element = document.createElement('a');
      element.href = url;
      element.download = upload.file_name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      // Clean up
      URL.revokeObjectURL(url);
      
      toast({ 
        title: "Download started", 
        description: `Downloading ${upload.file_name} (${Math.round(blob.size / 1024)}KB)` 
      });
    } catch (error) {
      console.error('Detailed download error:', error);
      toast({ 
        title: "Download failed", 
        description: error instanceof Error ? error.message : "There was an error downloading the file. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const getFileTypeColor = (fileType: string) => {
    const colors = {
      'Notes': 'bg-blue-100 text-blue-800',
      'Syllabus': 'bg-green-100 text-green-800',
      'Past Exams': 'bg-red-100 text-red-800',
      'Exam Solutions': 'bg-purple-100 text-purple-800',
      'Homework': 'bg-orange-100 text-orange-800',
      'Cheat Sheet': 'bg-yellow-100 text-yellow-800',
      'Study Guide': 'bg-pink-100 text-pink-800'
    };
    return colors[fileType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-columbia-blue rounded-lg flex items-center justify-center text-xl text-white">
                  ✏️
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">NotesHub @Columbia</h1>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => navigate('/upload')}>
                  Upload
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Home
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-red-500">⚠️</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{error}</h2>
            <Button onClick={fetchUploads}>Try Again</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-columbia-blue rounded-lg flex items-center justify-center text-xl text-white">
                ✏️
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">NotesHub @Columbia</h1>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/upload')}>
                Upload
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Study Materials</h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Input
                placeholder="Search by course (e.g., MATH 1102, ECON 1105), professor, or material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* If loading first page, show loading spinner */}
          {isLoading && page === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-columbia-blue rounded-full" />
              <p className="mt-4 text-gray-600">Loading study materials...</p>
            </div>
          ) : uploads.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No materials found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No materials match "${searchTerm}"`
                  : "Be the first to upload some study materials!"}
              </p>
              <Button 
                onClick={() => navigate('/upload')}
                className="bg-columbia-blue hover:bg-columbia-blue-dark"
              >
                Upload Materials
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {uploads.map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-2">{item.course}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Prof. {item.professor}</p>
                        </div>
                        <Badge className={getFileTypeColor(item.file_type)}>
                          {item.file_type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">📄 {item.file_name}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <User className="h-4 w-4" />
                            <span>{item.username}</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(item.upload_date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {/* Edit/Delete options for user's own uploads */}
                        {user && item.user_id === user.id && (
                          <div className="pt-2 border-t">
                            <EditUploadDialog 
                              upload={item} 
                              currentUserId={user.id} 
                              onUpdate={() => {
                                // Reset pagination and fetch first page
                                setUploads([]);
                                setPage(0);
                                setHasMore(true);
                              }} 
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleVote(item.id, 'up')}
                              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                userVotes[item.id] === 'up' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <span>👍</span>
                              <span className="text-sm">{item.upvotes}</span>
                            </button>
                            <button
                              onClick={() => handleVote(item.id, 'down')}
                              className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                                userVotes[item.id] === 'down' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <span>👎</span>
                              <span className="text-sm">{item.downvotes}</span>
                            </button>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownload(item)}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={() => setPage(prev => prev + 1)}
                    variant="outline"
                    className="px-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Load More'}
                  </Button>
                </div>
              )}
              
              {/* No more results message */}
              {!hasMore && uploads.length > 0 && (
                <p className="text-center mt-8 text-gray-500">
                  No more materials to load.
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
