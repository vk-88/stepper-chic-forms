import { Input, Select, Button, Typography, Card, Upload, message } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

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
      message.error("Minimum 2 documents are required");
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
        message.error("Please upload a valid image file");
        return;
      }
    } else if (document.fileType === "pdf") {
      if (fileExtension !== "pdf") {
        message.error("Please upload a PDF file");
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
    >
      <div className="flex justify-between items-center mb-4">
        <Title level={5} className="!mb-0">
          Upload Documents
        </Title>
        <Button type="dashed" icon={<PlusOutlined />} onClick={addDocument}>
          Add Document
        </Button>
      </div>

      <Text type="secondary" className="block mb-6">
        Minimum 2 documents are required
      </Text>

      {documents.map((doc, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card
            className="mb-4"
            styles={{ body: { padding: 20 } }}
          >
            <div className="flex justify-between items-center mb-4">
              <Text strong>
                Document {index + 1}{" "}
                <span className="text-destructive">*</span>
              </Text>
              {documents.length > 2 && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeDocument(index)}
                  size="small"
                />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Text className="block mb-2">File Name</Text>
                <Input
                  placeholder="Enter file name"
                  value={doc.fileName}
                  onChange={(e) =>
                    updateDocument(index, "fileName", e.target.value)
                  }
                  size="large"
                />
              </div>

              <div>
                <Text className="block mb-2">Type of File</Text>
                <Select
                  className="w-full"
                  placeholder="Select file type"
                  value={doc.fileType || undefined}
                  onChange={(value) => updateDocument(index, "fileType", value)}
                  size="large"
                  options={[
                    { value: "image", label: "Image" },
                    { value: "pdf", label: "PDF" },
                  ]}
                />
              </div>

              <div>
                <Text className="block mb-2">Upload File</Text>
                <Upload
                  beforeUpload={(file) => {
                    handleFileChange(index, file);
                    return false;
                  }}
                  showUploadList={false}
                  accept={
                    doc.fileType === "image"
                      ? "image/*"
                      : doc.fileType === "pdf"
                      ? ".pdf"
                      : "*"
                  }
                >
                  <Button icon={<UploadOutlined />} block size="large">
                    {doc.file ? "Change File" : "Choose File"}
                  </Button>
                </Upload>
                {doc.file && (
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <FileTextOutlined />
                    <Text type="secondary">{doc.file.name}</Text>
                  </div>
                )}
              </div>

              {errors[index] && (
                <Text type="danger">{errors[index]}</Text>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UploadDocuments;
