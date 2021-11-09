import React from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useReactMediaRecorder } from "../utils/ReactMediaRecorder";
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { inputUtteranceType, outputUtteranceType } from "./Types";
import { useParams } from "react-router-dom";
import "./RecordTable.css";
// useEffect(() => {
//  if (props.status === "recording") {
// props.setIsProcessing(true);
// console.log(props.status);
// console.log(props.isProcessing);
//  }
// }, [props.status]);
//
// disabled={props.isProcessing}

const StartStopButton = (props: any) => {
  return (
    <IconButton
      onClick={
        props.status === "recording"
          ? props.stopRecording
          : props.startRecording
      }
    >
      {props.status === "recording" ? (
        <StopIcon color="error" className="micstop" />
      ) : (
        <MicIcon color="primary" className="micstop" />
      )}
    </IconButton>
  );
};
// {props.isProcessing ? (
//   <MicIcon color='disabled' className="micstop" />
// ) : props.status == 'recording' ? (
//   <StopIcon color='error' className="micstop" />
// ) : (
//   <MicIcon color='primary' className="micstop" />
// )}

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
  }, [mediaBlobUrl, props.setOutputJson]); // TODO: ここでpropsを書くのはあまりよくない

  return (
    <tr className="fs-4">
      <td className="text-start">{props.text}</td>
      <td>
        <StartStopButton
          status={status}
          startRecording={startRecording}
          stopRecording={stopRecording}
          isProcessing={props.isProcessing}
          setIsProcessing={props.setIsProcessing}
        />
      </td>
      <td>
        <audio src={mediaBlobUrl} controls />
      </td>
    </tr>
  );
};

const RecordTableRows = (props: any) => {
  const { lang } = useParams<{ lang: string }>();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const tableRows = props.inputJson.conversation.map(
    (utt: inputUtteranceType) => {
      let rtr = (
        <RecordTableRow
          key={utt.uttid}
          uttid={utt.uttid}
          text={utt.en_sentence}
          outputJson={props.outputJson}
          setOutputJson={props.setOutputJson}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      );

      if (lang === "ja") {
        rtr = (
          <RecordTableRow
            key={utt.uttid}
            uttid={utt.uttid}
            text={utt.ja_sentence}
            outputJson={props.outputJson}
            setOutputJson={props.setOutputJson}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        );
      }

      return rtr;
    }
  );

  return <>{tableRows}</>;
};

const RecordTableHeader = () => {
  const { lang } = useParams<{ lang: string }>();
  let th = (
    <thead>
      <tr className="fw-bold fs-5">
        <td>Sentences to record</td>
        <td>Record / Stop</td>
        <td>Check the audio</td>
      </tr>
    </thead>
  );
  if (lang === "ja") {
    th = (
      <thead>
        <tr className="fw-bold fs-5">
          <td>録音する文</td>
          <td>録音/停止</td>
          <td>録音した音声の確認</td>
        </tr>
      </thead>
    );
  }
  return th;
};

const RecordTable = (props: any) => {
  return (
    <Table>
      <RecordTableHeader />
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
