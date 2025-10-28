export class TimeRange {
  private start: number;
  private end: number;

  constructor(start: string, end: string) {
    this.start = this.timeToNumber(start);
    this.end = this.timeToNumber(end);
    this.validate();
  }

  private timeToNumber(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 100 + minutes;
  }

  private validate(): void {
    if (this.start < 0 || this.start > 2359 || this.end < 0 || this.end > 2359) {
      throw new Error("Invalid time range");
    }
    if (this.start >= this.end) {
      throw new Error("Start time must be before end time");
    }
    if ((this.end - this.start) < 15) {
      throw new Error("Time range must be at least 15 minutes");
    }
  }

  getStart(): number {
    return this.start;
  }

  getEnd(): number {
    return this.end;
  }

  includes(time: number): boolean {
    return time >= this.start && time <= this.end;
  }
}