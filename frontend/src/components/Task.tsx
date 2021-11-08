import React from "react";
import { useState, useEffect } from "react";
import "./Task.css";
// import sampleJson from "../data/2utt.json";
import { useHistory, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import RecordTable from "./RecordTable";
import Description from "./Description";
import { inputJsonType, inputUtteranceType, outputJsonType } from "./Types";

const Task = () => {
  const getJsonUrl = "http://localhost:8000/get-input-json";
  const saveAudioUrl = "http://localhost:8000/save-audio";

  const { lang, nutt, taskId } =
    useParams<{ lang: string; nutt: string; taskId: string }>();

  const initialInputJson: inputJsonType = {
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

  // TODO: inputと形式を合わせる
  const initOutputJson: outputJsonType = {
    taskid: "",
    utterances: [
      {
        uttid: "",
        text: "",
        audio: "",
        lang: "",
        recorded: false,
      },
    ],
  };

  const [inputJson, setInputJson] = useState(initialInputJson);
  const [outputJson, setOutputJson] = useState(initOutputJson);

  useEffect(() => {
    const getJsonUrlNuttTaskid = `${getJsonUrl}/${nutt}/${taskId}`;
    fetch(getJsonUrlNuttTaskid)
      .then((response) => {
        return response.json();
      })
      .then((inputJson) => {
        setInputJson(() => inputJson);

        const outputUtterances = inputJson.conversation.map(
          (inputUtterance: inputUtteranceType) => {
            let outputUtterance = {
              uttid: inputUtterance.uttid,
              text: inputUtterance.en_sentence,
              audio: "",
              lang: "en",
              recorded: false,
            };
            if (lang === "ja") {
              outputUtterance = {
                uttid: inputUtterance.uttid,
                text: inputUtterance.ja_sentence,
                audio: "",
                lang: "ja",
                recorded: false,
              };
            }
            return outputUtterance;
          }
        );

        const initialOutputJson: outputJsonType = {
          taskid: inputJson.task_id,
          utterances: outputUtterances,
        };

        setOutputJson(() => initialOutputJson);
      });
  }, [lang, nutt, taskId]);

  let history = useHistory();

  const handleSubmit = () => {
    const isRecordedArray = outputJson.utterances.map(
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
      body: JSON.stringify(outputJson),
    })
      .then((response) => response.json())
      .then((data) => {
        if (isAllRecorded) {
          history.push(`/finished/${lang}/${nutt}/${taskId}`); // redirect
        }
        return console.log(data);
      });
  };

  const SubmitButton = () => {
    let sb = (
      <Button
        type="submit"
        variant="outline-primary"
        onClick={handleSubmit}
        className="btn my-4"
      >
        Submit all recordings
      </Button>
    );
    if (lang === "ja") {
      sb = (
        <Button
          type="submit"
          variant="outline-primary"
          onClick={handleSubmit}
          className="btn my-4"
        >
          全ての録音を提出
        </Button>
      );
    }
    return sb;
  };

  return (
    <div className="Task">
      <Container className="my-5">
        <Description />
        <RecordTable
          inputJson={inputJson}
          outputJson={outputJson}
          setOutputJson={setOutputJson}
        />
        {/* TODO: checkbox */}
        <SubmitButton />
      </Container>
    </div>
  );
};

export default Task;
