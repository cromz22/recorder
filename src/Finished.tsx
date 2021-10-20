import Container from "react-bootstrap/Container";

const Finished = (props: any) => {
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
