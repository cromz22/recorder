import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";

const Finished = () => {
  let { lang } = useParams<{ lang: string }>();
  let { nutt } = useParams<{ nutt: string }>();
  let { taskId } = useParams<{ taskId: string }>();

  let ctn = (
    <Container>
      <p>The audio files were successfully uploaded.</p>
      <p>
        Please go back to the AMT crowdsourcing page and copy the folowing task
        id to the textbox.
        <br />
        lang: {lang}
        <br />
        nutt: {nutt}
        <br />
        Task ID: {taskId}
      </p>
    </Container>
  );

  if (lang === "ja") {
    ctn = (
      <Container>
        <p>音声ファイルは正常にアップロードされました。</p>
        <p>
          Yahoo!クラウドソーシングのページに戻り、以下のidを入力してください。
          <br />
          lang: {lang}
          <br />
          nutt: {nutt}
          <br />
          Task ID: {taskId}
        </p>
      </Container>
    );
  }

  return ctn;
};

export default Finished;
