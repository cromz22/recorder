import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import RecordTable from "./RecordTable";
import Description from "./Description";
import { inputJsonType, inputUtteranceType, outputJsonType } from "./Types";

const Task = () => {
  const [agreed, setAgreed] = useState(false);
  const [checkedRecordings, setCheckedRecordings] = useState(false);
  const { lang, nutt, taskId } =
    useParams<{ lang: string; nutt: string; taskId: string }>();

  const getJsonUrl = "http://localhost:8000/get-input-json";
  const saveAudioUrl = "http://localhost:8000/save-audio";

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
    if (!agreed) {
      alert(
        "Please agree that your voice will be released as a part of a dataset."
      );
    }
    if (!isAllRecorded) {
      alert("Please record all the utterances before you submit.");
    }
    if (!checkedRecordings) {
      alert("Please check that all the utterances are properly recorded.");
    }

    fetch(saveAudioUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(outputJson),
    })
      .then((response) => response.json())
      .then((data) => {
        if (agreed && isAllRecorded && checkedRecordings) {
          history.push(`/finished/${lang}/${nutt}/${taskId}`); // redirect
        }
        return console.log(data);
      });
  };

  const SubmitButton = () => {
    return (
      <Button
        type="submit"
        variant="outline-primary"
        onClick={handleSubmit}
        className="fs-4 fw-bold my-4"
      >
        {lang === "en" ? "Submit all recordings" : "全ての録音を提出する"}
      </Button>
    );
  };

  return (
    <div className="Task">
      <Container className="my-5 text-center">
        <Description setAgreed={setAgreed} />
        <RecordTable
          inputJson={inputJson}
          outputJson={outputJson}
          setOutputJson={setOutputJson}
        />
        <RecordedCheckbox
          setCheckedRecordings={setCheckedRecordings}
          checkedLabel={
            lang === "en"
              ? "I checked all the utterances are properly recorded."
              : "全ての音声が正常に録音されていることを確認しました。"
          }
        />
        <SubmitButton />
      </Container>
    </div>
  );
};

const RecordedCheckbox = (props: any) => {
  return (
    <Form className="mt-5 fs-4 fw-bold">
      <Form.Check
        inline
        label={props.checkedLabel}
        onChange={(e) => {
          e.target.checked
            ? props.setCheckedRecordings(true)
            : props.setCheckedRecordings(false);
        }}
      />
    </Form>
  );
};

export default Task;
