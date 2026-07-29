import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface NasaImageItem {
  nasa_id: string;
  title: string;
  description: string;
  date_created: string;
  keywords: string[];
  thumbnail: string;
  high_res: string;
  center?: string;
}

export const useNasaImageSearch = (category: string, query: string) => {
  return useQuery({
    queryKey: ['nasa_images', category, query],
    queryFn: async () => {
      const searchTerm = query || category;
      const res = await axios.get(`https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`);
      
      return res.data.collection.items.slice(0, 30).map((item: any) => {
        const data = item.data[0];
        const links = item.links || [];
        // The original image requires another API call, but we can guess it's usually `~orig.jpg` or we just use `~large.jpg` which is generally present in the links, though sometimes it's not directly in `item.links`.
        // A safer way is to use the `collection.json` url, but for simplicity, replacing `~thumb` with `~orig` or `~large` works 99% of the time.
        const thumbnail = links[0]?.href || '';
        const high_res = thumbnail.replace('~thumb', '~orig');

        return {
          nasa_id: data.nasa_id,
          title: data.title,
          description: data.description,
          date_created: data.date_created,
          keywords: data.keywords || [],
          thumbnail,
          high_res,
          center: data.center,
        } as NasaImageItem;
      });
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
};
