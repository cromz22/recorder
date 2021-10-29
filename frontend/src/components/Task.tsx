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
    /*
    if (mediaBlob) {
      const current_utterances = props.allBlobs.utterances;
      const new_utterances = current_utterances.map((utt: any) => {
        if (props.uttid === utt.uttid) {
          utt.audio = mediaBlob;
          utt.recorded = true;
        }
        return utt;
      });
      console.log(new_utterances);

      props.setAllBlobs({
        taskid: props.allBlobs.taskid,
        utterances: new_utterances,
      });
      console.log(props.allBlobs);
    }
	*/

    // /*
    if (mediaBlobUrl) {
      void (async () => {
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const encoded = reader.result
              .toString()
              .replace(/data:.*\/.*;base64,/, "");
            // const bin = atob(encoded);
            // const buf = new Uint8Array(bin.length);
            // for (let i=0; i<bin.length; i++) {
            // 	buf[i] = bin.charCodeAt(i);
            // }
            // console.log(buf);
            // const blobAgain = new Blob([buf], {type: "audio/wav"});

            const current_utterances = props.allBlobs.utterances;
            const new_utterances = current_utterances.map((utt: any) => {
              if (props.uttid == utt.uttid) {
                utt.audio = encoded;
                utt.recorded = true;
              }
              return utt;
            });

            props.setAllBlobs({
              taskid: props.allBlobs.taskid,
              utterances: new_utterances,
            });
          }
        };
        reader.readAsDataURL(blob);
      })();
    }
    // */

    // }, [mediaBlob, props.setAllBlobs]);
  }, [mediaBlobUrl, props.setAllBlobs]);

  return (
    <tr>
      <td>{props.text}</td>
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
      uttid={props.dialog.id + "_" + uttjson.no.toString()}
      text={uttjson.en_sentence} // or ja_sentence
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

  interface utterance {
    uttid: string;
    text: string;
    // audio: Blob;
    audio: string;
    recorded: boolean;
  }

  interface allBlobsType {
    taskid: string;
    utterances: utterance[];
  }

  const utterances = dialog.conversation.map((uttjson: any) => {
    return {
      uttid: dialog.id + "_" + uttjson.no.toString(),
      text: uttjson.en_sentence,
      // audio: new Blob(),
      audio: "",
      recorded: false,
    };
  });

  const initialAllBlobs: allBlobsType = {
    taskid: dialog.id,
    utterances: utterances,
  };

  const [allBlobs, setAllBlobs] = useState(initialAllBlobs);

  let history = useHistory();

  const handleSubmit = () => {
    const isRecordedArray = allBlobs.utterances.map(
      (utterance) => utterance.recorded
    );
    const isAllRecorded = isRecordedArray.every(
      (isRecorded) => isRecorded === true
    );
    if (!isAllRecorded) {
      alert("Please record all the utterances before you submit.");
    }

    // let formData = new FormData();
    // formData.append("taskid", allBlobs.taskid);
    // console.log(allBlobs.utterances);
    //
    // for (let utt of allBlobs.utterances) {
    //   formData.append(utt.uttid, utt.audio);
    // }
    //
    // for (let value of formData.values()) {
    //   console.log(value);
    // }

    fetch(backendUrl, {
      method: "POST",
      // body: formData,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(allBlobs),
    })
      .then((response) => response.json())
      .then((data) => {
        // if (isAllRecorded) {
        //   history.push("/finished"); // redirect
        // }
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
      {/* TODO: checkbox */}
      <Button type="submit" variant="outline-primary" onClick={handleSubmit}>
        Submit all recordings
      </Button>
    </div>
  );
};

export default Task;