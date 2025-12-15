import { Link } from "react-router-dom";
import { Card, Typography, Button } from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Title className="!text-4xl md:!text-5xl !mb-4">
            Document Submission
            <span className="block text-primary mt-2">System</span>
          </Title>
          <Paragraph className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your document verification process with our easy-to-use
            multi-step form system
          </Paragraph>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                  <LoginOutlined className="text-2xl text-primary-foreground" />
                </div>
                <Title level={3} className="!mb-3">
                  Already have an account?
                </Title>
                <Text type="secondary" className="mb-6">
                  Sign in to access your document submission form
                </Text>
                <Link to="/login" className="w-full">
                  <Button type="primary" size="large" block>
                    Sign In
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <UserAddOutlined className="text-2xl text-accent-foreground" />
                </div>
                <Title level={3} className="!mb-3">
                  New here?
                </Title>
                <Text type="secondary" className="mb-6">
                  Create an account to get started with document submission
                </Text>
                <Link to="/signup" className="w-full">
                  <Button size="large" block>
                    Sign Up
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileTextOutlined className="text-xl text-primary" />
              </div>
              <Title level={3} className="!mb-0">
                How It Works
              </Title>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-primary" />
                  <Text strong>Step 1: Personal Details</Text>
                </div>
                <Text type="secondary" className="block text-sm">
                  Enter your basic information including name, email, and date
                  of birth
                </Text>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-primary" />
                  <Text strong>Step 2: Address Details</Text>
                </div>
                <Text type="secondary" className="block text-sm">
                  Provide your residential and permanent address information
                </Text>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircleOutlined className="text-primary" />
                  <Text strong>Step 3: Upload Documents</Text>
                </div>
                <Text type="secondary" className="block text-sm">
                  Upload required documents (minimum 2) for verification
                </Text>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
