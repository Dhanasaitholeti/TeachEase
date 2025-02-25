interface Period {
    time: string;
    classAssigned: string;
    status: 'Teaching' | 'Vacant' | 'Lunch';
  }
  
  interface DaySchedule {
    day: string;
    periods: Period[];
  }
  
  const timetable: DaySchedule[] = [
    {
      day: 'Monday',
      periods: [
        { time: '08:00 - 09:00', classAssigned: 'Class 5A', status: 'Teaching' },
        { time: '09:00 - 10:00', classAssigned: 'Class 6B', status: 'Teaching' },
        { time: '10:00 - 11:00', classAssigned: 'Class 7A', status: 'Teaching' },
        { time: '11:00 - 12:00', classAssigned: '', status: 'Vacant' },
        { time: '12:00 - 01:00', classAssigned: '', status: 'Lunch' },
        { time: '01:00 - 02:00', classAssigned: 'Class 8C', status: 'Teaching' },
        { time: '02:00 - 03:00', classAssigned: 'Class 9A', status: 'Teaching' },
        { time: '03:00 - 04:00', classAssigned: '', status: 'Vacant' },
      ],
    },
    {
      day: 'Tuesday',
      periods: [
        { time: '08:00 - 09:00', classAssigned: 'Class 5B', status: 'Teaching' },
        { time: '09:00 - 10:00', classAssigned: 'Class 6A', status: 'Teaching' },
        { time: '10:00 - 11:00', classAssigned: 'Class 7B', status: 'Teaching' },
        { time: '11:00 - 12:00', classAssigned: '', status: 'Vacant' },
        { time: '12:00 - 01:00', classAssigned: '', status: 'Lunch' },
        { time: '01:00 - 02:00', classAssigned: 'Class 8A', status: 'Teaching' },
        { time: '02:00 - 03:00', classAssigned: 'Class 9B', status: 'Teaching' },
        { time: '03:00 - 04:00', classAssigned: '', status: 'Vacant' },
      ],
    },
    {
        day: 'Wednesday',
        periods: [
          { time: '08:00 - 09:00', classAssigned: 'Class 5B', status: 'Teaching' },
          { time: '09:00 - 10:00', classAssigned: 'Class 6A', status: 'Teaching' },
          { time: '10:00 - 11:00', classAssigned: 'Class 7B', status: 'Teaching' },
          { time: '11:00 - 12:00', classAssigned: '', status: 'Vacant' },
          { time: '12:00 - 01:00', classAssigned: '', status: 'Lunch' },
          { time: '01:00 - 02:00', classAssigned: 'Class 8A', status: 'Teaching' },
          { time: '02:00 - 03:00', classAssigned: 'Class 9B', status: 'Teaching' },
          { time: '03:00 - 04:00', classAssigned: '', status: 'Vacant' },
        ],
      },
      {
        day: 'Thursday',
        periods: [
          { time: '08:00 - 09:00', classAssigned: 'Class 5B', status: 'Teaching' },
          { time: '09:00 - 10:00', classAssigned: 'Class 6A', status: 'Teaching' },
          { time: '10:00 - 11:00', classAssigned: 'Class 7B', status: 'Teaching' },
          { time: '11:00 - 12:00', classAssigned: '', status: 'Vacant' },
          { time: '12:00 - 01:00', classAssigned: '', status: 'Lunch' },
          { time: '01:00 - 02:00', classAssigned: 'Class 8A', status: 'Teaching' },
          { time: '02:00 - 03:00', classAssigned: 'Class 9B', status: 'Teaching' },
          { time: '03:00 - 04:00', classAssigned: '', status: 'Vacant' },
        ],
      },
      {
        day: 'Friday',
        periods: [
          { time: '08:00 - 09:00', classAssigned: 'Class 5B', status: 'Teaching' },
          { time: '09:00 - 10:00', classAssigned: 'Class 6A', status: 'Teaching' },
          { time: '10:00 - 11:00', classAssigned: 'Class 7B', status: 'Teaching' },
          { time: '11:00 - 12:00', classAssigned: '', status: 'Vacant' },
          { time: '12:00 - 01:00', classAssigned: '', status: 'Lunch' },
          { time: '01:00 - 02:00', classAssigned: 'Class 8A', status: 'Teaching' },
          { time: '02:00 - 03:00', classAssigned: 'Class 9B', status: 'Teaching' },
          { time: '03:00 - 04:00', classAssigned: '', status: 'Vacant' },
        ],
      },
      {
        day: 'Saturday',
        periods: [
          { time: '08:00 - 09:00', classAssigned: 'Class 5B', status: 'Teaching' },
          { time: '09:00 - 10:00', classAssigned: 'Class 6A', status: 'Teaching' },
          { time: '10:00 - 11:00', classAssigned: 'Class 7B', status: 'Teaching' },
          { time: '11:00 - 12:00', classAssigned: '', status: 'Vacant' },
          { time: '12:00 - 01:00', classAssigned: '', status: 'Lunch' },
          { time: '01:00 - 02:00', classAssigned: 'Class 8A', status: 'Teaching' },
          { time: '02:00 - 03:00', classAssigned: 'Class 9B', status: 'Teaching' },
          { time: '03:00 - 04:00', classAssigned: '', status: 'Vacant' },
        ],
      },

    // Repeat similar structure for Wednesday to Saturday
  ];
  
  import React from 'react';
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/app/component/ui/table';

  
  const Timetable: React.FC = () => {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Teacher's Timetable</h1>
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <TableCaption className="text-lg font-medium">Weekly Schedule</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead className="px-4 py-2 border border-gray-300 text-left">Day</TableHead>
                {timetable[0].periods.map((period, index) => (
                  <TableHead key={index} className="px-4 py-2 border border-gray-300 text-left">
                    {period.time}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetable.map((daySchedule, dayIndex) => (
                <TableRow
                  key={dayIndex}
                  className={`text-center ${dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <TableCell className="px-4 py-2 border border-gray-300 font-medium text-left">
                    {daySchedule.day}
                  </TableCell>
                  {daySchedule.periods.map((period, periodIndex) => (
                    <TableCell
                      key={periodIndex}
                      className={`px-4 py-2 border border-gray-300 text-left ${
                        period.status === 'Lunch'
                          ? 'bg-green-100 text-green-800'
                          : period.status === 'Vacant'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-white'
                      }`}
                    >
                      {period.status === 'Teaching' ? (
                        <div className="text-sm">{period.classAssigned}</div>
                      ) : (
                        <div className="text-sm">{period.status}</div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  
  
  export default Timetable;
  