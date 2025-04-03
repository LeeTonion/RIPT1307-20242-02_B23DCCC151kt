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

export enum RoomType {
  Theory = 'Lý thuyết',
  Practice = 'Thực hành',
  Hall = 'Hội trường',
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  responsiblePerson: string;
}

export interface StatisticProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
}

export interface Statistics {
  totalRooms: number;
  totalCapacity: number;
  roomsByType: Record<string, number>;
}

export const RESPONSIBLE_PERSONS = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
export const STORAGE_KEY = 'classrooms';

export const roomTypeColors = {
  [RoomType.Theory]: 'blue',
  [RoomType.Practice]: 'green',
  [RoomType.Hall]: 'purple',
};