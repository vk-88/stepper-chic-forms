import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Table,
  Modal,
  Typography,
  message,
  Space,
  Tag,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useFormStore, FormSubmission } from "@/store/useFormStore";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { confirm } = Modal;

const AdminPanel = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated, logout } = useAuthStore();
  const { submissions, deleteSubmission } = useFormStore();

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      message.error("Access denied. Admin only.");
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: "Confirm Delete",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete the submission from ${name}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteSubmission(id);
        message.success("Submission deleted successfully");
      },
    });
  };

  const handleLogout = () => {
    logout();
    message.success("Logged out successfully");
    navigate("/login");
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(
      (submission) =>
        submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [submissions, searchTerm]);

  const columns: ColumnsType<FormSubmission> = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      render: (documents: FormSubmission["documents"]) => (
        <Space>
          {documents.map((doc, idx) => (
            <Tag key={idx} color="blue">
              {doc.fileType}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Submitted At",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            handleDelete(record.id, `${record.firstName} ${record.lastName}`)
          }
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <Title level={2} className="!mb-0">
            Admin Panel
          </Title>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="shadow-lg">
          <div className="mb-6">
            <Input
              size="large"
              placeholder="Search by name or email..."
              prefix={<SearchOutlined className="text-muted-foreground" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredSubmissions}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 800 }}
          />

          <div className="mt-4">
            <Text type="secondary">
              Total Submissions: {submissions.length}
            </Text>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminPanel;
