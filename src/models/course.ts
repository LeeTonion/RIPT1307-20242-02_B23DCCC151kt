import { useState, useEffect, useMemo } from 'react';
import { notification } from 'antd';

// Danh sách giảng viên mẫu
export const instructors: API.InstructorsList = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];

export default function Course() {
  const [courses, setCourses] = useState<API.Course[]>([]);
  const [filterInstructor, setFilterInstructor] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"Đang mở" | "Đã kết thúc" | "Tạm dừng" | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  // Thêm khóa học mới
  const addCourse = (newCourse: API.Course) => {
    if (isCourseNameDuplicate(newCourse.name)) {
      notification.error({
        message: "Lỗi",
        description: `Tên khóa học "${newCourse.name}" đã tồn tại! Vui lòng chọn tên khác.`,
      });
      return false;
    }

    setCourses([...courses, newCourse]);
    notification.success({
      message: "Thành công",
      description: `Khóa học "${newCourse.name}" đã được thêm thành công!`,
    });
    return true;
  };

  // Cập nhật khóa học
  const updateCourse = (updatedCourse: API.Course) => {
    if (isCourseNameDuplicate(updatedCourse.name, updatedCourse.id)) {
      notification.error({
        message: "Lỗi",
        description: `Tên khóa học "${updatedCourse.name}" đã tồn tại! Vui lòng chọn tên khác.`,
      });
      return false;
    }

    setCourses(courses.map((course) => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
    notification.success({
      message: "Thành công",
      description: `Khóa học "${updatedCourse.name}" đã được cập nhật thành công!`,
    });
    return true;
  };

  // Xóa khóa học
  const deleteCourse = (course: API.Course) => {
    if (course.students > 0) {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa khóa học có học viên!",
      });
      return false;
    }
    
    setCourses(courses.filter((c) => c.id !== course.id));
    notification.success({
      message: "Thành công",
      description: `Khóa học "${course.name}" đã được xóa thành công!`,
    });
    return true;
  };

  // Thay đổi trạng thái khóa học
  const changeCourseStatus = (course: API.Course, newStatus: "Đang mở" | "Đã kết thúc" | "Tạm dừng") => {
    if (course.status === newStatus) {
      notification.warning({
        message: "Cảnh báo",
        description: `Khóa học đã ở trạng thái '${newStatus}'!`,
      });
      return false;
    }

    if (newStatus === "Đang mở" && course.students <= 0) {
      notification.error({
        message: "Lỗi",
        description: "Khóa học cần có ít nhất 1 học viên để mở lại!",
      });
      return false;
    }

    const updatedCourses = courses.map((c) =>
      c.id === course.id ? { ...c, status: newStatus } : c
    );

    setCourses(updatedCourses);
    notification.success({
      message: "Thành công",
      description: `Khóa học "${course.name}" đã được chuyển sang trạng thái '${newStatus}'!`,
    });
    return true;
  };

  return {
    courses,
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
    addCourse,
    updateCourse,
    deleteCourse,
    changeCourseStatus,
    isCourseNameDuplicate,
  };
};