import { UseFormReturn } from "react-hook-form";
import { TextField } from "@mui/material";
import { FormData } from "@/pages/MultiStepForm";
import { motion } from "framer-motion";

interface PersonalDetailsProps {
  form: UseFormReturn<FormData>;
}

const PersonalDetails = ({ form }: PersonalDetailsProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  // Calculate max date (18 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <TextField
        fullWidth
        label="First Name"
        placeholder="First Name"
        required
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Last Name"
        placeholder="Last Name"
        required
        {...register("lastName")}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        placeholder="Email"
        required
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        variant="outlined"
      />

      <TextField
        fullWidth
        label="Date of Birth"
        type="date"
        required
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: maxDateString }}
        {...register("dateOfBirth")}
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth?.message || "Minimum age should be 18 years"}
        variant="outlined"
      />
    </motion.div>
  );
};

export default PersonalDetails;
