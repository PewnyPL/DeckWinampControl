import * as React from 'react';
import { WinampContextType } from './types';

export const WinampContext = React.createContext<WinampContextType | null>(null);

const WinampProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [songName, setSongName] = React.useState<string>('');
  const [artistName, setArtistName] = React.useState<string>('');
  const [albumName, setAlbumName] = React.useState<string>('');
  return (
    <WinampContext.Provider value={{ songName: songName, setSongName: setSongName, artistName:artistName, setArtistName:setArtistName, albumName:albumName, setAlbumName:setAlbumName }}>
      {children}
    </WinampContext.Provider>
  );
};

export default WinampProvider;