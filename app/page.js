import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background min-w-[340px]">
    
      <header className="border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6" />
            <h1 className="text-2xl font-bold">LyricFindr</h1>
            <Badge variant="secondary" className="ml-2">
              No ads • No login
            </Badge>
          </div>
        </div>
      </header>

     
      <main className="container mx-auto px-4 py-8 max-w-4xl">
      
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Get Song Lyrics Instantly</h2>
          <p className="text-muted-foreground mb-6">
            Just type a song title and get the full lyrics in seconds
          </p>

          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Enter song title (e.g., 'Bohemian Rhapsody' or 'Imagine')"
              className="flex-1"
            />
            <Button>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

     
        <div className="text-center mt-12">
          <h3 className="text-lg font-semibold mb-4">Try searching for:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm">
              Bohemian Rhapsody
            </Button>
            <Button variant="outline" size="sm">
              Imagine
            </Button>
            <Button variant="outline" size="sm">
              Hotel California
            </Button>
            <Button variant="outline" size="sm">
              Billie Jean
            </Button>
          </div>
        </div>
      </main>

     
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Fast, simple lyrics search • No registration required</p>
        </div>
      </footer>
    </div>
  );
}
