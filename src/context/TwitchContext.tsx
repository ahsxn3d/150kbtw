import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface TwitchStreamState {
  isLive: boolean;
  title: string;
  game: string;
  viewerCount: number;
  uptime: string;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
}

const defaultStreamTitle = '🏆30k Premier | S2/S3/S4 Win Record Holder 🏆 | !sens !res !config';

const defaultState: TwitchStreamState = {
  isLive: false,
  title: defaultStreamTitle,
  game: 'Counter-Strike 2',
  viewerCount: 0,
  uptime: '',
  isLoading: true,
  error: null,
  lastUpdated: null,
  refresh: async () => {},
};

const TwitchContext = createContext<TwitchStreamState>(defaultState);

const CHANNEL = '150k';
const POLLING_INTERVAL_MS = 60000; // Poll every 60 seconds

export const TwitchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streamState, setStreamState] = useState<TwitchStreamState>(defaultState);

  const fetchTwitchData = useCallback(async () => {
    try {
      // DecAPI provides fast, public, CORS-enabled Twitch Helix endpoints with zero API keys required
      const [uptimeRes, titleRes, gameRes, viewersRes] = await Promise.allSettled([
        fetch(`https://decapi.me/twitch/uptime/${CHANNEL}`, { cache: 'no-store' }).then((r) => r.text()),
        fetch(`https://decapi.me/twitch/title/${CHANNEL}`, { cache: 'no-store' }).then((r) => r.text()),
        fetch(`https://decapi.me/twitch/game/${CHANNEL}`, { cache: 'no-store' }).then((r) => r.text()),
        fetch(`https://decapi.me/twitch/viewercount/${CHANNEL}`, { cache: 'no-store' }).then((r) => r.text()),
      ]);

      const uptimeText = uptimeRes.status === 'fulfilled' ? uptimeRes.value.trim() : '';
      const titleText = titleRes.status === 'fulfilled' ? titleRes.value.trim() : '';
      const gameText = gameRes.status === 'fulfilled' ? gameRes.value.trim() : '';
      const viewersText = viewersRes.status === 'fulfilled' ? viewersRes.value.trim() : '';

      // Check if channel is live: decapi returns "channel is offline" or stream uptime if live
      const isOfflineText = 
        uptimeText.toLowerCase().includes('offline') || 
        uptimeText.toLowerCase().includes('not found') ||
        uptimeText.toLowerCase().includes('error');
      
      const isLive = !isOfflineText && uptimeText.length > 0;

      // Parse viewers
      let viewers = 0;
      if (isLive && viewersText && !viewersText.toLowerCase().includes('offline')) {
        const parsed = parseInt(viewersText.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed)) viewers = parsed;
      }

      // Title & game fallback
      const cleanTitle = titleText && !titleText.toLowerCase().includes('error') && !titleText.toLowerCase().includes('not found')
        ? titleText
        : defaultStreamTitle;

      const cleanGame = gameText && !gameText.toLowerCase().includes('error') && !gameText.toLowerCase().includes('not found')
        ? (gameText.toLowerCase() === 'counter-strike' ? 'Counter-Strike 2' : gameText)
        : 'Counter-Strike 2';

      setStreamState({
        isLive,
        title: cleanTitle,
        game: cleanGame,
        viewerCount: viewers,
        uptime: isLive ? uptimeText : '',
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
        refresh: fetchTwitchData,
      });
    } catch (err: any) {
      console.warn('Twitch status fetch failed:', err);
      setStreamState((prev) => ({
        ...prev,
        isLoading: false,
        error: err?.message || 'Failed to fetch Twitch status',
        refresh: fetchTwitchData,
      }));
    }
  }, []);

  useEffect(() => {
    fetchTwitchData();
    const interval = setInterval(fetchTwitchData, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchTwitchData]);

  return (
    <TwitchContext.Provider value={streamState}>
      {children}
    </TwitchContext.Provider>
  );
};

export const useTwitch = () => useContext(TwitchContext);
