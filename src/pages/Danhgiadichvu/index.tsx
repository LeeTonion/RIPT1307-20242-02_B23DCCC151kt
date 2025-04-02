import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Card, List, message, Modal, Select, TimePicker } from "antd";
import moment from "moment";

interface Employee {
  name: string;
  service: string;
  maxCustomers: number;
  workStart: string;
  workEnd: string;
}

const AddEmployeePage: React.FC = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const onFinish = (values: any) => {
    const newEmployee: Employee = {
      ...values,
      workStart: values.workTime[0].format("HH:mm"),
      workEnd: values.workTime[1].format("HH:mm"),
    };

    if (editingIndex !== null) {
      const updatedEmployees = [...employees];
      updatedEmployees[editingIndex] = newEmployee;
      setEmployees(updatedEmployees);
      message.success("Nhân viên đã được cập nhật!");
    } else {
      setEmployees([...employees, newEmployee]);
      message.success("Nhân viên đã được thêm!");
    }
    form.resetFields();
    setIsModalOpen(false);
    setEditingIndex(null);
  };

  const removeEmployee = (index: number) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
    message.warning("Nhân viên đã bị xoá!");
  };

  const editEmployee = (index: number) => {
    const employee = employees[index];
    form.setFieldsValue({
      name: employee.name,
      service: employee.service,
      maxCustomers: employee.maxCustomers,
      workTime: [moment(employee.workStart, "HH:mm"), moment(employee.workEnd, "HH:mm")],
    });
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <Button type="primary" onClick={() => setIsModalOpen(true)} className="mb-4">
        Thêm Nhân Viên
      </Button>
      
      <Modal title={editingIndex !== null ? "Sửa Nhân Viên" : "Thêm Nhân Viên"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Tên nhân viên" name="name" rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}>            
            <Input placeholder="Nhập tên nhân viên" />
          </Form.Item>

          <Form.Item label="Dịch vụ" name="service" rules={[{ required: true, message: "Vui lòng chọn dịch vụ!" }]}>            
            <Select placeholder="Chọn dịch vụ">
              <Select.Option value="Cắt tóc">Cắt tóc</Select.Option>
              <Select.Option value="Gội đầu">Gội đầu</Select.Option>
              <Select.Option value="Massage">Massage</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Số lượng khách tối đa" name="maxCustomers" rules={[{ required: true, message: "Vui lòng nhập số lượng khách!" }]}>            
            <InputNumber className="w-full" min={1} placeholder="Nhập số lượng khách tối đa" />
          </Form.Item>

          <Form.Item label="Thời gian làm việc" name="workTime" rules={[{ required: true, message: "Vui lòng chọn thời gian làm việc!" }]}>            
            <TimePicker.RangePicker format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {editingIndex !== null ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      <Card title="Danh Sách Nhân Viên" className="w-full max-w-lg shadow-lg">
        <List
          dataSource={employees}
          renderItem={(employee, index) => (
            <List.Item
  actions={[
    <Button type="link" onClick={() => editEmployee(index)}>Sửa</Button>,
    <Button type="link" danger onClick={() => removeEmployee(index)}>Xoá</Button>
  ]}
>              
              <List.Item.Meta
                title={`${employee.name} - ${employee.service}`}
                description={`Số khách tối đa: ${employee.maxCustomers}, Thời gian làm việc: ${employee.workStart} - ${employee.workEnd}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AddEmployeePage;