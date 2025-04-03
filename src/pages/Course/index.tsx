import React, { useState } from "react";
import { instructors } from "@/models/course";
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Space,
  Card,
  Typography,
  Dropdown,
  Menu,
} from "antd";
import { useModel } from "umi";
import CourseForm from "./Form";

const { Title } = Typography;

const CoursePage: React.FC = () => {
  // State và model
  const {
    filteredAndSortedCourses,
    filterInstructor,
    setFilterInstructor,
    filterStatus,
    setFilterStatus,
    searchName,
    setSearchName,
    currentPage,
    setCurrentPage,
    pageSize,
    deleteCourse,
    changeCourseStatus,
  } = useModel('course');

  // State cho modal và form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<API.Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<API.Course | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Mở modal để thêm hoặc chỉnh sửa khóa học
  const openModal = (course?: API.Course) => {
    if (course) {
      setEditingCourse(course);
    } else {
      setEditingCourse(null);
    }
    setIsModalOpen(true);
  };

  // Đóng modal thêm/sửa
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  // Mở modal hiển thị mô tả
  const openDescriptionModal = (course: API.Course) => {
    setSelectedCourse(course);
    setIsDescriptionModalOpen(true);
  };

  // Đóng modal mô tả
  const closeDescriptionModal = () => {
    setIsDescriptionModalOpen(false);
    setSelectedCourse(null);
  };

  // Xử lý xóa khóa học
  const handleDelete = (course: API.Course) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa khóa học này?",
      onOk: () => {
        deleteCourse(course);
      },
    });
  };
// Xử lý thay đổi trạng thái
  const handleStatusChange = (course: API.Course, newStatus: "Đang mở" | "Đã kết thúc" | "Tạm dừng") => {
    const success = changeCourseStatus(course, newStatus);
    if (success && selectedCourse && selectedCourse.id === course.id) {
      setSelectedCourse({ ...course, status: newStatus });
    }
    setIsDropdownOpen(false);
  };

  // Định nghĩa menu cho dropdown
  const statusMenu = (course: API.Course) => (
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
      render: (status: string, record: API.Course) => (
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
      render: (_: any, record: API.Course) => (
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
  const onRow = (record: API.Course) => {
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

        {/* Form Modal */}
        <CourseForm
          isOpen={isModalOpen} 
          onClose={closeModal}
          editingCourse={editingCourse}
        />

        {/* Description Modal */}
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
      </Card>
    </div>
  );
};

export default CoursePage;