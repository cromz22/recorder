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
import {
  taskJson,
  allBlobsType,
} from "../types/taskType";

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

  const currentUtterances = props.allBlobs.utterances;
  const props_uttid = props.uttid;
  const setAllBlobs = props.setAllBlobs
  const props_taskid = props.allBlobs.taskid;
  console.log(currentUtterances);
  console.log(props_uttid);
  console.log(props.allBlobs);

  useEffect(() => {
    console.log("useEffect called");
    if (mediaBlobUrl) {
	  // console.log(mediaBlobUrl);
      void (async () => {
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
		    // get base64 string (in e.g. webm format)
            const encoded = reader.result
              .toString()
              .replace(/data:.*\/.*;base64,/, "");

			// update utterances
            // const current_utterances = props.allBlobs.utterances;
            const newUtterances = currentUtterances.map((utt: any) => {
              if (props_uttid === utt.uttid) {
                utt.audio = encoded;
                utt.recorded = true;
              }
              return utt;
            });
			console.log("currentUtterances", currentUtterances);
			console.log(currentUtterances[0].uttid)  // これが初期化されてない
			console.log(props_uttid)
			console.log("newUtterances", newUtterances);

            setAllBlobs({
              taskid: props_taskid,
              utterances: newUtterances,
            });
          }
        };
        reader.readAsDataURL(blob);
      })();
    }
  // }, [mediaBlobUrl, current_utterances, props_uttid, setAllBlobs, props_taskid]);
  }, [mediaBlobUrl]);

  // console.log(status);

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
  const tableRows = props.dialog.conversation.map((uttjson: any) => {
    return (
      <RecordTableRow
        key={uttjson.uttid}
        uttid={uttjson.uttid}
        text={uttjson.en_sentence} // or ja_sentence
        allBlobs={props.allBlobs}
        setAllBlobs={props.setAllBlobs}
      />
    );
  });

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
  const initialAllBlobs: allBlobsType = {
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
  }, [nutt, taskId]);


  const handleSubmit = () => {
    // const isRecordedArray = allBlobs.utterances.map(
    //   (utterance) => utterance.recorded
    // );
    // const isAllRecorded = isRecordedArray.every(
    //   (isRecorded) => isRecorded === true
    // );
    const isAllRecorded = allBlobs.utterances.every(
      (utterance) => utterance.recorded === true
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
          history.push(`/finished/${nutt}/${taskId}`); // redirect
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
