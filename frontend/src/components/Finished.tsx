import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";

const Finished = () => {
  let { lang } = useParams<{ lang: string }>();
  let { nutt } = useParams<{ nutt: string }>();
  let { taskId } = useParams<{ taskId: string }>();

  let ctn = (
    <Card style={{ width: "50%" }} border="success" className="mx-auto my-5 fs-5">
	<Card.Body>
      <Card.Title>The audio files were successfully uploaded.</Card.Title>
      <Card.Text>
        Please go back to the AMT crowdsourcing page and copy the folowing task
        id to the textbox.
        <br />
        lang: {lang}
        <br />
        nutt: {nutt}
        <br />
        Task ID: {taskId}
      </Card.Text>
	</Card.Body>
    </Card>
  );

  if (lang === "ja") {
    ctn = (
    <Card style={{ width: "50%" }} border="success" className="mx-auto my-5 fs-5">
	<Card.Body>
        <Card.Title>音声ファイルは正常にアップロードされました。</Card.Title>
        <Card.Text>
          Yahoo!クラウドソーシングのページに戻り、以下のidを入力してください。
          <br />
          lang: {lang}
          <br />
          nutt: {nutt}
          <br />
          Task ID: {taskId}
        </Card.Text>
	</Card.Body>
    </Card>
    );
  }

  return ctn;
};

export default Finished;
