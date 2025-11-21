import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
        <h3 className="text-lg font-semibold text-foreground">
          Residential Address
        </h3>

        <div className="space-y-2">
          <Label htmlFor="residentialStreet1" className="text-sm font-medium">
            Street 1 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="residentialStreet1"
            placeholder="Street 1"
            {...register("residentialStreet1")}
            className={errors.residentialStreet1 ? "border-destructive" : ""}
          />
          {errors.residentialStreet1 && (
            <p className="text-sm text-destructive">
              {errors.residentialStreet1.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="residentialStreet2" className="text-sm font-medium">
            Street 2 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="residentialStreet2"
            placeholder="Street 2"
            {...register("residentialStreet2")}
            className={errors.residentialStreet2 ? "border-destructive" : ""}
          />
          {errors.residentialStreet2 && (
            <p className="text-sm text-destructive">
              {errors.residentialStreet2.message}
            </p>
          )}
        </div>
      </div>

      {/* Same as Residential Checkbox */}
      <div className="flex items-center space-x-2 py-2">
        <Checkbox
          id="sameAsResidential"
          checked={sameAsResidential}
          onCheckedChange={(checked) => setSameAsResidential(checked as boolean)}
        />
        <Label
          htmlFor="sameAsResidential"
          className="text-sm font-medium cursor-pointer"
        >
          Same as Residential Address
        </Label>
      </div>

      {/* Permanent Address */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Permanent Address
        </h3>

        <div className="space-y-2">
          <Label htmlFor="permanentStreet1" className="text-sm font-medium">
            Street 1 {!sameAsResidential && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="permanentStreet1"
            placeholder="Street 1"
            {...register("permanentStreet1")}
            disabled={sameAsResidential}
            className={errors.permanentStreet1 ? "border-destructive" : ""}
          />
          {errors.permanentStreet1 && (
            <p className="text-sm text-destructive">
              {errors.permanentStreet1.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="permanentStreet2" className="text-sm font-medium">
            Street 2 {!sameAsResidential && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="permanentStreet2"
            placeholder="Street 2"
            {...register("permanentStreet2")}
            disabled={sameAsResidential}
            className={errors.permanentStreet2 ? "border-destructive" : ""}
          />
          {errors.permanentStreet2 && (
            <p className="text-sm text-destructive">
              {errors.permanentStreet2.message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AddressDetails;
