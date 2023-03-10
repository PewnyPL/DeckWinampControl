declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

export type WinampContextType = {
  songName: string;
  artistName: string;
  albumName: string;
  setSongName: (songName :string) => void;
  setArtistName: (artistName :string) => void;
  setAlbumName: (albumName :string) => void;
};