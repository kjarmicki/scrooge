function copyMonthAndYear(date: Date): Date {
  const copied = new Date();
  copied.setFullYear(date.getFullYear());
  copied.setMonth(date.getMonth());
  return copied;
}

export function onNthDayInCurrentMonth(date: Date, day: number): Date {
  const adjusted = copyMonthAndYear(date);
  adjusted.setDate(day);
  return adjusted;
}

export function onLastDayInPreviousMonth(date: Date): Date {
  const adjusted = copyMonthAndYear(date);
  adjusted.setDate(-1);
  return adjusted;
}
