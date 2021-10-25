import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Task.css";
import sampleJson from "../data/sample.json";
import { useHistory } from "react-router-dom";

const IsProcessingContext = createContext(false);

const StartStopButton = (props: any): JSX.Element => {
  return (
    <IconButton
      onClick={
        props.status === "recording"
          ? props.stopRecording
          : props.startRecording
      }
      disabled={props.isProcessing}
    >
      {props.isProcessing ? (
        <MicIcon color="disabled" />
      ) : props.status === "recording" ? (
        <StopIcon color="error" />
      ) : (
        <MicIcon color="primary" />
      )}
    </IconButton>
  );
};

const RecordTableRow = (props: any) => {
  const isProcessing = useContext(IsProcessingContext);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (mediaBlobUrl) {
      void (async () => {
        const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            // const encoded = reader.result.toString().replace(/data:.*\/.*;base64,/, '');
            const encoded = reader.result.toString();
            console.log(encoded);
            props.setAllBlobs({ blobs: [...props.allBlobs.blobs, encoded] });
            console.log(props.allBlobs.blobs);
          }
        };
        reader.readAsDataURL(blob);
      })();
    }
  }, [mediaBlobUrl, props.setAllBlobs]);

  return (
    <tr>
      <td>{props.value}</td>
      <td>
        <StartStopButton
          isProcessing={isProcessing}
          status={status}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </td>
      <td>
        <audio src={mediaBlobUrl} controls />
      </td>
    </tr>
  );
};

const RecordTableRows = (props: any) => {
  const tableRows = props.dialog.conversation.map((uttjson: any) => (
    <RecordTableRow
      key={props.dialog.id + "_" + uttjson.no.toString()}
      value={uttjson.en_sentence}
      allBlobs={props.allBlobs}
      setAllBlobs={props.setAllBlobs}
    />
  ));

  return <>{tableRows}</>;
};

// TODO: move the components to another file?
const RecordTable = (props: any) => {
  return (
    <Table>
      <thead>
        <tr>
          <td>Sentences to record</td>
          <td>Record / Stop</td>
          <td>Check the audio</td>
        </tr>
      </thead>
      <tbody>
        <RecordTableRows
          dialog={props.dialog}
          allBlobs={props.allBlobs}
          setAllBlobs={props.setAllBlobs}
        />
      </tbody>
    </Table>
  );
};

const Task = () => {
  const backendUrl = "http://localhost:8000/save-audio";

  const dialog = sampleJson[1]; // TODO: fetch from backend?

  interface allBlobsType {
    blobs: string[];
  }

  const initialAllBlobs: allBlobsType = { blobs: [] }; // TODO: change the data structure so that each utterance has a unique blob (to enable re-recording)

  const [allBlobs, setAllBlobs] = useState(initialAllBlobs);

  let history = useHistory();

  const handleSubmit = () => {
    if (allBlobs.blobs.length !== dialog.conversation.length) {
      alert("Please record all the utterances before you submit.");
    }
    console.log(allBlobs.blobs.length);
    console.log(dialog.conversation.length);

    fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(allBlobs),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.blobs.length === 4) {
          history.push("/finished"); // redirect
        }
        return console.log(data);
      });
  };

  return (
    <div className="Task">
      <h1>Audio Recording</h1>
      <p>Please read aloud the displayed sentences.</p>
      <RecordTable
        dialog={dialog}
        allBlobs={allBlobs}
        setAllBlobs={setAllBlobs}
      />
      <Button type="submit" variant="outline-primary" onClick={handleSubmit}>
        Submit all recordings
      </Button>
    </div>
  );
};

export default Task;
