import Container from "react-bootstrap/Container";
import { useParams } from "react-router-dom";

const Finished = () => {
  let { nutt } = useParams<{ nutt: string }>();
  let { taskId } = useParams<{ taskId: string }>();

  return (
    <>
      <Container>
        <div>
          <p>The audio files were successfully uploaded.</p>
          <p>
            Please go back to the AMT crowdsourcing page and copy the folowing
            task id to the textbox.
            <br />
            nutt: {nutt}
            <br />
            Task ID: {taskId}
          </p>
        </div>
      </Container>
    </>
  );
};

export default Finished;
