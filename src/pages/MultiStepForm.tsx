import { useState } from "react";
import { Form, Button, Card, message } from "antd";
import { LogoutOutlined, ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import Stepper, { Step } from "@/components/Stepper";
import PersonalDetails from "@/components/FormSteps/PersonalDetails";
import AddressDetails from "@/components/FormSteps/AddressDetails";
import UploadDocuments, { DocumentData } from "@/components/FormSteps/UploadDocuments";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useFormStore, FormSubmission } from "@/store/useFormStore";

const steps: Step[] = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Address Details" },
  { id: 3, title: "Upload Documents" },
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sameAsResidential, setSameAsResidential] = useState(false);
  const [documents, setDocuments] = useState<DocumentData[]>([
    { fileName: "", fileType: "", file: null },
    { fileName: "", fileType: "", file: null },
  ]);
  const [documentErrors, setDocumentErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const addSubmission = useFormStore((state) => state.addSubmission);

  const [personalForm] = Form.useForm();
  const [addressForm] = Form.useForm();

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
      try {
        await personalForm.validateFields();
        setCurrentStep(1);
      } catch (error) {
        // Validation failed
      }
    } else if (currentStep === 1) {
      try {
        const fieldsToValidate = ["residentialStreet1", "residentialStreet2"];
        if (!sameAsResidential) {
          fieldsToValidate.push("permanentStreet1", "permanentStreet2");
        }
        await addressForm.validateFields(fieldsToValidate);
        setCurrentStep(2);
      } catch (error) {
        // Validation failed
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateDocuments()) {
      message.error("Please fill in all document details");
      return;
    }

    const personalData = personalForm.getFieldsValue();
    const addressData = addressForm.getFieldsValue();

    const formData: FormSubmission = {
      id: Date.now().toString(),
      firstName: personalData.firstName,
      lastName: personalData.lastName,
      email: personalData.email,
      dateOfBirth: personalData.dateOfBirth?.format("YYYY-MM-DD") || "",
      residentialStreet1: addressData.residentialStreet1,
      residentialStreet2: addressData.residentialStreet2,
      permanentStreet1: sameAsResidential
        ? addressData.residentialStreet1
        : addressData.permanentStreet1,
      permanentStreet2: sameAsResidential
        ? addressData.residentialStreet2
        : addressData.permanentStreet2,
      documents: documents.map((doc) => ({
        fileName: doc.fileName,
        fileType: doc.fileType,
        file: doc.file?.name || "",
      })),
      submittedAt: new Date().toISOString(),
    };

    addSubmission(formData);
    message.success("Form submitted successfully!");

    // Reset form
    personalForm.resetFields();
    addressForm.resetFields();
    setDocuments([
      { fileName: "", fileType: "", file: null },
      { fileName: "", fileType: "", file: null },
    ]);
    setCurrentStep(0);
    setSameAsResidential(false);
  };

  const handleLogout = () => {
    logout();
    message.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Document Submission Form
          </h1>
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <Card className="shadow-lg">
          <Stepper steps={steps} currentStep={currentStep} />

          <div className="p-4 md:p-8">
            {currentStep === 0 && <PersonalDetails form={personalForm} />}
            {currentStep === 1 && (
              <AddressDetails
                form={addressForm}
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
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                disabled={currentStep === 0}
                size="large"
              >
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  size="large"
                >
                  Next <ArrowRightOutlined />
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  icon={<CheckOutlined />}
                  size="large"
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MultiStepForm;
