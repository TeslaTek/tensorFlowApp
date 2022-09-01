import Form from "react-bootstrap/Form";

interface ISwitchProps {
  changeSwitch: () => void;
}
export const Switch = ({ changeSwitch }: ISwitchProps) => {
  return (
    <Form>
      <Form.Check type="switch" id="custom-switch" onChange={changeSwitch} />
    </Form>
  );
};
