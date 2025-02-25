type Subject = string;
type Teacher = string;

interface Period {
  subject: Subject;
  teacher: Teacher;
}

export class TimetableGenerator {
  private periodsPerDay: number;
  private subjects: Subject[];
  private prioritySubjects: Subject[];
  private teachers: Teacher[];
  private days: number;

  constructor(
    periodsPerDay: number,
    subjects: Subject[],
    prioritySubjects: Subject[],
    teachers: Teacher[],
    days: number
  ) {
    this.periodsPerDay = periodsPerDay;
    this.subjects = subjects;
    this.prioritySubjects = prioritySubjects;
    this.teachers = teachers;
    this.days = days;
  }

  generateTimetable(): Period[][] {
    const timetable: Period[][] = [];

    for (let day = 0; day < this.days; day++) {
      const dailyTimetable = this.generateDailyTimetable();
      timetable.push(dailyTimetable);
    }

    return timetable;
  }

  private generateDailyTimetable(): Period[] {
    const timetable: Period[] = [];
    const assignedTeachers: Set<Teacher> = new Set();
    const subjectCount: Map<Subject, number> = new Map();

    for (let i = 0; i < this.periodsPerDay; i++) {
      let subject: Subject;
      if (Math.random() < 0.5 && this.prioritySubjects.length > 0) {
        subject = this.getRandomPrioritySubject(subjectCount);
      } else {
        subject = this.getRandomSubject();
      }

      let teacher = this.getAvailableTeacher(assignedTeachers);

      while (!teacher) {
        assignedTeachers.clear();
        subjectCount.clear();
        timetable.length = 0; 
        i = 0; 
        subject = this.getRandomSubject();
        teacher = this.getAvailableTeacher(assignedTeachers);
      }

      timetable.push({ subject, teacher });
      assignedTeachers.add(teacher);
      if (this.prioritySubjects.includes(subject)) {
        subjectCount.set(subject, (subjectCount.get(subject) || 0) + 1);
      }
    }

    return timetable;
  }

  private getRandomSubject(): Subject {
    const randomIndex = Math.floor(Math.random() * this.subjects.length);
    return this.subjects[randomIndex];
  }

  private getRandomPrioritySubject(
    subjectCount: Map<Subject, number>
  ): Subject {
    const availablePrioritySubjects = this.prioritySubjects.filter(
      (subject) => (subjectCount.get(subject) || 0) < 2
    );
    if (availablePrioritySubjects.length === 0) {
      return this.getRandomSubject();
    }
    const randomIndex = Math.floor(
      Math.random() * availablePrioritySubjects.length
    );
    return availablePrioritySubjects[randomIndex];
  }

  private getAvailableTeacher(
    assignedTeachers: Set<Teacher>
  ): Teacher | undefined {
    const availableTeachers = this.teachers.filter(
      (teacher) => !assignedTeachers.has(teacher)
    );
    if (availableTeachers.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * availableTeachers.length);
    return availableTeachers[randomIndex];
  }
}
