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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedLyrics(null);

    try {
      const results = await searchLyrics(query);
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

  const handleSelectTrack = (track) => {
    setSelectedLyrics(track);
    setSearchResults([]);
  };

  const handleExampleSearch = (exampleQuery) => {
    setQuery(exampleQuery);
    handleSearch({ preventDefault: () => {} });

  };

  return (
    <div className="min-h-screen bg-background min-w-[340px] flex flex-col">
      <header className="border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-6 h-6" />
              <h1 className="text-2xl font-bold">LyricFindr</h1>
              <Badge variant="secondary" className="ml-2">
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
              placeholder="Enter song title & artist (e.g., 'Queen - Bohemian Rhapsody')"
              className="flex-1"
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
                <p className="text-red-800 dark:text-red-200 text-center">{error}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Select a track:</h3>
            <div className="space-y-2">
              {searchResults.map((track) => (
                <Card
                  key={track.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelectTrack(track)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{track.trackName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {track.artistName} • {track.albumName}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedLyrics && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {selectedLyrics.trackName}
                </CardTitle>
                <p className="text-center text-muted-foreground">
                  {selectedLyrics.artistName} • {selectedLyrics.albumName}
                </p>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {selectedLyrics.plainLyrics || "No lyrics available"}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedLyrics && searchResults.length === 0 && !loading && (
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Try searching for:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleSearch("Queen - Bohemian Rhapsody")}
              >
                Queen - Bohemian Rhapsody
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleSearch("Billy Joel - Piano Man")}
              >
                Billy Joel - Piano Man
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleSearch("Kendrick Lamar - Luther")}
              >
                Kendrick Lamar - Luther
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExampleSearch("Michael Jackson - Billie Jean")}
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