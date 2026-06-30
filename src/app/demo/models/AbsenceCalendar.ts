export class AbsenceSession {
  classe: string;
  subject: string;
  room: string;
  time: string;
  color: string;
  _apiId?: string;

  constructor(classe: string, subject: string, room: string, time: string, color: string, _apiId?: string) {
    this.classe = classe;
    this.subject = subject;
    this.room = room;
    this.time = time;
    this.color = color;
    this._apiId = _apiId;
  }
}

export class CalendarDay {
  num: number;
  date: string;
  out: boolean;
  today: boolean;
  entries: AbsenceSession[];

  constructor(num: number, date: string, out: boolean, today: boolean, entries: AbsenceSession[]) {
    this.num = num;
    this.date = date;
    this.out = out;
    this.today = today;
    this.entries = entries;
  }
}

export class CalendarWeek {
  jours: CalendarDay[];

  constructor(jours: CalendarDay[]) {
    this.jours = jours;
  }
}
