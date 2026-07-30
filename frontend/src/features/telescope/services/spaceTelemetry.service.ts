import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getOptimizedImageUrl } from '../../../utils/imageOptimizer';

const API_BASE = '/api/external';

export interface ApodItem {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
  copyright?: string;
}

export interface NearEarthObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    }
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date_full: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
    orbiting_body: string;
  }>;
}

export interface IssLocationData {
  timestamp: number;
  iss_position: {
    latitude: string;
    longitude: string;
  };
}

// 1. Fetch NASA Astronomy Picture of the Day (APOD)
export const useApodQuery = () => {
  return useQuery({
    queryKey: ['nasa_apod'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/apod`);
      const data: ApodItem = res.data;
      return {
        ...data,
        optimized_url: getOptimizedImageUrl(data.url),
      };
    },
    staleTime: 1000 * 60 * 60 * 6, // 6 hours
  });
};

// 2. Fetch NASA Near-Earth Asteroids (NeoWS)
export const useNearEarthObjectsQuery = () => {
  return useQuery({
    queryKey: ['nasa_neows'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/neows`);
      const nearEarthObjects = res.data?.near_earth_objects || {};
      const dateKey = Object.keys(nearEarthObjects)[0];
      const objectsList: NearEarthObject[] = nearEarthObjects[dateKey] || [];
      return objectsList;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

// 3. Poll Live ISS Position (Every 5 Seconds as specified in API docs)
export const useIssLocationQuery = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['iss_location'],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/iss`);
      return res.data as IssLocationData;
    },
    refetchInterval: enabled ? 5000 : false, // 5 seconds polling
    staleTime: 3000,
  });
};
