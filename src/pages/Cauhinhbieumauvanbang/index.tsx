import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Space,
} from "antd";

// Định nghĩa kiểu dữ liệu cho trường thông tin
type FieldType = "String" | "Number" | "Date";

// Định nghĩa interface cho trường thông tin
interface DiplomaField {
  id: string;
  name: string;
  type: FieldType;
}

const App: React.FC = () => {
  // State quản lý danh sách trường thông tin, modal, form
  const [fields, setFields] = useState<DiplomaField[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingField, setEditingField] = useState<DiplomaField | null>(null);

  // Lấy dữ liệu từ localStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedFields = localStorage.getItem("diplomaFields");
    if (storedFields) {
      setFields(JSON.parse(storedFields));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi fields thay đổi
  useEffect(() => {
    localStorage.setItem("diplomaFields", JSON.stringify(fields));
  }, [fields]);

  // Kiểm tra tên trường có trùng không
  const isFieldNameDuplicate = (name: string, currentFieldId?: string) => {
    return fields.some(
      (field) => field.name === name && (!currentFieldId || field.id !== currentFieldId)
    );
  };

  // Mở modal để thêm hoặc chỉnh sửa trường thông tin
  const openModal = (field?: DiplomaField) => {
    if (field) {
      setEditingField(field);
      form.setFieldsValue(field);
    } else {
      setEditingField(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
    form.resetFields();
  };

  // Xử lý khi submit form (thêm hoặc chỉnh sửa trường thông tin)
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const fieldName = values.name;

      if (isFieldNameDuplicate(fieldName, editingField?.id)) {
        notification.error({
          message: "Lỗi",
          description: `Tên trường "${fieldName}" đã tồn tại! Vui lòng chọn tên khác.`,
        });
        return;
      }

      const newField: DiplomaField = {
        id: editingField ? editingField.id : Date.now().toString(),
        name: fieldName,
        type: values.type,
      };

      if (editingField) {
        setFields(fields.map((f) => (f.id === editingField.id ? newField : f)));
        notification.success({
          message: "Thành công",
          description: `Trường "${newField.name}" đã được cập nhật thành công!`,
        });
      } else {
        setFields([...fields, newField]);
        notification.success({
          message: "Thành công",
          description: `Trường "${newField.name}" đã được thêm thành công!`,
        });
      }
      closeModal();
    });
  };

  // Xóa trường thông tin
  const handleDelete = (field: DiplomaField) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa trường thông tin này?",
      onOk: () => {
        setFields(fields.filter((f) => f.id !== field.id));
        notification.success({
          message: "Thành công",
          description: `Trường "${field.name}" đã được xóa thành công!`,
        });
      },
    });
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Tên trường",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kiểu dữ liệu",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: DiplomaField) => (
        <Space>
          <Button type="primary" onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Cấu hình biểu mẫu phụ lục văn bằng</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => openModal()}>
          Thêm trường thông tin
        </Button>
      </Space>

      <Table
        dataSource={fields}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      <Modal
        title={editingField ? "Sửa trường thông tin" : "Thêm trường thông tin"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[{ required: true, message: "Vui lòng nhập tên trường!" }]}
          >
            <Input placeholder="Nhập tên trường (ví dụ: Dân tộc, Nơi sinh)" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Kiểu dữ liệu"
            rules={[{ required: true, message: "Vui lòng chọn kiểu dữ liệu!" }]}
          >
            <Select placeholder="Chọn kiểu dữ liệu">
              <Select.Option value="String">String</Select.Option>
              <Select.Option value="Number">Number</Select.Option>
              <Select.Option value="Date">Date</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default App;