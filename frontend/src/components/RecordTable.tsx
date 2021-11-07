import React from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import { useEffect } from "react";
import Table from "react-bootstrap/Table";
import { inputUtteranceType, outputUtteranceType } from "./types";

const StartStopButton = (props: any) => {
  return (
    <IconButton
      onClick={
        props.status === "recording"
          ? props.stopRecording
          : props.startRecording
      }
      disabled={props.isProcessing}
    >
      {props.status === "recording" ? (
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

            const currentOutputUtterances = props.outputJson.utterances;
            const newOutputUtterances = currentOutputUtterances.map(
              (utt: outputUtteranceType) => {
                if (props.uttid === utt.uttid) {
                  utt.audio = encoded;
                  utt.recorded = true;
                }
                return utt;
              }
            );

            props.setOutputJson({
              taskid: props.outputJson.taskid,
              utterances: newOutputUtterances,
            });
          }
        };
        reader.readAsDataURL(blob);
      })();
    }
  }, [mediaBlobUrl, props.setOutputJson]);  // TODO: ここでpropsを書くのはあまりよくない

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
  const tableRows = props.inputJson.conversation.map(
    (utt: inputUtteranceType) => (
      <RecordTableRow
        key={utt.uttid}
        uttid={utt.uttid}
        text={utt.en_sentence} // or ja_sentence
        outputJson={props.outputJson}
        setOutputJson={props.setOutputJson}
      />
    )
  );

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
          inputJson={props.inputJson}
          outputJson={props.outputJson}
          setOutputJson={props.setOutputJson}
        />
      </tbody>
    </Table>
  );
};

export default RecordTable;
