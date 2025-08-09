export type WeatherConfig = {
  updateInterval: number;
};

export const weatherConfig: WeatherConfig = {
  updateInterval: parseInt(process.env.NEXT_PUBLIC_WEATHER_UPDATE_INTERVAL_IN_MS || '60000'),
};
