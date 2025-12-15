import { Form, Input, Checkbox, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;

interface AddressDetailsProps {
  form: ReturnType<typeof Form.useForm>[0];
  sameAsResidential: boolean;
  setSameAsResidential: (value: boolean) => void;
}

const AddressDetails = ({
  form,
  sameAsResidential,
  setSameAsResidential,
}: AddressDetailsProps) => {
  const handleSameAsResidentialChange = (checked: boolean) => {
    setSameAsResidential(checked);
    
    if (checked) {
      const residentialStreet1 = form.getFieldValue("residentialStreet1");
      const residentialStreet2 = form.getFieldValue("residentialStreet2");
      
      form.setFieldsValue({
        permanentStreet1: residentialStreet1,
        permanentStreet2: residentialStreet2,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Form form={form} layout="vertical" size="large">
        {/* Residential Address */}
        <div className="mb-6">
          <Title level={5} className="!mb-4 text-foreground">
            <HomeOutlined className="mr-2" />
            Residential Address
          </Title>

          <Form.Item
            name="residentialStreet1"
            label="Street 1"
            rules={[{ required: true, message: "Street 1 is required" }]}
          >
            <Input placeholder="Enter street address line 1" />
          </Form.Item>

          <Form.Item
            name="residentialStreet2"
            label="Street 2"
            rules={[{ required: true, message: "Street 2 is required" }]}
          >
            <Input placeholder="Enter street address line 2" />
          </Form.Item>
        </div>

        {/* Same as Residential Checkbox */}
        <Form.Item className="!mb-6">
          <Checkbox
            checked={sameAsResidential}
            onChange={(e) => handleSameAsResidentialChange(e.target.checked)}
          >
            Same as Residential Address
          </Checkbox>
        </Form.Item>

        {/* Permanent Address */}
        <div>
          <Title level={5} className="!mb-4 text-foreground">
            <HomeOutlined className="mr-2" />
            Permanent Address
          </Title>

          <Form.Item
            name="permanentStreet1"
            label="Street 1"
            rules={[
              {
                required: !sameAsResidential,
                message: "Street 1 is required",
              },
            ]}
          >
            <Input
              placeholder="Enter street address line 1"
              disabled={sameAsResidential}
            />
          </Form.Item>

          <Form.Item
            name="permanentStreet2"
            label="Street 2"
            rules={[
              {
                required: !sameAsResidential,
                message: "Street 2 is required",
              },
            ]}
          >
            <Input
              placeholder="Enter street address line 2"
              disabled={sameAsResidential}
            />
          </Form.Item>
        </div>
      </Form>
    </motion.div>
  );
};

export default AddressDetails;
