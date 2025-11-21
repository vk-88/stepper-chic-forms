import { Stepper as MuiStepper, Step as MuiStep, StepLabel, Box } from "@mui/material";

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
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 }, borderBottom: 1, borderColor: 'divider' }}>
      <MuiStepper activeStep={currentStep} alternativeLabel>
        {steps.map((step) => (
          <MuiStep key={step.id}>
            <StepLabel>{step.title}</StepLabel>
          </MuiStep>
        ))}
      </MuiStepper>
    </Box>
  );
};

export default Stepper;
