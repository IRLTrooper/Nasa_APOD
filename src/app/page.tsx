'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, parse } from 'date-fns';
import { nb } from 'date-fns/locale';
import Navbar from './Navbar';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [input, setInput] = useState('');
  const [apod, setApod] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Fetch today's APOD on mount
  useEffect(() => {
    const fetchToday = async () => {
      setLoading(true);
      setError('');
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const res = await fetch(`/api/apod?date=${today}`);
        if (!res.ok) throw new Error('Kunne ikke hente dagens bilde.');
        const data = await res.json();
        setApod(data);
        setInput(format(new Date(), 'dd.MM.yyyy'));
        setSelectedDate(new Date());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchToday();
  }, []);

  const formatInput = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8); // kun tall, maks 8
    let result = '';

    if (digitsOnly.length <= 2) {
      result = digitsOnly;
    } else if (digitsOnly.length <= 4) {
      result = `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2)}`;
    } else {
      result = `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 4)}.${digitsOnly.slice(4)}`;
    }

    return result;
  };

  const parseInputDate = (input: string) => {
    try {
      const parsed = parse(input, 'dd.MM.yyyy', new Date());
      if (isNaN(parsed.getTime())) throw new Error();
      return parsed;
    } catch {
      return null;
    }
  };

  const handleFetch = async () => {
    const parsedDate = parseInputDate(input);
    if (!parsedDate) {
      setError('Ugyldig dato. Bruk formatet dd.mm.yyyy.');
      return;
    }

    const formatted = format(parsedDate, 'yyyy-MM-dd');
    setLoading(true);
    setError('');
    setApod(null);

    try {
      const res = await fetch(`/api/apod?date=${formatted}`);
      if (!res.ok) throw new Error('Fant ikke data for valgt dato.');
      const data = await res.json();
      setApod(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInput(e.target.value);
    setInput(formatted);
  };

  const handleCalendarSelect = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setInput(format(date, 'dd.MM.yyyy'));
    setCalendarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Navbar />
      <main className="p-6 max-w-2xl mx-auto bg-gray-900/90 rounded-xl shadow-lg mt-10 backdrop-blur-md border border-gray-700">
        <h1 className="text-3xl font-extrabold mb-6 text-white drop-shadow">NASA APOD Explorer</h1>

        <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="dd.mm.yyyy"
            value={input}
            onChange={handleInputChange}
            maxLength={10}
            className="border border-gray-700 p-2 rounded w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-white placeholder-gray-400"
          />
          <button
            onClick={() => setCalendarOpen(!calendarOpen)}
            className="bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded text-lg text-white border border-gray-700"
            title="Velg dato fra kalender"
          >
            📅
          </button>
          <button
            onClick={handleFetch}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-semibold shadow"
          >
            Hent bilde
          </button>
        </div>

        {calendarOpen && (
          <div className="mb-4 flex justify-center">
            <DatePicker
              selected={selectedDate}
              onChange={handleCalendarSelect}
              inline
              locale={nb}
              maxDate={new Date()}
              calendarClassName="!bg-gray-900 !text-white"
              dayClassName={date =>
                "text-white" +
                (date.getDay() === 0 ? " text-red-400" : "")
              }
            />
          </div>
        )}

        {loading && <p className="text-blue-300 font-medium">Laster...</p>}
        {error && <p className="text-red-400 font-semibold">{error}</p>}
        {apod && (
          <div className="mt-8 bg-gray-800/80 rounded-lg p-6 shadow-inner border border-gray-700">
            <h2 className="text-xl font-bold text-white">{apod.title}</h2>
            {apod.media_type === 'image' && (
              <img
                src={apod.url}
                alt={apod.title}
                className="mt-4 max-w-full rounded shadow border border-gray-700"
              />
            )}
            {apod.media_type === 'video' && (
              <div className="mt-4 aspect-video w-full rounded overflow-hidden border border-gray-700">
                <iframe
                  src={apod.url}
                  title={apod.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <p className="mt-4 text-gray-200 leading-relaxed">{apod.explanation}</p>
          </div>
        )}
      </main>
    </div>
  );
}
