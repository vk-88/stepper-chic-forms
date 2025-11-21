import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Stepper, { Step } from "@/components/Stepper";
import PersonalDetails from "@/components/FormSteps/PersonalDetails";
import AddressDetails from "@/components/FormSteps/AddressDetails";
import UploadDocuments, {
  DocumentData,
} from "@/components/FormSteps/UploadDocuments";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const steps: Step[] = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Address Details" },
  { id: 3, title: "Upload Documents" },
];

// Calculate date 18 years ago
const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      return birthDate <= eighteenYearsAgo;
    }, "You must be at least 18 years old"),
  residentialStreet1: z.string().min(1, "Street 1 is required"),
  residentialStreet2: z.string().min(1, "Street 2 is required"),
  permanentStreet1: z.string().optional(),
  permanentStreet2: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sameAsResidential, setSameAsResidential] = useState(false);
  const [documents, setDocuments] = useState<DocumentData[]>([
    { fileName: "", fileType: "", file: null },
    { fileName: "", fileType: "", file: null },
  ]);
  const [documentErrors, setDocumentErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      residentialStreet1: "",
      residentialStreet2: "",
      permanentStreet1: "",
      permanentStreet2: "",
    },
  });

  const validateDocuments = (): boolean => {
    const errors: string[] = [];
    let isValid = true;

    documents.forEach((doc, index) => {
      if (!doc.fileName || !doc.fileType || !doc.file) {
        errors[index] = "All document fields are required";
        isValid = false;
      } else {
        errors[index] = "";
      }
    });

    setDocumentErrors(errors);
    return isValid;
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      const isValid = await form.trigger([
        "firstName",
        "lastName",
        "email",
        "dateOfBirth",
      ]);
      if (isValid) {
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      const fieldsToValidate: (keyof FormData)[] = [
        "residentialStreet1",
        "residentialStreet2",
      ];

      if (!sameAsResidential) {
        fieldsToValidate.push("permanentStreet1", "permanentStreet2");
      }

      const isValid = await form.trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep(2);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!validateDocuments()) {
      toast.error("Please fill in all document details");
      return;
    }

    // If same as residential, copy the address
    const formData = {
      ...data,
      permanentStreet1: sameAsResidential
        ? data.residentialStreet1
        : data.permanentStreet1,
      permanentStreet2: sameAsResidential
        ? data.residentialStreet2
        : data.permanentStreet2,
      documents: documents,
    };

    console.log("Form submitted:", formData);
    
    // API call would go here
    // Example: await api.submitForm(formData);
    
    toast.success("Form submitted successfully!");
    
    // Reset form after successful submission
    form.reset();
    setDocuments([
      { fileName: "", fileType: "", file: null },
      { fileName: "", fileType: "", file: null },
    ]);
    setCurrentStep(0);
  };

  const handleLogout = () => {
    // Clear any auth data here
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Document Submission Form
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="shadow-lg">
          <Stepper steps={steps} currentStep={currentStep} />

          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            {currentStep === 0 && <PersonalDetails form={form} />}
            {currentStep === 1 && (
              <AddressDetails
                form={form}
                sameAsResidential={sameAsResidential}
                setSameAsResidential={setSameAsResidential}
              />
            )}
            {currentStep === 2 && (
              <UploadDocuments
                documents={documents}
                setDocuments={setDocuments}
                errors={documentErrors}
              />
            )}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="min-w-[100px]"
              >
                BACK
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="min-w-[100px]"
                >
                  NEXT
                </Button>
              ) : (
                <Button type="submit" className="min-w-[100px]">
                  SUBMIT
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MultiStepForm;
