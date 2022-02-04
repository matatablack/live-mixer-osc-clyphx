import React, { Component, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import styled from "styled-components";
import colorutil from 'color-util'
import "./App.css";

const client = new W3CWebSocket("ws://localhost:8000");

const initialState = {
  FADER_1: { channel: "1/2", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_3: { channel: "3/4", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_5: { channel: "5/6", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_7: { channel: "7/8", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_9: { channel: "9/10", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_11: { channel: "11/12", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_13: { channel: "13/14", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_15: { channel: "15/16", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_MIDI_1: { channel: "MIDI 1", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_MIDI_2: { channel: "MIDI 2", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_MIDI_3: { channel: "MIDI 3", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
  FADER_MIDI_4: { channel: "MIDI 4", track_name: "N/A", track_color: "", value: "", int: "", parameter_name: "" },
};

function App() {
  const [state, setState] = React.useState(initialState);

  // const [state, setState] = React.useState(initialState);

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      // console.log("Message received", msg);
      const { type, control, value } = msg;
      if(!state[control]) return;
      console.log("Message received", msg.control, msg.type, msg.value);
      setState((state) => ({
        ...state,
        [control]: { ...state[control], [type]: value },
      }));
    };
  }, []);

  return (
    <Container>
      {Object.entries(state).map(([control, { channel, track_name, track_color, value, parameter_name, int }]) => {
        const isAssigned = track_name !== 'None'
        const trackColor = toColor(track_color);
        const isMidi = channel.startsWith('MIDI')
        return (
          <Strip key={channel} isMidi={isMidi} volume={int}>
            <TrackName assigned={isAssigned} isMidi={isMidi} bg={trackColor}>{track_name.split('[->')[0]}</TrackName>
            <Channel>{channel}</Channel>
          </Strip>
        );
      })}
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Strip = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  width: ${p => p.isMidi ? "110px" : "218px"};
  background-color: black;
  border: 1px solid white;
  text-align: center;
  &:after {
    /* top: ${p => p.isMidi ? "24px" : "38px"}; */
    top: 100%;
    content: "";
    position: absolute;
    width: ${p => p.isMidi ? "110px" : "218px"};
    z-index: 2;
    height: ${p => p.isMidi ? "calc(100% - 24px)"  : "calc(100% - 48px)"};
    background-color: green;
    transform: ${p => `translateY(${p.volume * 100 / 127 * -1}%)`}
  }
`;

const TrackName = styled.div`
  background-color: ${p => p.bg && p.assigned ? p.bg : "#696969" };
  color: black;
  font-size: ${p => p.isMidi ? "16px" : "24px"};
  height: 1.5em;
  line-height: 1.5em;
  text-shadow: 0 0 12px #ffffff;
`;

const Channel = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-size: 28px;
  letter-spacing: 2px;
  color: white;
  z-index: 4;
  text-shadow: 0 0 12px #000;
`;



function toColor(num) {
  num >>>= 0;
  var b = num & 0xFF,
      g = (num & 0xFF00) >>> 8,
      r = (num & 0xFF0000) >>> 16,
      a = 255 ;
  return "rgba(" + [r, g, b, a].join(",") + ")";
}