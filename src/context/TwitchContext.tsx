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

const defaultStreamTitle = '🏆30k Premier | S2/S3/S4 Win Record Holder 🏆| !skinclub !tradeit !dm !sign !ego';

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
const POLLING_INTERVAL_MS = 30000; // Poll every 30s for fast live detection

export const TwitchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streamState, setStreamState] = useState<TwitchStreamState>(defaultState);

  const fetchTwitchData = useCallback(async () => {
    try {
      // 1. Primary: Direct official Twitch GQL API (real-time, zero cache lag, CORS-enabled)
      const gqlResponse = await fetch('https://gql.twitch.tv/gql', {
        method: 'POST',
        headers: {
          'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `query {
            user(login: "${CHANNEL}") {
              login
              displayName
              stream {
                id
                title
                type
                viewersCount
                game { name }
              }
              broadcastSettings {
                title
                game { name }
              }
            }
          }`,
        }),
      });

      if (gqlResponse.ok) {
        const gqlData = await gqlResponse.json();
        const user = gqlData?.data?.user;
        if (user) {
          const stream = user.stream;
          const isLive = stream?.type === 'live';
          const viewers = stream?.viewersCount || 0;
          const rawTitle = stream?.title || user.broadcastSettings?.title || defaultStreamTitle;
          const rawGame = stream?.game?.name || user.broadcastSettings?.game?.name || 'Counter-Strike 2';
          const cleanGame = rawGame.toLowerCase() === 'counter-strike' ? 'Counter-Strike 2' : rawGame;

          setStreamState({
            isLive,
            title: rawTitle,
            game: cleanGame,
            viewerCount: viewers,
            uptime: '',
            isLoading: false,
            error: null,
            lastUpdated: Date.now(),
            refresh: fetchTwitchData,
          });
          return;
        }
      }

      // 2. Fallback: DecAPI
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

      const isOfflineText = 
        uptimeText.toLowerCase().includes('offline') || 
        uptimeText.toLowerCase().includes('not found') ||
        uptimeText.toLowerCase().includes('error');
      
      const isLive = !isOfflineText && uptimeText.length > 0;

      let viewers = 0;
      if (isLive && viewersText && !viewersText.toLowerCase().includes('offline')) {
        const parsed = parseInt(viewersText.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed)) viewers = parsed;
      }

      const cleanTitle = titleText && !titleText.toLowerCase().includes('error') ? titleText : defaultStreamTitle;
      const cleanGame = gameText && !gameText.toLowerCase().includes('error') 
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
