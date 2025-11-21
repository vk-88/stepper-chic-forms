import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Card, CardContent, Box, Typography } from "@mui/material";
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
      documents: documents.map(doc => ({
        fileName: doc.fileName,
        fileType: doc.fileType,
        file: doc.file?.name || ''
      })),
      submittedAt: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Store in localStorage
    const existingSubmissions = JSON.parse(localStorage.getItem("formSubmissions") || "[]");
    existingSubmissions.push(formData);
    localStorage.setItem("formSubmissions", JSON.stringify(existingSubmissions));

    console.log("Form submitted:", formData);
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
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <Box className="min-h-screen bg-background py-8 px-4">
      <Box maxWidth="1000px" mx="auto">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Document Submission Form
          </Typography>
          <Button variant="outlined" onClick={handleLogout} startIcon={<LogOut size={18} />}>
            Logout
          </Button>
        </Box>

        <Card elevation={3}>
          <Stepper steps={steps} currentStep={currentStep} />

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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

              <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  sx={{ minWidth: 100 }}
                >
                  BACK
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ minWidth: 100 }}
                  >
                    NEXT
                  </Button>
                ) : (
                  <Button type="submit" variant="contained" sx={{ minWidth: 100 }}>
                    SUBMIT
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default MultiStepForm;
