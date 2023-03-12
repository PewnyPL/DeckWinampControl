import {
  definePlugin,
  PanelSection,
  DialogButton,
  ServerAPI,
  staticClasses,
  Focusable,
} from "decky-frontend-lib";
import { VFC, useEffect, useState } from "react";
import { SiWinamp } from "react-icons/si";
import { FaPlay, FaPause, FaStop, FaFastForward, FaFastBackward } from "react-icons/fa";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC<{ serverAPI: ServerAPI, getSongName:()=>string, getArtistName:()=>string, getAlbumName:()=>string}> = ({serverAPI, getSongName, getArtistName, getAlbumName}) => {
 
  const [songName,setSongName] = useState(getSongName());
  const [artistName,setArtistName] = useState(getArtistName());
  const [albumName,setAlbumName] = useState(getAlbumName());
  let songID = -1;

  const updateStatus = () => {
    serverAPI.fetchNoCors("http://127.0.0.1:5151/getplaylistpos")
    .then((res) => {
      if(!res.success) {
        console.log("Winamp off?")
        return;
      }

      try{
        const newSongId = (res.result as {body:string}).body;
        if(parseInt(newSongId)!=songID)
        {
          songID=parseInt(newSongId);
          serverAPI.fetchNoCors("http://127.0.0.1:5151/consolestatus.xml")
          .then((res) => {
            if(!res.success) {
              console.log("Winamp off?")
              return;
            }

            try{
              const winampStatusXML = (res.result as {body:string}).body;
              const parser= new DOMParser();
              const doc = parser.parseFromString(winampStatusXML,"text/xml");
              setSongName(doc.getElementsByTagName("title")[0].textContent as string);
              setArtistName(doc.getElementsByTagName("artist")[0].textContent as string);
              setAlbumName(doc.getElementsByTagName("album")[0].textContent as string);
            } catch (err: any) {
              console.log(err);
              return;
            }
          })
        }
        else {
        }
      } catch (err: any) {
        console.log(err);
        return;
      }
    });
  }

  useEffect(() => {
    const id = setInterval(updateStatus, 1000);
    return () => clearInterval(id);
}, []);

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

  let songID=-1;
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

  const notify = async (title: string, message: string, duration: number = 1000) => {
		await serverApi.toaster.toast({
			title: "Now playing: " + title,
			body: message,
			duration: duration,
			critical: true
		});
	}

  const updateStatus = () => {
    serverApi.fetchNoCors("http://127.0.0.1:5151/getplaylistpos")
    .then((res) => {
      if(!res.success) {
        console.log("Winamp off?")
        return;
      }

      try{
        const newSongId = (res.result as {body:string}).body;
        if(parseInt(newSongId)!=songID)
        {
          songID=parseInt(newSongId);
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
              notify(songName, artistName + "  " + albumName, 2000);
              

            } catch (err: any) {
              console.log(err);
              return;
            }
          })
        }
        else {
        }
      } catch (err: any) {
        console.log(err);
        return;
      }
    });
  }

    const id = setInterval(updateStatus, 4000);
    updateStatus();
    
  return {
    title: <div className={staticClasses.Title}>Deck Winamp Control</div>,
    content: <Content serverAPI={serverApi} getSongName={getSongName} getArtistName={getArtistName} getAlbumName={getAlbumName}/>,
    icon: <SiWinamp />,
    alwaysRender: true,
    onDismount() {
      clearInterval(id);
    },
  };
});
