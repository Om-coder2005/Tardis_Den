import { Request, Response } from 'express';

export const ExternalController = {
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

  async getAstros(req: Request, res: Response) {
    try {
      // Set a 5-second timeout for the fetch request
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
      // Fallback data in case the external API is down or times out
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
