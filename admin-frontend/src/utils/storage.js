// Student storage utilities
export const getStudents = (className) => {
  const key = className === 'Pre-KG' ? 'students_preKG' : 
              className === 'LKG' ? 'students_lkg' : 'students_ukg';
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const saveStudents = (className, students) => {
  const key = className === 'Pre-KG' ? 'students_preKG' : 
              className === 'LKG' ? 'students_lkg' : 'students_ukg';
  localStorage.setItem(key, JSON.stringify(students));
};

export const generateAdmissionNumber = (className) => {
  const prefix = className === 'Pre-KG' ? 'PKG' : className === 'LKG' ? 'LKG' : 'UKG';
  const students = getStudents(className);
  const nextNumber = String(students.length + 1).padStart(3, '0');
  return `${prefix}${nextNumber}`;
};

export const getAllStudents = () => {
  return {
    preKG: getStudents('Pre-KG'),
    lkg: getStudents('LKG'),
    ukg: getStudents('UKG')
  };
};