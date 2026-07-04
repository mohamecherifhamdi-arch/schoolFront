import { Injectable } from '@angular/core';
import { Classe } from "./classe.service";

@Injectable({ providedIn: 'root' })
export class ValidationUtils {
  checkCompletude(iteam:Classe): boolean
{
  return  (iteam.nom.trim() !== '' && iteam.niveau.trim() !== '' && iteam.filiere.trim() !== '' && iteam.anneeScolaire.trim() !== '') && (iteam.effectif > 0 && Number.isInteger(iteam.effectif) && iteam.effectif <= 1000 && !!iteam.anneeScolaire.match(/^\d{4}\/\d{4}$/) && parseInt(iteam.anneeScolaire.split('/')[1]) === parseInt(iteam.anneeScolaire.split('/')[0]) + 1);
}
}
