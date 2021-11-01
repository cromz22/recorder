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
import { useHistory, useParams } from "react-router-dom";

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
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const encoded = reader.result
              .toString()
              .replace(/data:.*\/.*;base64,/, "");

            const current_utterances = props.allBlobs.utterances;
            const new_utterances = current_utterances.map((utt: any) => {
              if (props.uttid === utt.uttid) {
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
  }, [mediaBlobUrl, props.setAllBlobs]);

  return (
    <tr>
      <td width="60%">{props.text}</td>
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
      key={props.dialog.uttid}
      uttid={props.dialog.uttid}
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
  interface taskUtterance {
    no: number;
    ja_speaker: string;
    en_speaker: string;
    ja_sentence: string;
    en_sentence: string;
    spkid: string;
    uttid: string;
  }

  interface taskJson {
    task_id: string;
    set: string;
    conversation: taskUtterance[];
  }

  interface utterance {
    uttid: string;
    text: string;
    audio: string;
    recorded: boolean;
  }

  interface allBlobsType {
    taskid: string;
    utterances: utterance[];
  }

  const initialAllBlobs: allBlobsType = {
    // taskid: dialog.task_id,
    // utterances: utterances,
    taskid: "",
    utterances: [
      {
        uttid: "",
        text: "",
        audio: "",
        recorded: false,
      },
    ],
  };

  const initialTaskJson: taskJson = {
    task_id: "",
    set: "",
    conversation: [
      {
        no: 0,
        ja_speaker: "",
        en_speaker: "",
        ja_sentence: "",
        en_sentence: "",
        spkid: "",
        uttid: "",
      },
    ],
  };

  let { nutt } = useParams<{ nutt: string }>();
  let { taskId } = useParams<{ taskId: string }>();
  const [dialog, setDialog] = useState(initialTaskJson);
  const [allBlobs, setAllBlobs] = useState(initialAllBlobs);
  let history = useHistory();

  const getJsonUrl = "http://localhost:8000/get-task-json";
  const saveAudioUrl = "http://localhost:8000/save-audio";

  useEffect(() => {
    const getJsonUrlNuttTaskid = `${getJsonUrl}/${nutt}/${taskId}`;
    fetch(getJsonUrlNuttTaskid)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
		setDialog(data);
      });
  }, []);

  if (dialog.task_id === "") {
    return <></>;
  }

  const utterances = dialog.conversation.map((uttjson: taskUtterance) => {
    return {
      uttid: uttjson.uttid,
      text: uttjson.en_sentence,
      audio: "",
      recorded: false,
    };
  });


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

    fetch(saveAudioUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(allBlobs),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isAllRecorded) {
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
      {/* TODO: checkbox */}
      <Button type="submit" variant="outline-primary" onClick={handleSubmit}>
        Submit all recordings
      </Button>
    </div>
  );
};

export default Task;
