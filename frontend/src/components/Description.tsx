import React from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import "./Description.css";

const Description = () => {
  const { lang } = useParams<{ lang: string }>();
  let dsc = (
    <Container>
      <h1>Crowdsourcing Audio Recordings</h1>
      <h5>Please read aloud the displayed sentences.</h5>
      <Card style={{ width: "70%" }} border="danger" className="mx-auto my-5">
        <Card.Header as="h5">Notes</Card.Header>
        <div className="mx-auto mt-3 px-2">
          <ul>
            <li>
              Please record in a <span className="red">quiet</span> environment.
            </li>
            <li>
              Please speak as <span className="red">clearly</span> as possible.
              If you make a mistake, you can rerecord.
            </li>
            <li>
              Please use a <span className="red">microphone</span> if possible.
            </li>
            <li>
              Please make sure that the audio is{" "}
              <span className="red">actually recorded</span> before submission.
            </li>
            <li>
              Please note that the recorded voice will be used as a dataset in
              the future.
            </li>
          </ul>
        </div>
      </Card>
    </Container>
  );

  if (lang === "ja") {
    dsc = (
      <Container className="mt-5">
        <h1>クラウドソーシング 音声録音ページ</h1>
        <h5>表示された文を音読し録音してください。</h5>
        <Card style={{ width: "70%" }} border="danger" className="mx-auto my-5">
          <Card.Header as="h5">注意点</Card.Header>
          <div className="mx-auto mt-3 px-2">
            <ul>
              <li>
                できるだけ<span className="red">静かな環境</span>
                で録音してください。
              </li>
              <li>
                できるだけ<span className="red">はっきりと丁寧に</span>
                発音するようにしてください。
                読み間違えた場合は録り直しが可能です。
              </li>
              <li>
                可能であれば<span className="red">マイク</span>
                などの録音機器を使用してください。
              </li>
              <li>
                録音した音声がきちんと録音されているかどうか
                <span className="red">確認してから提出</span>してください。
              </li>
              <li>
                録音された音声はデータセットとして公開される予定ですので、ご了承ください。
              </li>
            </ul>
          </div>
        </Card>
      </Container>
    );
  }
  // <Col md={{ span: 6, offset: 3 }}>
  // </Col>
  return dsc;
};

export default Description;
