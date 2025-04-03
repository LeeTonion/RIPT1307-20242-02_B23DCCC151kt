declare namespace API {
    interface Course {
      id: string;
      name: string;
      instructor: string;
      students: number;
      status: "Đang mở" | "Đã kết thúc" | "Tạm dừng";
      description: string;
    }
  
    type InstructorsList = string[];
  }