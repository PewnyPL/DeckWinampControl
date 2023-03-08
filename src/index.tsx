import {
  definePlugin,
  PanelSection,
  DialogButton,
  ServerAPI,
  staticClasses,
  Focusable,
} from "decky-frontend-lib";
import { VFC, useEffect, useRef } from "react";
import { SiWinamp } from "react-icons/si";
import { FaPlay, FaPause, FaStop, FaFastForward, FaFastBackward } from "react-icons/fa";


// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
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

    const updateCallback = useRef<() => void>();

  const updateStatus = () => {
    console.log("PING!");
    serverAPI.fetchNoCors("http://127.0.0.1:5151/consolestatus.xml")
    .then(x => JSON.parse(x.result)
  }

  useEffect(() => {
    updateCallback.current = updateStatus;
  });

  useEffect(() => {
    console.debug("Setting up periodic hooks for MusicControl.");
    function tick() {
      updateCallback!.current!();
    }
    const id = setInterval(tick, 1000);
    updateStatus();

    return () => clearInterval(id);
  }, []);

  const notify = async (message: string, duration: number = 1000) => {
		await serverAPI.toaster.toast({
			title: message,
			body: message,
			duration: duration,
			critical: true
		});
	}

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
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  
  serverApi.fetchNoCors("");

  return {
    title: <div className={staticClasses.Title}>Deck Winamp Control</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <SiWinamp />,
    alwaysRender: true,
    onDismount() {
      
    },
  };
});
