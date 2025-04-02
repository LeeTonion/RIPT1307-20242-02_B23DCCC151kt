import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Space,
  InputNumber,
  Card,
  Typography,
  Dropdown,
  Menu,
} from "antd";

// Định nghĩa interface cho khóa học
interface Course {
  id: string;
  name: string;
  instructor: string;
  students: number;
  status: "Đang mở" | "Đã kết thúc" | "Tạm dừng";
  description: string;
}

// Danh sách giảng viên mẫu
const instructors = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];

const App: React.FC = () => {
  const { Title } = Typography;
  // State quản lý danh sách khóa học, modal, form, bộ lọc, tìm kiếm và số ký tự
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterInstructor, setFilterInstructor] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"Đang mở" | "Đã kết thúc" | "Tạm dừng" | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [nameLength, setNameLength] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const pageSize = 5;

  // Lấy dữ liệu từ localStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) {
      const parsedCourses = JSON.parse(storedCourses);
      const updatedCourses = parsedCourses.map((course: any) => ({
        ...course,
        description: course.description || "",
      }));
      setCourses(updatedCourses);
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi courses thay đổi
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  // Lọc và sắp xếp danh sách khóa học
  const filteredAndSortedCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchInstructor = filterInstructor ? course.instructor === filterInstructor : true;
      const matchStatus = filterStatus ? course.status === filterStatus : true;
      const matchName = course.name.toLowerCase().includes(searchName.toLowerCase());
      return matchInstructor && matchStatus && matchName;
    });

    return filtered.sort((a, b) => b.students - a.students);
  }, [courses, filterInstructor, filterStatus, searchName]);

  // Kiểm tra tên khóa học có trùng không
  const isCourseNameDuplicate = (name: string, currentCourseId?: string) => {
    return courses.some(
      (course) => course.name === name && (!currentCourseId || course.id !== currentCourseId)
    );
  };

  // Mở modal để thêm hoặc chỉnh sửa khóa học
  const openModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      form.setFieldsValue({
        ...course,
        students: course.students,
      });
      setNameLength(course.name.length);
    } else {
      setEditingCourse(null);
      form.resetFields();
      setNameLength(0);
    }
    setIsModalOpen(true);
  };

  // Đóng modal thêm/sửa
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    form.resetFields();
    setNameLength(0);
  };

  // Mở modal hiển thị mô tả
  const openDescriptionModal = (course: Course) => {
    setSelectedCourse(course);
    setIsDescriptionModalOpen(true);
  };

  // Đóng modal mô tả
  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setSelectedCourse(null);
  };

  // Xử lý khi submit form (thêm hoặc chỉnh sửa khóa học)
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const courseName = values.name;

      if (isCourseNameDuplicate(courseName, editingCourse?.id)) {
        notification.error({
          message: "Lỗi",
          description: `Tên khóa học "${courseName}" đã tồn tại! Vui lòng chọn tên khác.`,
        });
        return;
      }

      const finalStatus = values.students === 0 ? "Đã kết thúc" : values.status;

      const newCourse: Course = {
        id: editingCourse ? editingCourse.id : Date.now().toString(),
        name: courseName,
        instructor: values.instructor,
        students: values.students,
        status: finalStatus,
        description: values.description || "",
      };

      if (editingCourse) {
        setCourses(courses.map((course) => (course.id === editingCourse.id ? newCourse : course)));
        notification.success({
          message: "Thành công",
          description: `Khóa học "${newCourse.name}" đã được cập nhật thành công!`,
        });
      } else {
        setCourses([...courses, newCourse]);
        notification.success({
          message: "Thành công",
          description: `Khóa học "${newCourse.name}" đã được thêm thành công!`,
        });
      }
      closeModal();
    });
  };

  // Xóa khóa học
  const handleDelete = (course: Course) => {
    if (course.students > 0) {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa khóa học có học viên!",
      });
      return;
    }
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa khóa học này?",
      onOk: () => {
        setCourses(courses.filter((c) => c.id !== course.id));
        notification.success({
          message: "Thành công",
          description: `Khóa học "${course.name}" đã được xóa thành công!`,
        });
      },
    });
  };

  // Xử lý thay đổi trạng thái từ dropdown
 const handleStatusChange = (course: Course, newStatus: "Đang mở" | "Đã kết thúc" | "Tạm dừng") => {
  if (course.status === newStatus) {
    notification.warning({
      message: "Cảnh báo",
      description: `Khóa học đã ở trạng thái '${newStatus}'!`,
    });
    return;
  }

  if (newStatus === "Đang mở" && course.students <= 0) {
    notification.error({
      message: "Lỗi",
      description: "Khóa học cần có ít nhất 1 học viên để mở lại!",
    });
    return;
  }

  const updatedCourses = courses.map((c) =>
    c.id === course.id ? { ...c, status: newStatus } : c
  );

  setCourses(updatedCourses);
  notification.success({
    message: "Thành công",
    description: `Khóa học "${course.name}" đã được chuyển sang trạng thái '${newStatus}'!`,
  });

  // Cập nhật lại selectedCourse nếu đang mở mô tả
  if (selectedCourse && selectedCourse.id === course.id) {
    setSelectedCourse({ ...course, status: newStatus });
  }

  setIsDropdownOpen(false);
};


  // Định nghĩa menu cho dropdown
  const statusMenu = (course: Course) => (
    <Menu onClick={({ key }) => handleStatusChange(course, key as "Đang mở" | "Đã kết thúc" | "Tạm dừng")}>
      <Menu.Item key="Đang mở" style={{ color: "#2ecc71", fontWeight: 'bold' }}>
        ✅ Đang mở
      </Menu.Item>
      <Menu.Item key="Tạm dừng" style={{ color: "#f39c12", fontWeight: 'bold' }}>
        ⏸️ Tạm dừng
      </Menu.Item>
      <Menu.Item key="Đã kết thúc" style={{ color: "#e74c3c", fontWeight: 'bold' }}>
        🚫 Đã kết thúc
      </Menu.Item>
    </Menu>
  );

  // Định nghĩa cột cho bảng
  const columns = [
    { 
      title: "Tên khóa học", 
      dataIndex: "name", 
      key: "name",
      render: (name: string) => (
        <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{name}</span>
      )
    },
    { 
      title: "Giảng viên", 
      dataIndex: "instructor", 
      key: "instructor",
      render: (instructor: string) => (
        <span style={{ color: '#34495e' }}>{instructor}</span>
      )
    },
    { 
      title: "Số lượng học viên", 
      dataIndex: "students", 
      key: "students",
      render: (students: number) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: students > 0 ? '#27ae60' : '#c0392b' 
        }}>
          {students}
        </span>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Course) => (
        <Dropdown
          overlay={statusMenu(record)}
          trigger={["click"]}
          onOpenChange={(open) => setIsDropdownOpen(open)}
        >
          <span
            style={{
              color:
                status === "Đang mở"
                  ? "#2ecc71"
                  : status === "Tạm dừng"
                  ? "#f39c12"
                  : "#e74c3c",
              fontWeight: "bold",
              cursor: "pointer",
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'background-color 0.3s',
            }}
            className="hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {status} ▼
          </span>
        </Dropdown>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Course) => (
        <Space>
          <Button
            type="primary"
            onClick={() => openModal(record)}
            style={{
              backgroundColor: "#3498db",
              borderColor: "#3498db",
              transition: "all 0.3s",
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            className="action-button"
          >
            ✏️ Sửa
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record)}
            style={{
              backgroundColor: "#e74c3c",
              borderColor: "#e74c3c",
              transition: "all 0.3s",
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            className="action-button"
          >
            🗑️ Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Xử lý sự kiện khi nhấn vào hàng
  const onRow = (record: Course) => {
    return {
      onClick: (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest(".ant-btn") || isDropdownOpen) {
          return;
        }
        openDescriptionModal(record);
      },
      style: { cursor: 'pointer', transition: 'background-color 0.3s' },
      className: 'hover:bg-gray-50'
    };
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)",
      }}
    >
      <Card
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          border: "1px solid #e9ecef"
        }}
      >
        <Title 
          level={2} 
          style={{ 
            marginBottom: 24, 
            color: "#2c3e50", 
            textAlign: 'center',
            borderBottom: '3px solid #3498db',
            paddingBottom: 10 
          }}
        >
          📚 Quản lý khóa học
        </Title>

        <Space 
          style={{ 
            marginBottom: 16, 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: 12 
          }} 
          wrap
        >
          <Input
            placeholder="🔍 Tìm kiếm theo tên khóa học"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ 
              width: 250, 
              borderRadius: 8, 
              borderColor: "#3498db",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
            allowClear
          />
          <Select
            placeholder="📝 Lọc theo giảng viên"
            allowClear
            style={{ 
              width: 200, 
              borderRadius: 8,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
            onChange={(value: string | undefined) => setFilterInstructor(value || null)}
          >
            {instructors.map((instructor) => (
              <Select.Option key={instructor} value={instructor}>
                {instructor}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="🏷️ Lọc theo trạng thái"
            allowClear
            style={{ 
              width: 200, 
              borderRadius: 8,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
            onChange={(value: "Đang mở" | "Đã kết thúc" | "Tạm dừng" | undefined) =>
              setFilterStatus(value || null)
            }
          >
            <Select.Option value="Đang mở">✅ Đang mở</Select.Option>
            <Select.Option value="Đã kết thúc">🚫 Đã kết thúc</Select.Option>
            <Select.Option value="Tạm dừng">⏸️ Tạm dừng</Select.Option>
          </Select>
          <Button
            type="primary"
            onClick={() => openModal()}
            style={{
              borderRadius: 8,
              backgroundColor: "#3498db",
              borderColor: "#3498db",
              transition: "all 0.3s",
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
            }}
            className="action-button"
          >
            ➕ Thêm khóa học
          </Button>
        </Space>

        <Table
          dataSource={filteredAndSortedCourses}
          columns={columns}
          rowKey="id"
          onRow={onRow}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredAndSortedCourses.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            style: { textAlign: 'center' }
          }}
          style={{ 
            borderRadius: 8, 
            overflow: "hidden",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.04)"
          }}
          rowClassName={() => "row-hover"}
        />
      </Card>

      <Modal
        title={
          <span style={{ color: "#3498db" }}>
            {editingCourse ? "✏️ Sửa khóa học" : "➕ Thêm khóa học"}
          </span>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
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

      <Modal
        title={<span style={{ color: "#3498db" }}>📄 Mô tả khóa học</span>}
        open={isDescriptionModalOpen}
        onOk={closeDescriptionModal}
        onCancel={closeDescriptionModal}
        okText="Đóng"
        cancelButtonProps={{ style: { display: "none" } }}
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
      >
        {selectedCourse && (
          <div
            style={{
              padding: "16px",
              background: "#f8f9fa",
              borderRadius: 8,
              border: "1px solid #e9ecef",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
            }}
          >
            <p style={{ 
              margin: 0, 
              lineHeight: "1.6", 
              color: "#2c3e50", 
              fontStyle: selectedCourse.description ? 'normal' : 'italic'
            }}>
              {selectedCourse.description || "Không có mô tả khóa học"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;