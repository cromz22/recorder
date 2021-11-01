import Container from "react-bootstrap/Container";
// import { useParams } from "react-router-dom";

const Finished = (props: any) => {
  // let { taskId } = useParams();

  return (
    <>
      <Container>
        <div>
          <p>The audio files were successfully uploaded.</p>
          <p>
            Please go back to the AMT crowdsourcing page and copy the folowing
            task id to the textbox.
            <br />
            Task ID: {props.taskId}
          </p>
        </div>
      </Container>
    </>
  );
};

export default Finished;
