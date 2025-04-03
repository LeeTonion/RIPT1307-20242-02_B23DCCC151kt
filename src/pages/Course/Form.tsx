import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";
import { useModel } from "umi";
import { instructors } from "@/models/course";
interface CourseFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingCourse: API.Course | null;
}

const CourseForm: React.FC<CourseFormProps> = ({ isOpen, onClose, editingCourse }) => {
  const [form] = Form.useForm();
  const [nameLength, setNameLength] = useState<number>(0);
  const { addCourse, updateCourse } = useModel('course');

  // Reset form khi mở modal hoặc thay đổi khóa học đang chỉnh sửa
  useEffect(() => {
    if (isOpen) {
      if (editingCourse) {
        form.setFieldsValue({
          ...editingCourse,
          students: editingCourse.students,
        });
        setNameLength(editingCourse.name.length);
      } else {
        form.resetFields();
        setNameLength(0);
      }
    }
  }, [form, isOpen, editingCourse]);

  // Xử lý khi submit form
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const finalStatus = values.students === 0 ? "Đã kết thúc" : values.status;

      const coursData: API.Course = {
        id: editingCourse ? editingCourse.id : Date.now().toString(),
        name: values.name,
        instructor: values.instructor,
        students: values.students,
        status: finalStatus,
        description: values.description || "",
      };

      let success = false;
      if (editingCourse) {
        success = updateCourse(coursData);
      } else {
        success = addCourse(coursData);
      }

      if (success) {
        onClose();
      }
    });
  };

  return (
    <Modal
      title={
        <span style={{ color: "#3498db" }}>
          {editingCourse ? "✏️ Sửa khóa học" : "➕ Thêm khóa học"}
        </span>
      }
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
      okButtonProps={{
        style: { 
          backgroundColor: "#3498db", 
          borderRadius: 8, 
          borderColor: "#3498db",
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        },
      }}
      cancelButtonProps={{ style: { borderRadius: 8 } }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: "Vui lòng nhập tên khóa học!" },
            {
              max: 100,
              message: "Tên khóa học không được vượt quá 100 ký tự!",
            },
          ]}
        >
          <Input
            placeholder="Nhập tên khóa học (tối đa 100 ký tự)"
            onChange={(e) => {
              const value = e.target.value;
              setNameLength(value.length);
              form.setFieldsValue({ name: value });
            }}
            suffix={`${nameLength}/100`}
            style={{ borderRadius: 8, borderColor: "#3498db" }}
          />
        </Form.Item>
        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
        >
          <Select placeholder="Chọn giảng viên" style={{ borderRadius: 8 }}>
            {instructors.map((instructor) => (
              <Select.Option key={instructor} value={instructor}>
                {instructor}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="students"
          label="Số lượng học viên"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng học viên!" },
            {
              type: "number",
              min: 0,
              message: "Số lượng học viên không được nhỏ hơn 0!",
            },
          ]}
        >
          <InputNumber
            min={0}
            placeholder="Nhập số lượng học viên"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái" style={{ borderRadius: 8 }}>
            <Select.Option value="Đang mở">Đang mở</Select.Option>
            <Select.Option value="Đã kết thúc">Đã kết thúc</Select.Option>
            <Select.Option value="Tạm dừng">Tạm dừng</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả khóa học"
          rules={[{ required: true, message: "Vui lòng nhập mô tả khóa học!" }]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả khóa học"
            rows={4}
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm;