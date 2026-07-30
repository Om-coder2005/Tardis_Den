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
      // Fallback fallback simulated ISS position if open-notify is unreachable
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
  }
};
