import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { nearStore } from '../../store/near';
// import { OrbitControls, useGLTF } from "@react-three/drei";

const Create3DAvatar = () => {
  const subdomain = 'aerx' // See section about becoming a partner
  const iFrameRef = useRef(null)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [showIFrame, setShowIFrame] = useState(true)
  const router = useRouter();
  const nearState = nearStore((state) => state);

  function subscribe(event: any) {
    const json = parse(event)
    if (json?.source !== 'readyplayerme') {
      return;
    }
    // Subscribe to all events sent from Ready Player Me 
    // once frame is ready
    if (json.eventName === 'v1.frame.ready') {
      let iFrame: any = iFrameRef.current
      if (iFrame && iFrame.contentWindow) {
        iFrame.contentWindow.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**'
          }),
          '*'
        );
      }
    }
    // Get avatar GLB URL
    if (json.eventName === 'v1.avatar.exported') {
      console.log(`Avatar URL: ${json.data.url}`);
      nearState.set3DUrl(`${json.data.url}`)
      setAvatarUrl(json.data.url)
      setShowIFrame(false);
    }
    // Get user id
    if (json.eventName === 'v1.user.set') {
      console.log(`User with id ${json.data.id} set:
  ${JSON.stringify(json)}`);
    }
  }
  function parse(event: any) {
    try {
      return JSON.parse(event.data);
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    let iFrame: any = iFrameRef.current
    if (iFrame) {
      iFrame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`
    }
  })
  useEffect(() => {
    window.addEventListener('message', subscribe)
    document.addEventListener('message', subscribe)
    return () => {
      window.removeEventListener('message', subscribe)
      document.removeEventListener('message', subscribe)
    }
  });

  useEffect(() => {
    if (!showIFrame) {
      router.push('/settings/profile?avatarUrl=' + avatarUrl)
    }
  }, [showIFrame])


  return (
    <div className="App">
      <div className="topBar">
        <input
          className="toggleButton"
          onClick={() => setShowIFrame(!showIFrame)}
          type="button"
          value={`${showIFrame ? 'Close' : 'Open'} creator`}
        />
        <p id="avatarUrl">Avatar URL: {avatarUrl}</p>
      </div>
      <iframe
        allow="camera *; microphone *"
        className="iFrame"
        id="frame"
        ref={iFrameRef}
        style={{
          display: `${showIFrame ? 'block' : 'none'}`
        }}
        title={"Ready Player Me"}
      />
    </div>
  );
}

export default Create3DAvatar;

