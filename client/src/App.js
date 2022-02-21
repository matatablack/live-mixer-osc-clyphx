import React, { Component, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import styled from "styled-components";
import colorutil from "color-util";
import "./App.css";

const client = new W3CWebSocket("ws://localhost:8000");

const fadersInitialState = {
  FADER_1: {
    channel: "1/2",
    index: "1",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_3: {
    channel: "3/4",
    index: "2",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_5: {
    channel: "5/6",
    index: "3",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_7: {
    channel: "7/8",
    index: "4",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_9: {
    channel: "9/10",
    index: "5",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_11: {
    channel: "11/12",
    index: "6",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_13: {
    channel: "13/14",
    index: "7",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    track_arm: 1,
  },
  FADER_15: {
    channel: "15/16",
    index: "8",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_MIDI_1: {
    channel: "MIDI 1",
    index: "1",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_MIDI_2: {
    channel: "MIDI 2",
    index: "2",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_MIDI_3: {
    channel: "MIDI 3",
    index: "3",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_MIDI_4: {
    channel: "MIDI 4",
    index: "4",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
};

const knobsInitialState = {
  KNOB_1: {
    track_name: "[KICK]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_1",
  },
  KNOB_2: {
    track_name: "[BASS]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_2",
  },
  KNOB_3: {
    track_name: "[DRUMS]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_3",
  },
  KNOB_4: {
    track_name: "[HITS]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_4",
  },
  KNOB_5: {
    track_name: "[MUSIC]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_1",
  },
  KNOB_6: {
    track_name: "[VOX]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_2",
  },
  KNOB_7: {
    track_name: "[ATMOSPHERE]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_3",
  },
  KNOB_8: {
    track_name: "[FX]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_4",
  },
  KNOB_9: {
    track_name: "[ALIENS]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_1",
  },
  KNOB_10: {
    track_name: "[UP]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_2",
  },
  KNOB_11: {
    track_name: "[REFERENCE]",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_3",
  },
  KNOB_12: {
    track_name: "",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
    fader_midi: "FADER_MIDI_4",
  },
};

const armedTracksByFader = {};
const soloTracksByFader = {};
const mutedTracksByFader = {};

let lastStatusMessage = "";

function App() {
  const [faders, setFaders] = React.useState(fadersInitialState);

  const [knobs, setKnobs] = React.useState(knobsInitialState);

  const [statusMessage, setStatusMessage] = React.useState("---");

  const [lastAction, setLastAction] = React.useState("---");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatusMessage("---");
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [statusMessage]);

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      // if(msg.type === "msg" || msg.control.includes("global")) console.log(msg)
      const { type, control, value } = msg;

      // if(type==="value") console.log(control, value)

      // ARM
      if (type === "value" && control.includes("lp_arm_")) {
        armedTracksByFader["FADER_" + control?.split("lp_arm_")[1]] =
          value === "True" ? true : false;
      }

      // SOLO
      if (type === "value" && control.includes("lp_solo_")) {
        soloTracksByFader["FADER_" + control?.split("lp_solo_")[1]] =
          value === "True" ? true : false;
      }

      // MUTE
      if (type === "value" &&  control?.includes("lp_track_mute_")) {
        mutedTracksByFader["FADER_" + control?.split("lp_track_mute_")[1]] = value === "True" ? true : false;
      }

      // FADER
      if (faders[control]) {
        setFaders((faders) => ({
          ...faders,
          [control]: { ...faders[control], [type]: value },
        }));
      }

      // KNOB
      if (knobs[control]) {
        //  console.log("Message received", msg);
        setKnobs((knobs) => ({
          ...knobs,
          [control]: { ...knobs[control], [type]: value },
        }));
      }

      // MESSAGE
      if (type === "msg") {
        if (value === lastStatusMessage) return;
        lastStatusMessage = value;
        setStatusMessage(value);
      }
      if (type === "action") {
        setLastAction(value);
      }
    };
  }, []);

/*   useEffect(() => {
    const x = setInterval(() => {
      console.log('mutedTracksByFader', mutedTracksByFader)
      console.log('armedTracksByFader', armedTracksByFader)
      console.log('solo', soloTracksByFader)
    }, 3000)
    return () => clearInterval(x)
  }, []) */

  const knobsList = Object.entries(knobs);

  return (
    <Container>
      <StatusContainer>
        <StatusMessage>{statusMessage}</StatusMessage>
        <LastAction>{lastAction}</LastAction>
      </StatusContainer>
      {Object.entries(faders).map(
        ([control, { channel, track_name, track_color, index, int, value }]) => {
          const isAssigned = track_name !== "None";
          const trackColor = toColor(track_color);
          const isMidi = channel.startsWith("MIDI");
          const isArmed = armedTracksByFader[control];
          const isSoloed = soloTracksByFader[control];
          const isMuted = mutedTracksByFader[control];
          return (
            <Strip key={channel} isMidi={isMidi} volume={int} isMuted={isMuted}>
              <TrackName assigned={isAssigned} isMidi={isMidi} bg={trackColor}>
                {track_name?.split("[->")[0]}
              </TrackName>
              <Channel isMidi={isMidi} isArmed={isArmed} isSoloed={isSoloed} isMuted={isMuted}>
                <div className="track-id">{index}</div>                
                <div className="mixer-info">
                  <span>{channel?.split("/")[0]}</span>
                  <span>{channel?.split("/")[1]}</span>
                </div>
              </Channel>
              <VolumeValue isMidi={isMidi}>
                {value === "None" ? "" : value}
              </VolumeValue>
            </Strip>
          );
        }
      )}
      <KnobsContainer>
        {knobsList.map(
          (
            [control, { track_name, parameter_name, int, fader_midi }],
            index
          ) => {
            const isAssigned =
              fader_midi !== "FADER_MIDI_4" &&
              faders[fader_midi]?.track_name !== "None";
            const isLast = control === 'KNOB_12'
            return (
              <span key={control}>
                <Knob value={int} />
                <span>{isAssigned ? parameter_name : isLast ? parameter_name : track_name}</span>
              </span>
            );
          }
        )}
      </KnobsContainer>
    </Container>
  );
}

export default App;

const viewportHeight =  100; //33.8;

const StatusContainer = styled.div`
  width: 304px;
  padding: 12px;
  padding-bottom: 0;
  box-sizing: border-box;
  color: #d94c18;
  font-family: "Courier New", Courier, monospace;
  display: flex;
  flex-direction: column;
`;
const StatusMessage = styled.div`
  font-size: 20px;
  font-weight: 600;
  font-family: "Courier New", Courier, monospace;
  text-align: center;
  flex-grow: 3;
  text-overflow: ellipsis;
  /* line-break: anywhere; */
  max-height: 40px;
  overflow: hidden;
`;
const LastAction = styled.div`
  font-size: 16px;
  font-family: "Courier New", Courier, monospace;
  color: #e9e96a;
  flex-grow: 1;
  border-top: 1px solid #e9e96a;
  padding-top: 5px;
  margin-top: 14px;
  display: flex;
  align-items: center;
  :before {
    content: "Last:";
    width: 60px;
    /* font-weight: bold; */
    font-size: 15px;
    display: inline-block;
    overflow: hidden;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${(p) => viewportHeight}vh;
  position: relative;
  overflow: hidden;
`;

const Strip = styled.div`
  display: flex;
  height: ${(p) => viewportHeight}vh;
  flex-direction: column;
  width: ${(p) => (p.isMidi ? "110px" : "218px")};
  background-color: ${p => p.isMuted ? "#303664" : "black" };
  border: 1px solid grey;
  text-align: center;
  position: relative;
  &:after {
    top: 100%;
    content: "";
    position: absolute;
    width: ${(p) => (p.isMidi ? "110px" : "218px")};
    z-index: 2;
    height: ${(p) => (p.isMidi ? "calc(100% - 36px)" : "calc(100% - 36px)")};
    background-color: ${p => p.isMuted ? "grey" : "#14abe5"}; 
    transform: ${(p) => `translateY(${((p.volume * 100) / 127) * -1}%)`};
  }
`;

const TrackName = styled.div`
  background-color: ${(p) => (p.bg && p.assigned ? p.bg : "#696969")};
  color: black;
  font-size: ${(p) => (p.isMidi ? "14px" : "24px")};
  height: ${(p) => (p.isMidi ? "36px" : "36px")};
  line-height: 1.5em;
  text-shadow: 0 0 12px #ffffff;
  white-space: pre;
  line-break: anywhere;
`;

const Channel = styled.div`
  font-family: "Courier New", Courier, monospace;
  letter-spacing: 2px;
  z-index: 4;
  margin-top: 2px;
  background: ${(p) => (p.isSoloed ? "#1b37fd" : "none")};
  > div.track-id {
    font-size: ${(p) => (p.isMidi ? "20px" : "30px")};
    color: ${(p) => (p.isArmed ? "red" : "white")};
    font-weight: ${(p) => (p.isArmed ? "bold" : "normal")};
    text-shadow: ${(p) => (p.isArmed ? "0 0 16px #e05a5a;" : "0 0 12px #000;")};
    height: 34px;

  }
  > div.mixer-info {
    display: flex;
    position: absolute;
    bottom: 2px;
    font-size: ${(p) => (p.isMidi ? "15px" : "18px")};
    flex-direction: row;
    padding: 4px;
    justify-content: space-around;
    z-index: 0;
    width: 100%;
    color: white;
    font-weight: bold;
    /* separator for stereo channels label */
    :after {
      content: "";
      display: ${(p) => (p.isMidi ? "none" : "block")};
      width: 40px;
      height: 2px;
      position: absolute;
      margin-top: 8px;
      background-color: #c0bfbf;
    }
  }
`;

const VolumeValue = styled.div`
  z-index: 10;
  position: absolute;
  width: 100%;
  height: 30px;
  background-color: transparent;
  top: 40%;
  left: 0;
  color: white;
  font-size: ${(p) => (p.isMidi ? "15px" : "18px")};
  text-shadow: 1px 0px 4px #000000a8;
`

const KnobsContainer = styled.div`
  width: 700px;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns:  1fr 1fr 1.1fr 1fr;
  grid-template-rows: 0.5fr;
  grid-gap: 2px;
  height: 100px;
  align-items: center;
  margin-left: 16px;
  padding-top: 2px;

  > span {
    z-index: 4;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    height: 28px;
    > span {
      color: #bbbbbb;
      text-shadow: 0 0 12px #000;
      font-size: 16px;
      line-height: 1.5;
    }
  }
`;

const Knob = styled.div`
  --rad: 25px;
  margin-bottom: 2px;
  margin-right: 8px;
  display: flex;
  height: var(--rad);
  flex-direction: column;
  width: var(--rad);
  background-color: #7f6a6a;
  border: 1px solid grey;
  border-radius: 50%;
  text-align: center;
  position: relative;
  &:after {
    content: "";
    left: calc(50% - 2px);
    position: absolute;
    width: 4px;
    z-index: 2;
    border-radius: 1px;
    height: calc(var(--rad) / 2);
    background-color: black;
    transform-origin: 2px 100%;
    transform: ${(p) => `rotate(${(p.value * 300) / 127 - 150}deg)`};
  }
  &:before {
    content: "";
    left: calc(50% - 1px);
    top: -2px;
    position: absolute;
    width: 2px;
    z-index: 5;
    height: 4px;
    background-color: red;
  }
`;

function toColor(num) {
  num >>>= 0;
  var b = num & 0xff,
    g = (num & 0xff00) >>> 8,
    r = (num & 0xff0000) >>> 16,
    a = 255;
  return "rgba(" + [r, g, b, a].join(",") + ")";
}
