import {
  definePlugin,
  PanelSection,
  DialogButton,
  ServerAPI,
  staticClasses,
  Focusable,
} from "decky-frontend-lib";
import { VFC, useEffect, useState, useContext } from "react";
import { SiWinamp } from "react-icons/si";
import { FaPlay, FaPause, FaStop, FaFastForward, FaFastBackward } from "react-icons/fa";
import { WinampContextType } from './types';
import WinampProvider, { WinampContext } from "./context";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC<{ serverAPI: ServerAPI, getSongName:()=>string, getArtistName:()=>string, getAlbumName:()=>string}> = ({getSongName, getArtistName, getAlbumName}) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

    // const notify = async (message: string, duration: number = 1000) => {
	// 	await serverAPI.toaster.toast({
	// 		title: message,
	// 		body: message,
	// 		duration: duration,
	// 		critical: true
	// 	});
	// }

  const { songName, artistName, albumName } = useContext(WinampContext) as WinampContextType;

  console.log("PING");

  return (
    <PanelSection title="Controls">
      <Focusable
      style={{ marginTop: "10px", marginBottom: "10px", display: "flex" }}
      flow-children="horizontal"
      >
        <DialogButton
          style={{
            marginLeft: "0px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 0px 0px 0px",
            minWidth: "0",
          }}
          onClick={() => {
            fetch('http://127.0.0.1:5151/prev', {mode:'no-cors'})
          }}
        >
          <FaFastBackward style={{ marginTop: "-4px", display: "block" }} />
        </DialogButton>
        <DialogButton
          style={{
            marginLeft: "5px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 0px 0px 0px",
            minWidth: "0",
          }}
          onClick={() => {
            fetch('http://127.0.0.1:5151/play', {mode:'no-cors'})
          }}
        >
          <FaPlay style={{ marginTop: "-4px", display: "block" }} />
        </DialogButton>
        <DialogButton
          style={{
            marginLeft: "5px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 0px 0px 0px",
            minWidth: "0",
          }}
          onClick={() => {
            fetch('http://127.0.0.1:5151/pause', {mode:'no-cors'})
          }}
        >
          <FaPause style={{ marginTop: "-4px", display: "block" }} />
        </DialogButton>
        <DialogButton
          style={{
            marginLeft: "5px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 0px 0px 0px",
            minWidth: "0",
          }}
          onClick={() => {
            fetch('http://127.0.0.1:5151/stop', {mode:'no-cors'})
          }}
        >
          <FaStop style={{ marginTop: "-4px", display: "block" }} />
        </DialogButton>
        <DialogButton
          style={{
            marginLeft: "5px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px 0px 0px 0px",
            minWidth: "0",
          }}
          onClick={() => {
            fetch('http://127.0.0.1:5151/next', {mode:'no-cors'})
          }}
        >
          <FaFastForward style={{ marginTop: "-4px", display: "block" }} /> 
        </DialogButton>
        </Focusable>
        <div>{songName}<br/>{artistName}<br/>{albumName}</div>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {

  let songName="";
  let artistName="";
  let albumName="";
  const getSongName = () => {
    return songName;
  }
  const getArtistName = () => {
    return artistName;
  }
  const getAlbumName = () => {
    return albumName;
  }

  const updateStatus = () => {
    serverApi.fetchNoCors("http://127.0.0.1:5151/consolestatus.xml")
    .then((res) => {
      if(!res.success) {
        console.log("Winamp off?")
        return;
      }

      try{
        const winampStatusXML = (res.result as {body:string}).body;
        const parser= new DOMParser();
        const doc = parser.parseFromString(winampStatusXML,"text/xml");
        songName=doc.getElementsByTagName("title")[0].textContent as string;
        artistName=doc.getElementsByTagName("artist")[0].textContent as string;
        albumName=doc.getElementsByTagName("album")[0].textContent as string;
        console.log(songName);
        

      } catch (err: any) {
        console.log(err);
        return;
      }
    })

  }

    const id = setInterval(updateStatus, 1000);
    updateStatus();
    
  return {
    title: <div className={staticClasses.Title}>Deck Winamp Control</div>,
    content: <WinampProvider><Content serverAPI={serverApi} getSongName={getSongName} getArtistName={getArtistName} getAlbumName={getAlbumName}/></WinampProvider>,
    icon: <SiWinamp />,
    alwaysRender: true,
    onDismount() {
      clearInterval(id);
    },
  };
});
