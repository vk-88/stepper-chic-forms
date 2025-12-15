import { Form, Input, DatePicker } from "antd";
import { UserOutlined, MailOutlined, CalendarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";

interface PersonalDetailsProps {
  form: ReturnType<typeof Form.useForm>[0];
}

const PersonalDetails = ({ form }: PersonalDetailsProps) => {
  // Calculate max date (18 years ago from today)
  const maxDate = dayjs().subtract(18, "year");

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current > maxDate;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Form form={form} layout="vertical" size="large">
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[
            { required: true, message: "First name is required" },
            { max: 50, message: "First name must be less than 50 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-muted-foreground" />}
            placeholder="Enter your first name"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[
            { required: true, message: "Last name is required" },
            { max: 50, message: "Last name must be less than 50 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-muted-foreground" />}
            placeholder="Enter your last name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-muted-foreground" />}
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[{ required: true, message: "Date of birth is required" }]}
          extra="Minimum age should be 18 years"
        >
          <DatePicker
            className="w-full"
            placeholder="Select date of birth"
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>
      </Form>
    </motion.div>
  );
};

export default PersonalDetails;
