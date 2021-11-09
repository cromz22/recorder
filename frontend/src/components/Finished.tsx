import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";

const Finished = () => {
  let { lang, nutt, taskId } =
    useParams<{ lang: string; nutt: string; taskId: string }>();

  const hashCode = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++)
      h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

    return h;
  };

  let ctn = (
    <Card
      style={{ width: "50%" }}
      border="success"
      className="mx-auto my-5 fs-5"
    >
      <Card.Body>
        <Card.Title>The audio files were successfully uploaded.</Card.Title>
        <Card.Text>
          Please go back to the AMT crowdsourcing page and copy the folowing
          Task ID to the textbox.
          <br />
          Task ID: {`${lang}_${nutt}_${taskId}_${hashCode(taskId)}`}
        </Card.Text>
      </Card.Body>
    </Card>
  );

  if (lang === "ja") {
    ctn = (
      <Card
        style={{ width: "50%" }}
        border="success"
        className="mx-auto my-5 fs-5"
      >
        <Card.Body>
          <Card.Title>音声ファイルは正常にアップロードされました。</Card.Title>
          <Card.Text>
            Yahoo!クラウドソーシングのページに戻り、以下のタスクIDを入力してください。
            <br />
            タスクID: {`${lang}_${nutt}_${taskId}_${hashCode(taskId)}`}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return ctn;
};

export default Finished;
