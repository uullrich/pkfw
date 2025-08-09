import useSWR from 'swr';
import { api } from '@utils/api';
import { weatherConfig } from '@utils/weatherConfig';

type Widget = {
  _id: string;
  location: string;
  createdAt: string;
};

type Weather = {
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    temperature_2m: number | null;
    wind_speed_10m: number | null;
    relative_humidity_2m: number | null;
    time: string;
  };
};

const fetcher = (url: string) => api.get(url).then((response) => response.data);

export default function WidgetCard({ widget, onDelete }: { widget: Widget; onDelete: () => void }) {
  const { data, isLoading, error, mutate } = useSWR<Weather>(
    `/weather?location=${encodeURIComponent(widget.location)}`,
    fetcher,
    {
      refreshInterval: weatherConfig.updateInterval,
    },
  );

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
        }}
      >
        <h3 style={{ margin: 0 }}>{widget.location}</h3>
        <button onClick={onDelete} aria-label="Delete widget" style={{ cursor: 'pointer' }}>
          🗑️
        </button>
      </header>

      {isLoading && <p>Lade Wetterdaten…</p>}
      {error && (
        <p style={{ color: 'red' }}>
          Fehler beim Laden. <button onClick={() => mutate()}>Nochmal</button>
        </p>
      )}
      {data && (
        <div>
          <p>
            Temperatur: <strong>{data.current.temperature_2m ?? '–'} °C</strong>
          </p>
          <p>Wind: {data.current.wind_speed_10m ?? '–'} km/h</p>
          <p>Feuchte: {data.current.relative_humidity_2m ?? '–'} %</p>
          <small>
            Koordinaten: {data.latitude.toFixed(2)}, {data.longitude.toFixed(2)} – {data.timezone}
          </small>
        </div>
      )}
    </section>
  );
}
