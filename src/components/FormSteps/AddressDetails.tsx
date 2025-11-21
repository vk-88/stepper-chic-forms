import { UseFormReturn } from "react-hook-form";
import { TextField, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { FormData } from "@/pages/MultiStepForm";
import { motion } from "framer-motion";

interface AddressDetailsProps {
  form: UseFormReturn<FormData>;
  sameAsResidential: boolean;
  setSameAsResidential: (value: boolean) => void;
}

const AddressDetails = ({
  form,
  sameAsResidential,
  setSameAsResidential,
}: AddressDetailsProps) => {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Residential Address */}
      <div className="space-y-4">
        <Typography variant="h6" className="text-foreground">
          Residential Address
        </Typography>

        <TextField
          fullWidth
          label="Street 1"
          placeholder="Street 1"
          required
          {...register("residentialStreet1")}
          error={!!errors.residentialStreet1}
          helperText={errors.residentialStreet1?.message}
          variant="outlined"
        />

        <TextField
          fullWidth
          label="Street 2"
          placeholder="Street 2"
          required
          {...register("residentialStreet2")}
          error={!!errors.residentialStreet2}
          helperText={errors.residentialStreet2?.message}
          variant="outlined"
        />
      </div>

      {/* Same as Residential Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={sameAsResidential}
            onChange={(e) => setSameAsResidential(e.target.checked)}
          />
        }
        label="Same as Residential Address"
      />

      {/* Permanent Address */}
      <div className="space-y-4">
        <Typography variant="h6" className="text-foreground">
          Permanent Address
        </Typography>

        <TextField
          fullWidth
          label="Street 1"
          placeholder="Street 1"
          required={!sameAsResidential}
          {...register("permanentStreet1")}
          disabled={sameAsResidential}
          error={!!errors.permanentStreet1}
          helperText={errors.permanentStreet1?.message}
          variant="outlined"
        />

        <TextField
          fullWidth
          label="Street 2"
          placeholder="Street 2"
          required={!sameAsResidential}
          {...register("permanentStreet2")}
          disabled={sameAsResidential}
          error={!!errors.permanentStreet2}
          helperText={errors.permanentStreet2?.message}
          variant="outlined"
        />
      </div>
    </motion.div>
  );
};

export default AddressDetails;
