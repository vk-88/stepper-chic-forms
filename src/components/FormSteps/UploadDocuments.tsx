import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Typography,
  Paper,
  IconButton,
  Box,
  FormHelperText
} from "@mui/material";
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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Upload Documents</Typography>
        <Button variant="outlined" size="small" onClick={addDocument}>
          Add Document
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Minimum 2 documents are required
      </Typography>

      {documents.map((doc, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">
                Document {index + 1} <span style={{ color: 'red' }}>*</span>
              </Typography>
              {documents.length > 2 && (
                <IconButton size="small" onClick={() => removeDocument(index)}>
                  <X size={18} />
                </IconButton>
              )}
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                label="File Name"
                placeholder="File Name"
                required
                value={doc.fileName}
                onChange={(e) => updateDocument(index, "fileName", e.target.value)}
                variant="outlined"
              />

              <FormControl fullWidth required>
                <InputLabel>Type of File</InputLabel>
                <Select
                  value={doc.fileType}
                  label="Type of File"
                  onChange={(e) => updateDocument(index, "fileType", e.target.value)}
                >
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <input
                  id={`file-${index}`}
                  type="file"
                  accept={
                    doc.fileType === "image"
                      ? "image/*"
                      : doc.fileType === "pdf"
                      ? ".pdf"
                      : "*"
                  }
                  onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Upload size={18} />}
                  onClick={() => document.getElementById(`file-${index}`)?.click()}
                >
                  {doc.file ? "Change File" : "Choose File"}
                </Button>
                {doc.file && (
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <FileText size={16} />
                    <Typography variant="body2" color="text.secondary">
                      {doc.file.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              {errors[index] && (
                <FormHelperText error>{errors[index]}</FormHelperText>
              )}
            </Box>
          </Paper>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UploadDocuments;
