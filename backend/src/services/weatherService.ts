import { fetch } from 'undici';
import { TTLCache } from './cache/ttlCache';

type Geocode = {
  latitude: number;
  longitude: number;
  timezone: string;
};

type SearchResponse = {
  results: Geocode[];
};

type CurrentWeather = {
  temperature_2m: number | null;
  wind_speed_10m: number | null;
  relative_humidity_2m: number | null;
  time: string;
};

export type WeatherResult =
  | {
      location: string;
      current: CurrentWeather;
    }
  | Geocode;

type ForecastResponse = { current: CurrentWeather; timezone: string };

const FIVE_MINUTES = 5 * 60 * 1000;
const cache = new TTLCache<WeatherResult>(FIVE_MINUTES);

async function geocode(name: string): Promise<Geocode | null> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', name);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'de');
  url.searchParams.set('format', 'json');

  try {
    const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;

    const searchResponse = (await res.json()) as unknown as SearchResponse;
    if (!searchResponse?.results?.length) return null;

    return searchResponse.results[0];
  } catch (error) {
    console.error('Error during fetching the geocode', error);
    return null;
  }
}

async function fetchWeather(lat: number, lon: number): Promise<ForecastResponse | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set('current', 'temperature_2m,wind_speed_10m,relative_humidity_2m');

    const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return res.json() as unknown as ForecastResponse;
  } catch (error) {
    console.error('Error during fetching the forecast', error);
    return null;
  }
}

export async function getWeatherByLocation(location: string): Promise<WeatherResult | null> {
  const key = location.trim().toLowerCase();
  const cached = cache.get(key);
  if (cached) {
    console.log(`Cache hit for ${location}`);
    return cached;
  }

  console.log(`No cache entry - retrieve weather for ${location}`);
  const geo = await geocode(location);
  if (!geo) return null;

  const weather = await fetchWeather(geo.latitude, geo.longitude);
  if (!weather?.current) return null;

  const result: WeatherResult = {
    location,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: weather.timezone || geo.timezone || 'UTC',
    current: {
      temperature_2m: weather.current.temperature_2m ?? null,
      wind_speed_10m: weather.current.wind_speed_10m ?? null,
      relative_humidity_2m: weather.current.relative_humidity_2m ?? null,
      time: weather.current.time,
    },
  };

  cache.set(key, result);
  return result;
}
