import React from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import { useEffect } from "react";
import Table from "react-bootstrap/Table";

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
	  { props.status === "recording" ? (
        <StopIcon color="error" />
      ) : (
        <MicIcon color="primary" />
      )}
    </IconButton>
  );
};

const RecordTableRow = (props: any) => {
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

  }, [mediaBlobUrl, props.setAllBlobs]);

  return (
    <tr>
      <td>{props.text}</td>
      <td>
        <StartStopButton
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

export default RecordTable;
