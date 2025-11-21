import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export interface DocumentData {
  fileName: string;
  fileType: "image" | "pdf" | "";
  file: File | null;
}

interface UploadDocumentsProps {
  documents: DocumentData[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentData[]>>;
  errors: string[];
}

const UploadDocuments = ({
  documents,
  setDocuments,
  errors,
}: UploadDocumentsProps) => {
  const addDocument = () => {
    setDocuments([...documents, { fileName: "", fileType: "", file: null }]);
  };

  const removeDocument = (index: number) => {
    if (documents.length > 2) {
      setDocuments(documents.filter((_, i) => i !== index));
    } else {
      toast.error("Minimum 2 documents are required");
    }
  };

  const updateDocument = (
    index: number,
    field: keyof DocumentData,
    value: string | File | null
  ) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  };

  const handleFileChange = (index: number, file: File | null) => {
    if (!file) return;

    const document = documents[index];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    // Validate file type
    if (document.fileType === "image") {
      const validImageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!validImageTypes.includes(fileExtension || "")) {
        toast.error("Please upload a valid image file");
        return;
      }
    } else if (document.fileType === "pdf") {
      if (fileExtension !== "pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
    }

    updateDocument(index, "file", file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Upload Documents
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addDocument}
          >
            Add Document
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Minimum 2 documents are required
        </p>

        {documents.map((doc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border rounded-lg space-y-4 bg-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Document {index + 1}{" "}
                <span className="text-destructive">*</span>
              </span>
              {documents.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`fileName-${index}`} className="text-sm">
                  File Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`fileName-${index}`}
                  placeholder="File Name"
                  value={doc.fileName}
                  onChange={(e) =>
                    updateDocument(index, "fileName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`fileType-${index}`} className="text-sm">
                  Type of File <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={doc.fileType}
                  onValueChange={(value) =>
                    updateDocument(index, "fileType", value)
                  }
                >
                  <SelectTrigger id={`fileType-${index}`}>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`file-${index}`} className="text-sm">
                Upload Document <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`file-${index}`}
                  type="file"
                  accept={
                    doc.fileType === "image"
                      ? "image/*"
                      : doc.fileType === "pdf"
                      ? ".pdf"
                      : "*"
                  }
                  onChange={(e) =>
                    handleFileChange(index, e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById(`file-${index}`)?.click()
                  }
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {doc.file ? "Change File" : "Choose File"}
                </Button>
              </div>
              {doc.file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{doc.file.name}</span>
                </div>
              )}
            </div>

            {errors[index] && (
              <p className="text-sm text-destructive">{errors[index]}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UploadDocuments;
