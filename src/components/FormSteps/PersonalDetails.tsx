import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-sm font-medium">
          First Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="firstName"
          placeholder="First Name"
          {...register("firstName")}
          className={errors.firstName ? "border-destructive" : ""}
        />
        {errors.firstName && (
          <p className="text-sm text-destructive">{errors.firstName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-sm font-medium">
          Last Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="lastName"
          placeholder="Last Name"
          {...register("lastName")}
          className={errors.lastName ? "border-destructive" : ""}
        />
        {errors.lastName && (
          <p className="text-sm text-destructive">{errors.lastName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="text-sm font-medium">
          Date of Birth <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          max={maxDateString}
          {...register("dateOfBirth")}
          className={errors.dateOfBirth ? "border-destructive" : ""}
        />
        {errors.dateOfBirth && (
          <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Minimum age should be 18 years
        </p>
      </div>
    </motion.div>
  );
};

export default PersonalDetails;
