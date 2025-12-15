import { Steps } from "antd";

export interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="w-full p-4 md:p-6 border-b border-border">
      <Steps
        current={currentStep}
        items={steps.map((step) => ({
          title: step.title,
        }))}
        responsive
      />
    </div>
  );
};

export default Stepper;
