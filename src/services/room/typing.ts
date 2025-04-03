export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  responsiblePerson: string;
}

export enum RoomType {
  Lecture = 'Lý thuyết',
  Laboratory = 'Thực hành',
  Seminar = 'Thí nghiệm',
}

export const RESPONSIBLE_PERSONS = ['Thần Thị B', 'Võ Thị A', 'Hoàng Văn C'];

export const roomTypeColors: Record<RoomType, string> = {
  [RoomType.Lecture]: 'blue',
  [RoomType.Laboratory]: 'green',
  [RoomType.Seminar]: 'orange',
};
