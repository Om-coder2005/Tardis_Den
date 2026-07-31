import { Request, Response } from 'express';

export const ExternalController = {
  // 1. NASA Astronomy Picture of the Day (APOD)
  async getApod(req: Request, res: Response) {
    try {
      const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
      const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching APOD:', error);
      res.status(500).json({ error: 'Failed to fetch APOD' });
    }
  },

  // 2. NASA Near-Earth Objects (NEOWS / Asteroids)
  async getNearEarthObjects(req: Request, res: Response) {
    try {
      const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching NeoWS:', error);
      res.status(500).json({ error: 'Failed to fetch Near Earth Objects' });
    }
  },

  // 3. Live ISS Location Tracker
  async getIssLocation(req: Request, res: Response) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('http://api.open-notify.org/iss-now.json', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error: any) {
      console.warn('Error fetching ISS position, using simulated orbit data:', error);
      res.json({
        message: 'success (simulated)',
        timestamp: Math.floor(Date.now() / 1000),
        iss_position: {
          latitude: (Math.sin(Date.now() / 10000) * 51.6).toFixed(4),
          longitude: (((Date.now() / 5000) % 360) - 180).toFixed(4)
        }
      });
    }
  },

  // 4. Astronauts Currently in Space
  async getAstros(req: Request, res: Response) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('http://api.open-notify.org/astros.json', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.warn('Error fetching Astros, using fallback data:', error);
      }
      res.json({
        number: 10,
        message: "success (fallback)",
        people: [
          { name: "Oleg Kononenko", craft: "ISS" },
          { name: "Nikolai Chub", craft: "ISS" },
          { name: "Tracy Caldwell Dyson", craft: "ISS" },
          { name: "Matthew Dominick", craft: "ISS" },
          { name: "Michael Barratt", craft: "ISS" },
          { name: "Jeanette Epps", craft: "ISS" },
          { name: "Alexander Grebenkin", craft: "ISS" },
          { name: "Butch Wilmore", craft: "ISS" },
          { name: "Suni Williams", craft: "ISS" },
          { name: "Li Guangsu", craft: "Tiangong" }
        ]
      });
    }
  },

  // 5. Google Books API (Search & Volumes)
  async searchGoogleBooks(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || 'astronomy';
      const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=24${keyParam}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching Google Books:', error);
      res.status(500).json({ error: 'Failed to fetch Google Books' });
    }
  },

  // 6. Gutendex Free eBooks API (Public Domain Classics)
  async getGutendexBooks(req: Request, res: Response) {
    try {
      const topic = (req.query.topic as string) || (req.query.q as string) || 'science';
      const response = await fetch(`https://gutendex.com/books/?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching Gutendex books:', error);
      res.status(500).json({ error: 'Failed to fetch Gutendex books' });
    }
  },

  // 7. Gutendex Full Text Content Proxy
  async getGutendexTextContent(req: Request, res: Response) {
    try {
      const bookId = req.params.id;
      const textUrl = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;
      
      const response = await fetch(textUrl);
      if (!response.ok) {
        // Fallback to secondary gutenberg text format url
        const altResponse = await fetch(`https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`);
        if (!altResponse.ok) {
          return res.status(404).json({ error: 'Text content unavailable for this edition' });
        }
        const altText = await altResponse.text();
        return res.json({ text: altText.slice(0, 50000) }); // Deliver first 50k chars for fast reading
      }

      const text = await response.text();
      res.json({ text: text.slice(0, 50000) });
    } catch (error) {
      console.error('Error fetching Gutenberg full text:', error);
      res.status(500).json({ error: 'Failed to load eBook text' });
    }
  },

  // 8. Free Music Streaming API Proxy (Jamendo Royalty-Free API)
  async searchMusic(req: Request, res: Response) {
    try {
      const tag = (req.query.q as string) || (req.query.tag as string) || 'chillout';
      // Jamendo Client ID (Public Free API Client ID)
      const clientId = process.env.JAMENDO_CLIENT_ID || '568f1c44';
      
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=20&tags=${encodeURIComponent(tag)}&audioformat=mp32`
      );
      const data = await response.json();
      
      if (!response.ok || !data?.results) {
        return res.status(500).json({ error: 'Failed to stream music catalog' });
      }

      const tracks = data.results.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artist_name,
        audio: track.audio,
        image: track.image,
        duration: track.duration,
      }));

      res.json(tracks);
    } catch (error) {
      console.error('Error fetching free music catalog:', error);
      res.status(500).json({ error: 'Music API unavailable' });
    }
  },

  // 9. Daily Mindfulness Quotes API Proxy (ZenQuotes)
  async getDailyQuote(req: Request, res: Response) {
    try {
      const response = await fetch('https://zenquotes.io/api/today');
      const data = await response.json();
      
      if (Array.isArray(data) && data[0]) {
        return res.json({
          quote: data[0].q,
          author: data[0].a,
        });
      }
      
      res.json({
        quote: "Look up at the stars and not down at your feet. Try to make sense of what you see.",
        author: "Stephen Hawking"
      });
    } catch (error) {
      res.json({
        quote: "Look up at the stars and not down at your feet. Try to make sense of what you see.",
        author: "Stephen Hawking"
      });
    }
  }
};
