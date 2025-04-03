import { Classroom } from './typing';

// Service functions for data management
export const getClassrooms = (): Classroom[] => {
  const data = localStorage.getItem('classrooms');
  return data ? JSON.parse(data) : [];
};

export const saveClassrooms = (classrooms: Classroom[]): void => {
  localStorage.setItem('classrooms', JSON.stringify(classrooms));
};