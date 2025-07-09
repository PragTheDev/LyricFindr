"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Search, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { searchLyrics } from "@/lib/search";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLyrics, setSelectedLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedLyrics(null);

    try {
      const results = await searchLyrics(searchQuery);
      if (results.length === 0) {
        setError("No lyrics found. Try different keywords.");
      } else {
        setSearchResults(results);
      }
    } catch (err) {
      setError("Failed to search for lyrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSelectTrack = (track) => {
    setSelectedLyrics(track);
   
  };

  const handleExampleSearch = (exampleQuery) => {
    setQuery(exampleQuery);
    performSearch(exampleQuery);
  };

  const handleLogoClick = () => {
  setQuery("");
  setSearchResults([]);
  setSelectedLyrics(null);
  setError(null);
  setLoading(false);
};

  const handleBackClick = () => {
  setSelectedLyrics(null);
  setError(null);
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-background min-w-[340px] flex flex-col">
      <header className="border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
  <div 
    className="flex items-center gap-4 cursor-pointer" 
    onClick={handleLogoClick}
  >
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-800 rounded-lg blur-md opacity-50"></div>
      <div className="relative p-2 bg-gradient-to-r from-orange-400 to-amber-500 rounded-lg shadow-sm">
        <Music className="w-5 h-5 text-white" />
      </div>
    </div>
    <h1 className="text-2xl font-bold text-foreground tracking-tight">
      Lyric<span className="font-extrabold text-orange-600 dark:text-orange-400">Findr</span>
    </h1>
  </div>
  
  <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-0 shadow-sm dark:from-orange-400 dark:to-orange-500 dark:text-orange-200">
    No ads • No login
  </Badge>
</div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl flex-1">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Get Song Lyrics Instantly</h2>
          <p className="text-muted-foreground mb-6">
            Just type a song title and get the full lyrics in seconds
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Enter 'artist - title' (e.g., 'Queen - Bohemian Rhapsody')"
              className="flex-1 border-amber-600 border-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
              <CardContent className="pt-6">
                <p className="text-red-800 dark:text-red-200 text-center">
                  {error}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

     {searchResults.length > 0 && !selectedLyrics && (
  <div className="max-w-2xl mx-auto mb-8">
   
    <div className="space-y-2">
      {searchResults.map((track) => (
        <Card
          key={track.id}
          className="cursor-pointer hover:bg-muted/50 hover:border-orange-200 transition-all duration-200 border-2 shadow-sm hover:shadow-md dark:hover:border-orange-700"
          onClick={() => handleSelectTrack(track)}x
        >
          <CardContent>
            
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-semibold text-foreground truncate">
                  {track.trackName}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 ">
                  {track.artistName} • {track.albumName}
                </p>
              </div>
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-sm dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300 dark:border-orange-700 font-mono text-xs"
              >
                {Math.floor(track.duration / 60)}:
                {Math.floor(track.duration % 60).toString().padStart(2, "0")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}


    
{selectedLyrics && (
  <div className="max-w-3xl mx-auto mb-8">
    <Card className="border-orange-200/50 shadow-lg dark:border-orange-800/50">
      <CardHeader className=" from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-b border-orange-200/50 dark:border-orange-800/50">
        <div className="flex items-center justify-between">
              <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="w-24 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
          >
            ← Back
          </Button>

          <div className="flex-1 text-center">
            <CardTitle className="text-xl font-bold mb-2 text-orange-400">
              {selectedLyrics.trackName}
            </CardTitle>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <span className="font-medium">{selectedLyrics.artistName}</span>
              <span>•</span>
              <span>{selectedLyrics.albumName}</span>
            </p>
          </div>
                 <div className="w-24"></div> {/* Spacer to balance the button */}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-6 border border-orange-200/30 dark:border-orange-800/30">
          <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            <div className="whitespace-pre-line text-base leading-relaxed text-foreground">
              {selectedLyrics.plainLyrics || (
                <div className="text-center text-muted-foreground italic">
                  No lyrics available for this track
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Song info footer */}
        <div className="mt-4 pt-4 border-t border-orange-200/50 dark:border-orange-800/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-sm dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300 dark:border-orange-700 font-mono"
              >
                {Math.floor(selectedLyrics.duration / 60)}:
                {Math.floor(selectedLyrics.duration % 60).toString().padStart(2, "0")}
              </Badge>
              <span>Duration</span>
            </div>
            <div className="text-right">
              <p className="text-xs">Lyrics by LyricFindr</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)}

<style jsx>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgb(251 146 60 / 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgb(251 146 60 / 0.5);
  }
`}</style>

        {!selectedLyrics && searchResults.length === 0 && !loading && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Try searching for:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
         <Button
  variant="outline"
  size="sm"
  onClick={() => handleExampleSearch("Queen - Bohemian Rhapsody")}
  className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors dark:border-orange-300 dark:hover:border-orange-700 dark:hover:bg-orange-900/20"
>
  Queen - Bohemian Rhapsody
</Button>
<Button
  variant="outline"
  size="sm"
  onClick={() => handleExampleSearch("Billy Joel - Piano Man")}
  className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors dark:border-orange-300 dark:hover:border-orange-700 dark:hover:bg-orange-900/20"
>
  Billy Joel - Piano Man
</Button>
<Button
  variant="outline"
  size="sm"
  onClick={() => handleExampleSearch("Kendrick Lamar - Luther")}
  className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors dark:border-orange-300 dark:hover:border-orange-700 dark:hover:bg-orange-900/20"
>
  Kendrick Lamar - Luther
</Button>
<Button
  variant="outline"
  size="sm"
  onClick={() =>
    handleExampleSearch("Michael Jackson - Billie Jean")
  }
  className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors dark:border-orange-300 dark:hover:border-orange-700 dark:hover:bg-orange-900/20"
>
  Michael Jackson - Billie Jean
</Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Fast, simple lyrics search • No registration required</p>
        </div>
      </footer>
    </div>
  );
}