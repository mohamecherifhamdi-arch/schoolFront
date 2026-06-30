export class Reservation {
  id?: string;
  enseignant: any;
  salle: any;
  className: string;
  date: string;
  session: string;
  subject: string;
  constructor(
   enseignant: any = null,
   salle: any = null,
   className: string = '',
   date: string = '',
   session: string = '',
   subject: string = ''
  ) {
   this.enseignant = enseignant;
   this.salle = salle;
   this.className = className;
   this.date = date;
   this.session = session;
   this.subject = subject;
  }
}