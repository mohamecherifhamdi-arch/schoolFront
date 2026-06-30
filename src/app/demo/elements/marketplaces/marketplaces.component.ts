import { Component } from '@angular/core';
import { Marketplace } from '../../models/MarketPlace';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marketplaces',
  imports: [CommonModule],
  templateUrl: './marketplaces.component.html',
  styleUrl: './marketplaces.component.scss' 
})
export default class Marketplaces {
  listMarketPlaces:any[] = [{}];
  modeUpdate:boolean = true;
  ngOnInit()
  {
    this.listMarketPlaces= [
  {
    name: 'Studio Moderne',
    address: 'Tunis, Medina',
    price: 550,
    image: 'https://imganuncios.mitula.net/fond_de_commerce_la_tout_commerce_vente_fond_de_commerce_a_berge_du_lac_8680001742091889966.jpg',
    description: 'Studio Moderne à Tunis Medina',
    ownerName: 'Kaiya George',
    ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    status:"Reserved"
  },
  {
    name: 'Studio Moderne',
    address: 'Tunis, Medina',
    price: 550,
    image: 'https://www.menzili.tn/upload/photos/2023/05/08/11/27/5261v3doi6.jpg',
    description: 'Studio Moderne à Tunis Medina',
    ownerName: 'Kaiya George',
    ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    status:"Open"
  },
  {
    name: 'Studio Moderne',
    address: 'Tunis, Medina',
    price: 550,
    image: 'https://www.menzili.tn/upload/photos/2024/12/18/09/34/5i3s61q921.jpg',
    description: 'Studio Moderne à Tunis Medina',
    ownerName: 'Kaiya George',
    ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    status:"Pending"
  },
  {
    name: 'Studio Moderne',
    address: 'Tunis, Medina',
    price: 550,
    image: 'https://www.menzili.tn/upload/photos/2023/05/08/11/27/5261v3doi6.jpg',
    description: 'Studio Moderne à Tunis Medina',
    ownerName: 'Kaiya George',
    ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
     status:"Pending"
  },
  {
    name: 'Studio Moderne',
    address: 'Tunis, Medina',
    price: 550,
    image: 'https://www.menzili.tn/upload/photos/2023/05/08/11/27/5261v3doi6.jpg',
    description: 'Studio Moderne à Tunis Medina',
    ownerName: 'Kaiya George',
    ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
     status:"Pending"
  },
  {
    name: 'Studio Moderne',
    address: 'Tunis, Medina',
    price: 550,
    image: 'https://www.menzili.tn/upload/photos/2023/05/08/11/27/5261v3doi6.jpg',
    description: 'Studio Moderne à Tunis Medina',
    ownerName: 'Kaiya George',
    ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
     status:"Pending"
  },
  {
    name: 'Studio Moderne',
    address: 'Tunis, Medina',
    price: 550,
    image: 'https://www.menzili.tn/upload/photos/2023/05/08/11/27/5261v3doi6.jpg',
    description: 'Studio Moderne à Tunis Medina',
    ownerName: 'Kaiya George',
    ownerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
     status:"Pending"
  }
];
  }
showDetails()
{}
modify()
{
  this.modeUpdate=true
}
}
