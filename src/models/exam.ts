// src/models/exam.ts
import { AnyAction } from 'redux';

// Định nghĩa kiểu dữ liệu cho state
interface ExamState {
  list: any[]; // Mảng các đề thi
  structures: any[]; // Mảng các cấu trúc đề thi
}

export default {
  namespace: 'exam',
  state: {
    list: [],
    structures: [],
  } as ExamState, // Ép kiểu state với interface
  reducers: {
    saveExam(state: ExamState, { payload }: AnyAction) {
      return { ...state, list: [...state.list, payload] };
    },
    saveStructure(state: ExamState, { payload }: AnyAction) {
      return { ...state, structures: [...state.structures, payload] };
    },
  },
};