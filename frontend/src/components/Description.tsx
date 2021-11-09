import React from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const AgreeCheckbox = (props: any) => {
  return (
    <Form className="mb-3 fs-5 fw-bold">
      <Form.Check
        inline
        label={props.agreeLabel}
        onChange={(e) => {
          e.target.checked ? props.setAgreed(true) : props.setAgreed(false);
        }}
      />
    </Form>
  );
};

const Description = (props: any) => {
  const { lang } = useParams<{ lang: string }>();
  let agreeLabel =
    "I agree that my voice will be made public as a part of a dataset.";

  let dsc = (
    <Container>
      <h1>Crowdsourcing Audio Recordings</h1>
      <h5>Please read aloud the displayed sentences.</h5>
      <Card
        style={{ width: "70%" }}
        border="secondary"
        className="mx-auto my-5"
      >
        <Card.Header as="h5">Notes</Card.Header>
        <div className="mx-auto my-3 px-2 fs-5">
		<ul className="text-start">
            <li>
              Please record in a <span className="text-danger">quiet</span> environment.
            </li>
            <li>
              Please speak as <span className="text-danger">clearly</span> as possible.
              If you make a mistake, you can rerecord.
            </li>
            <li>
              Please use a <span className="text-danger">microphone</span> if possible.
            </li>
            <li>
              Please make sure that the audio is{" "}
              <span className="text-danger">actually recorded</span> before submission.
            </li>
            <li>
              Please note that the recorded voice will be released as a dataset
              in the future.
            </li>
          </ul>
          <AgreeCheckbox setAgreed={props.setAgreed} agreeLabel={agreeLabel} />
        </div>
      </Card>
    </Container>
  );

  if (lang === "ja") {
    agreeLabel = "録音した音声がデータセットとして公開されることに同意します。";
    dsc = (
      <Container>
        <h1>クラウドソーシング 音声録音ページ</h1>
        <h5>表示された文を音読し録音してください。</h5>
        <Card
          style={{ width: "75%" }}
          border="secondary"
          className="mx-auto my-5"
        >
          <Card.Header as="h5">注意点</Card.Header>
          <div className="mx-auto my-3 px-2 fs-5">
            <ul className="text-start">
              <li>
                できるだけ<span className="text-danger">静かな環境</span>
                で録音してください。
              </li>
              <li>
                できるだけ<span className="text-danger">はっきりと丁寧に</span>
                発音するようにしてください。
                読み間違えた場合は録り直しが可能です。
              </li>
              <li>
                可能であれば<span className="text-danger">マイク</span>
                などの録音機器を使用してください。
              </li>
              <li>
                録音した音声がきちんと録音されているかどうか
                <span className="text-danger">確認してから提出</span>してください。
              </li>
              <li>
                録音された音声はデータセットとして公開される予定ですので、ご了承ください。
              </li>
            </ul>
            <AgreeCheckbox
              setAgreed={props.setAgreed}
              agreeLabel={agreeLabel}
            />
          </div>
        </Card>
      </Container>
    );
  }
  return dsc;
};

export default Description;
