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
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_MIDI_2: {
    channel: "MIDI 2",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_MIDI_3: {
    channel: "MIDI 3",
    track_name: "None",
    track_color: "",
    value: "",
    int: "",
    parameter_name: "",
  },
  FADER_MIDI_4: {
    channel: "MIDI 4",
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
    track_name: "[MUSIC/KEYS]",
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
    track_name: "[ALIENS/GTR]",
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

function App() {
  const [faders, setFaders] = React.useState(fadersInitialState);

  const [knobs, setKnobs] = React.useState(knobsInitialState);

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      // if(msg.type === "track_arm" && msg.control === "FADER_1" || msg.control.includes("lp")) console.log(msg)
      const { type, control, value } = msg;

      if (type === "value" && control.includes("lp_arm_")) {
        armedTracksByFader["FADER_" + control.split("lp_arm_")[1]] =
          value === "True" ? true : false;
      }
      if (type === "value" && control.includes("lp_solo_")) {
        soloTracksByFader["FADER_" + control.split("lp_solo_")[1]] =
          value === "True" ? true : false;
      }

      if (faders[control]) {
        setFaders((faders) => ({
          ...faders,
          [control]: { ...faders[control], [type]: value },
        }));
      }

      if (knobs[control]) {
        //  console.log("Message received", msg);
        setKnobs((knobs) => ({
          ...knobs,
          [control]: { ...knobs[control], [type]: value },
        }));
      }
    };
  }, []);

  const knobsList = Object.entries(knobs);
  const knobsFirstRow = knobsList.slice(0, 4);
  const knobsOtherRows = knobsList.slice(-8);

  return (
    <Container>
      {Object.entries(faders).map(
        ([control, { channel, track_name, track_color, index, int }]) => {
          const isAssigned = track_name !== "None";
          const trackColor = toColor(track_color);
          const isMidi = channel.startsWith("MIDI");
          const isArmed = armedTracksByFader[control];
          const isSoloed = soloTracksByFader[control];
          return (
            <Strip key={channel} isMidi={isMidi} volume={int}>
              <TrackName assigned={isAssigned} isMidi={isMidi} bg={trackColor}>
                {track_name.split("[->")[0]}
              </TrackName>
              <Channel isMidi={isMidi} isArmed={isArmed} isSoloed={isSoloed}>
                {isMidi ? "" : index}
                <div>
                  <span>{channel.split("/")[0]}</span>
                  <span>{channel.split("/")[1]}</span>
                </div>
              </Channel>
            </Strip>
          );
        }
      )}
      <KnobsContainer firstRow>
        {knobsFirstRow.map(
          (
            [control, { track_name, parameter_name, int, fader_midi }],
            index
          ) => {
            const isAssigned =
              fader_midi !== "FADER_MIDI_4" &&
              faders[fader_midi]?.track_name !== "None";
            return (
              <span key={control}>
                <Knob value={int} />
                {isAssigned ? parameter_name : track_name}
              </span>
            );
          }
        )}
      </KnobsContainer>
      <KnobsContainer>
        {knobsOtherRows.map(
          (
            [control, { track_name, parameter_name, int, fader_midi }],
            index
          ) => {
            const isAssigned =
              fader_midi !== "FADER_MIDI_4" &&
              faders[fader_midi]?.track_name !== "None";
            return (
              <span key={control}>
                <Knob value={int} />
                {isAssigned ? parameter_name : track_name}
              </span>
            );
          }
        )}
      </KnobsContainer>
    </Container>
  );
}

export default App;

const viewportHeight = 100;

const Container = styled.div`
  margin-left: 312px;
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
  background-color: black;
  border: 1px solid grey;
  text-align: center;
  position: relative;
  &:after {
    /* top: ${(p) => (p.isMidi ? "24px" : "38px")}; */
    top: 100%;
    content: "";
    position: absolute;
    width: ${(p) => (p.isMidi ? "110px" : "218px")};
    z-index: 2;
    height: ${(p) => (p.isMidi ? "calc(100% - 24px)" : "calc(100% - 38px)")};
    background-color: green;
    transform: ${(p) => `translateY(${((p.volume * 100) / 127) * -1}%)`};
  }
`;

const TrackName = styled.div`
  background-color: ${(p) => (p.bg && p.assigned ? p.bg : "#696969")};
  color: black;
  font-size: ${(p) => (p.isMidi ? "14px" : "24px")};
  height: ${(p) => (p.isMidi ? "24px" : "36px")};
  line-height: 1.5em;
  text-shadow: 0 0 12px #ffffff;
  white-space: pre;
  line-break: anywhere;
`;

const Channel = styled.div`
  font-family: "Courier New", Courier, monospace;
  font-size: ${(p) => (p.isMidi ? "18px" : "30px")};
  letter-spacing: 2px;
  z-index: 4;
  margin-top: 2px;
  background: ${(p) => (p.isSoloed ? "#1b37fd" : "none")};
  color: ${(p) => (p.isArmed ? "red" : "white")};
  font-weight: ${(p) => (p.isArmed ? "bold" : "normal")};
  text-shadow: ${(p) => (p.isArmed ? "0 0 16px #e05a5a;" : "0 0 12px #000;")};
  > div {
    position: absolute;
    bottom: 2px;
    font-size: 18px;
    display: flex;
    flex-direction: row;
    padding: 4px;
    justify-content: space-around;
    z-index: 0;
    width: 100%;
    color: white;
    font-weight: bold;
    :after {
      content: "";
      width: 40px;
      height: 2px;
      position: absolute;
      margin-top: 8px;
      background-color: #c0bfbf;
    }
  }
`;

const KnobsContainer = styled.div`
  top: ${(p) => (p.firstRow ? "40px" : "4px")};
  left: ${(p) =>
    p.firstRow ? "calc(218px*8 + 20px);" : "calc(218px*8 + 20px + 110px*4);"};
  width: 440px;
  height: 100%;
  position: absolute;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: ${(p) => (p.firstRow ? ".5fr" : "1fr")};
  grid-gap: 0px;

  > span {
    color: white;
    z-index: 4;
    text-shadow: 0 0 12px #000;
    display: flex;
    font-size: 10px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    padding-bottom: 20px;
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
