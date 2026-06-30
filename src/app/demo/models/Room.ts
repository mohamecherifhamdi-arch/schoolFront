export class Room {
  id?: string;
  code?: string;
  nom?: string;
  capacite?: number;
  batiment?: string;
  etage?: number;
  statut?: string;
  equipement?: string[];
  constructor(id?: string, code: string = '', nom: string = '', capacite: number = 0, batiment: string = '', etage: number = 0, statut: string = 'Disponible', equipement: string[] = []) {
    this.id = id;
    this.code = code;
    this.nom = nom;
    this.capacite = capacite;
    this.batiment = batiment;
    this.etage = etage;
    this.statut = statut;
    this.equipement = equipement;
  } 
}