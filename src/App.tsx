import { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css'

const WS_BASE_URL = "ws://localhost:8000/ws/"

export const WebSocketDemo = () => {

  const [clientId, setClientId] = useState(237482);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_BASE_URL + clientId);
  const [currentMessage, setCurrentMessage] = useState('')

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setClientId(Math.floor(Math.random() * 1E6)),
    []
  );

  const handleClickSendMessage = useCallback(()=> {
    sendMessage(currentMessage)
    setCurrentMessage(()=> '')
  }, [currentMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <h1>{clientId}</h1>
      <button onClick={handleClickChangeSocketUrl}>
        Päivitä Client ID
      </button>

      <ul>
        {messageHistory.map((message, idx) => (
          <li key={idx}>{message ? message.data : null}</li>
        ))}
      </ul>

      <textarea value={currentMessage} onChange={(e)=> setCurrentMessage(e.target.value)} rows={3} cols={50}></textarea>

      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN || currentMessage === ''}
      >
        Lähetä
      </button>
      <span>Yhteyden tila: {connectionStatus}</span>
 

    </div>
  );
};

function App() {


  return (
    <>
      <WebSocketDemo></WebSocketDemo>
    </>
  )
}

export default App
