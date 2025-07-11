"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Search,
  Loader2,
  Heart,
  Star,
  Download,
  Type,
  Settings,
  Maximize,
  Minimize,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { searchLyrics } from "@/lib/search";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLyrics, setSelectedLyrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [fontSettings, setFontSettings] = useState({
    size: "base",
    family: "default",
    lineHeight: "relaxed",
  });
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [backgroundAnimation, setBackgroundAnimation] = useState("waves");
  const [isLyricsMaximized, setIsLyricsMaximized] = useState(false);
  const [animationElements, setAnimationElements] = useState({
    stars: [],
    floating: [],
    waves: [],
  });

  // Initialize animation elements once
  useEffect(() => {
    const generateStars = () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
      }));

    const generateFloating = () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 4 + Math.random() * 3,
        amplitude: 15 + Math.random() * 20,
      }));

    setAnimationElements({
      stars: generateStars(),
      floating: generateFloating(),
      waves: [], // waves don't need random elements
    });
  }, []);

  // Load font settings from localStorage
  useEffect(() => {
    const savedFontSettings = localStorage.getItem("lyricfindr-font-settings");
    if (savedFontSettings) {
      setFontSettings(JSON.parse(savedFontSettings));
    }

    const savedAnimation = localStorage.getItem(
      "lyricfindr-background-animation"
    );
    if (savedAnimation) {
      setBackgroundAnimation(savedAnimation);
    }
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("lyricfindr-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lyricfindr-favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save font settings to localStorage
  useEffect(() => {
    localStorage.setItem(
      "lyricfindr-font-settings",
      JSON.stringify(fontSettings)
    );
  }, [fontSettings]);

  // Save background animation preference
  useEffect(() => {
    localStorage.setItem(
      "lyricfindr-background-animation",
      backgroundAnimation
    );
  }, [backgroundAnimation]);

  const toggleFavorite = (track) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.id === track.id);
      if (isAlreadyFavorite) {
        return prev.filter((fav) => fav.id !== track.id);
      } else {
        return [...prev, track];
      }
    });
  };

  const isFavorite = (trackId) => {
    return favorites.some((fav) => fav.id === trackId);
  };

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
    setShowFavorites(false);
  };

  const handleBackClick = () => {
    setSelectedLyrics(null);
    setError(null);
    setLoading(false);
  };

  const handleFavoritesClick = () => {
    setShowFavorites(true);
    setSearchResults([]);
    setSelectedLyrics(null);
    setError(null);
    setQuery("");
  };

  const downloadLyrics = (format) => {
    if (!selectedLyrics) return;

    const { trackName, artistName, plainLyrics, syncedLyrics } = selectedLyrics;
    const filename = `${artistName} - ${trackName}`;

    let content = "";
    let fileExtension = "";
    let mimeType = "";

    if (format === "lrc" && syncedLyrics) {
      content = syncedLyrics;
      fileExtension = "lrc";
      mimeType = "text/plain";
    } else {
      content = `${trackName}\nBy: ${artistName}\n\n${
        plainLyrics || "No lyrics available"
      }`;
      fileExtension = "txt";
      mimeType = "text/plain";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFontSizeClass = () => {
    const sizes = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    };
    return sizes[fontSettings.size] || "text-base";
  };

  const getFontFamilyClass = () => {
    const families = {
      default: "",
      serif: "font-serif",
      mono: "font-mono",
      sans: "font-sans",
    };
    return families[fontSettings.family] || "";
  };

  const getLineHeightClass = () => {
    const lineHeights = {
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    };
    return lineHeights[fontSettings.lineHeight] || "leading-relaxed";
  };

  return (
    <div
      className={`min-h-screen bg-background min-w-[340px] flex flex-col relative overflow-hidden ${backgroundAnimation}`}
    >
      {/* Background Animations */}
      {backgroundAnimation === "stars" && (
        <div className="fixed inset-0 pointer-events-none">
          {animationElements.stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-orange-400 dark:bg-orange-300 rounded-full opacity-60 animate-pulse"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {backgroundAnimation === "floating" && (
        <div className="fixed inset-0 pointer-events-none">
          {animationElements.floating.map((element) => (
            <div
              key={element.id}
              className="absolute w-3 h-3 bg-gradient-to-r from-orange-300 to-amber-300 dark:from-orange-600 dark:to-amber-600 rounded-full opacity-40"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
                animation: `float ${element.duration}s ease-in-out infinite`,
                animationDelay: `${element.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {backgroundAnimation === "waves" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute bottom-0 left-1/2 w-[200%] h-32 bg-gradient-to-t from-orange-200/40 to-transparent dark:from-orange-800/40"
            style={{
              borderRadius: "100% 100% 0 0",
              animation: "wave1 4s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-[220%] h-28 bg-gradient-to-t from-amber-200/30 to-transparent dark:from-amber-800/30"
            style={{
              borderRadius: "100% 100% 0 0",
              animation: "wave2 3s ease-in-out infinite reverse",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-[180%] h-36 bg-gradient-to-t from-orange-300/20 to-transparent dark:from-orange-700/20"
            style={{
              borderRadius: "100% 100% 0 0",
              animation: "wave1 5s ease-in-out infinite 1s",
            }}
          />
        </div>
      )}
      <header className="border relative z-10">
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
                  Lyric
                  <span className="font-extrabold text-orange-600 dark:text-orange-400">
                    Findr
                  </span>
                </h1>
              </div>

              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-0 shadow-sm dark:from-orange-400 dark:to-orange-500 dark:text-orange-200"
              >
                No ads • No login
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFontSettings(!showFontSettings)}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
              >
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoritesClick}
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/20"
              >
                <Star className="w-4 h-4 mr-1" />
                Favorites ({favorites.length})
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl flex-1 relative z-10">
        {/* Font Settings Panel - Overlay Modal */}
        {showFontSettings && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowFontSettings(false);
              }
            }}
          >
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <Card className="border-orange-200/50 shadow-2xl dark:border-orange-800/50 bg-background">
                <CardHeader className="relative">
                  <CardTitle className="text-center text-orange-600 dark:text-orange-400">
                    <Type className="w-5 h-5 inline mr-2" />
                    Customization Settings
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowFontSettings(false)}
                  >
                    ✕
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Font Size
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {["xs", "sm", "base", "lg", "xl", "2xl"].map((size) => (
                        <Button
                          key={size}
                          variant={
                            fontSettings.size === size ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFontSettings({ ...fontSettings, size })
                          }
                          className={
                            fontSettings.size === size
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "border-orange-200 hover:border-orange-300"
                          }
                        >
                          {size.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Font Family
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { key: "default", label: "Default" },
                        { key: "serif", label: "Serif" },
                        { key: "sans", label: "Sans" },
                        { key: "mono", label: "Mono" },
                      ].map((font) => (
                        <Button
                          key={font.key}
                          variant={
                            fontSettings.family === font.key
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFontSettings({
                              ...fontSettings,
                              family: font.key,
                            })
                          }
                          className={
                            fontSettings.family === font.key
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "border-orange-200 hover:border-orange-300"
                          }
                        >
                          {font.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Line Height */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Line Height
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { key: "tight", label: "Tight" },
                        { key: "normal", label: "Normal" },
                        { key: "relaxed", label: "Relaxed" },
                        { key: "loose", label: "Loose" },
                      ].map((height) => (
                        <Button
                          key={height.key}
                          variant={
                            fontSettings.lineHeight === height.key
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFontSettings({
                              ...fontSettings,
                              lineHeight: height.key,
                            })
                          }
                          className={
                            fontSettings.lineHeight === height.key
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "border-orange-200 hover:border-orange-300"
                          }
                        >
                          {height.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Background Animation */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Background Animation
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { key: "none", label: "None" },
                        { key: "stars", label: "Stars" },
                        { key: "floating", label: "Floating" },
                        { key: "waves", label: "Waves" },
                      ].map((anim) => (
                        <Button
                          key={anim.key}
                          variant={
                            backgroundAnimation === anim.key
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setBackgroundAnimation(anim.key)}
                          className={
                            backgroundAnimation === anim.key
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "border-orange-200 hover:border-orange-300"
                          }
                        >
                          {anim.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Maximized Lyrics Modal */}
        {isLyricsMaximized && selectedLyrics && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsLyricsMaximized(false);
              }
            }}
          >
            <div className="w-full max-w-4xl h-full max-h-[95vh] flex flex-col">
              <Card className="border-orange-200/50 shadow-2xl dark:border-orange-800/50 bg-background h-full flex flex-col">
                <CardHeader className="flex-shrink-0 border-b border-orange-200/50 dark:border-orange-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <CardTitle className="text-2xl font-bold mb-2 text-orange-600 dark:text-orange-400">
                        {selectedLyrics.trackName}
                      </CardTitle>
                      <p className="text-muted-foreground flex items-center justify-center gap-2">
                        <span className="font-medium text-lg">
                          {selectedLyrics.artistName}
                        </span>
                        <span>•</span>
                        <span className="text-lg">
                          {selectedLyrics.albumName}
                        </span>
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground flex-shrink-0"
                      onClick={() => setIsLyricsMaximized(false)}
                      title="Exit fullscreen"
                    >
                      <Minimize className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-6">
                  <div className="h-full bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-8 border border-orange-200/30 dark:border-orange-800/30 overflow-y-auto custom-scrollbar">
                    <div
                      className={`whitespace-pre-line text-lg ${getFontFamilyClass()} leading-relaxed text-foreground text-center max-w-3xl mx-auto`}
                    >
                      {selectedLyrics.plainLyrics || (
                        <div className="text-center text-muted-foreground italic text-xl">
                          No lyrics available for this track
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

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

        {searchResults.length > 0 && !selectedLyrics && !showFavorites && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="space-y-2">
              {searchResults.map((track) => (
                <Card
                  key={track.id}
                  className="cursor-pointer hover:bg-muted/50 hover:border-orange-200 transition-all duration-200 border-2 shadow-sm hover:shadow-md dark:hover:border-orange-700"
                  onClick={() => handleSelectTrack(track)}
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
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(track);
                          }}
                          className="h-8 w-8"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFavorite(track.id)
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground hover:text-red-500"
                            }`}
                          />
                        </Button>
                        <Badge
                          variant="outline"
                          className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-sm dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300 dark:border-orange-700 font-mono text-xs"
                        >
                          {Math.floor(track.duration / 60)}:
                          {Math.floor(track.duration % 60)
                            .toString()
                            .padStart(2, "0")}
                        </Badge>
                      </div>
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
              <CardHeader className="bg-gradient-to-r  border-orange-200/50 dark:border-orange-800/50">
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
                      <span className="font-medium">
                        {selectedLyrics.artistName}
                      </span>
                      <span>•</span>
                      <span>{selectedLyrics.albumName}</span>
                    </p>
                  </div>
                  <div className="w-24"></div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-6 border border-orange-200/30 dark:border-orange-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Lyrics
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLyricsMaximized(true)}
                      className="text-muted-foreground hover:text-foreground p-1 h-auto"
                      title="Maximize lyrics view"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <div
                      className={`whitespace-pre-line ${getFontSizeClass()} ${getFontFamilyClass()} ${getLineHeightClass()} text-foreground`}
                    >
                      {selectedLyrics.plainLyrics || (
                        <div className="text-center text-muted-foreground italic">
                          No lyrics available for this track
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 justify-center flex-wrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(selectedLyrics);
                    }}
                    className={`${
                      isFavorite(selectedLyrics.id)
                        ? "text-red-500 hover:text-red-600"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 mr-1 ${
                        isFavorite(selectedLyrics.id) ? "fill-current" : ""
                      }`}
                    />
                    {isFavorite(selectedLyrics.id)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadLyrics("txt")}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Text
                    </Button>

                    {selectedLyrics.syncedLyrics && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadLyrics("lrc")}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-900/30"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download LRC
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const query = `${selectedLyrics.artistName} ${selectedLyrics.trackName}`;
                      window.open(
                        `https://open.spotify.com/search/${encodeURIComponent(
                          query
                        )}`,
                        "_blank"
                      );
                    }}
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/30"
                  >
                    🎵 Listen on Spotify
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const query = `${selectedLyrics.artistName} ${selectedLyrics.trackName}`;
                      window.open(
                        `https://www.youtube.com/results?search_query=${encodeURIComponent(
                          query
                        )}`,
                        "_blank"
                      );
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30"
                  >
                    📺 Watch on YouTube
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-orange-200/50 dark:border-orange-800/50">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-sm dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300 dark:border-orange-700 font-mono"
                      >
                        {Math.floor(selectedLyrics.duration / 60)}:
                        {Math.floor(selectedLyrics.duration % 60)
                          .toString()
                          .padStart(2, "0")}
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

        {showFavorites && !selectedLyrics && (
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center text-muted-foreground">
              Your Favorites ({favorites.length})
            </h3>
            {favorites.length === 0 ? (
              <Card className="border-orange-200/50 dark:border-orange-800/50">
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No favorites yet!</p>
                    <p className="text-sm mt-2">
                      Search for songs and add them to your favorites.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {favorites.map((track) => (
                  <Card
                    key={track.id}
                    className="cursor-pointer hover:bg-muted/50 hover:border-orange-200 transition-all duration-200 border-2 shadow-sm hover:shadow-md dark:hover:border-orange-700"
                    onClick={() => handleSelectTrack(track)}
                  >
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0 pr-4">
                          <h4 className="font-semibold text-foreground truncate">
                            {track.trackName}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {track.artistName} • {track.albumName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(track);
                            }}
                            className="h-8 w-8"
                          >
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-sm dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300 dark:border-orange-700 font-mono text-xs"
                          >
                            {Math.floor(track.duration / 60)}:
                            {Math.floor(track.duration % 60)
                              .toString()
                              .padStart(2, "0")}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-10px) rotate(1deg);
            }
            66% {
              transform: translateY(5px) rotate(-1deg);
            }
          }

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

        {!selectedLyrics &&
          searchResults.length === 0 &&
          !loading &&
          !showFavorites && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Try searching for:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExampleSearch("Queen - Bohemian Rhapsody")
                  }
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

      <footer className="border-t relative z-10">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Fast, simple lyrics search • No registration required</p>
        </div>
      </footer>
    </div>
  );
}
