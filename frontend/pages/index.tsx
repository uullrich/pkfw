import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@utils/api';
import WidgetCard from '@components/WidgetCard';
import { AxiosError, HttpStatusCode } from 'axios';

type Widget = {
  _id: string;
  location: string;
  createdAt: string;
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function Home() {
  const { data: widgets, mutate, isLoading } = useSWR<Widget[]>('/widgets', fetcher);
  const [location, setLocation] = useState('');

  async function addWidget(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) return;
    try {
      await api.post('/widgets', { location: location.trim() });
      setLocation('');
      mutate();
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === HttpStatusCode.Conflict) {
        alert('Widget already exists!');
        return;
      }

      alert('Unknown error');
    }
  }

  async function deleteWidget(id: string) {
    await api.delete(`/widgets/${id}`);
    mutate();
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: '2rem auto',
        padding: '0 1rem',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Wetter-Widgets Dashboard</h1>

      <form onSubmit={addWidget} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Stadt eingeben (z.B. Berlin)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ flex: 1, padding: '0.6rem', fontSize: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.6rem 1rem', fontSize: '1rem' }}>
          Widget hinzufügen
        </button>
      </form>

      {isLoading && <p>Lade Widgets...</p>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {widgets?.map((widget) => (
          <WidgetCard key={widget._id} widget={widget} onDelete={() => deleteWidget(widget._id)} />
        ))}
      </div>

      {!widgets?.length && !isLoading && <p>Noch keine Widgets vorhanden.</p>}
    </main>
  );
}
