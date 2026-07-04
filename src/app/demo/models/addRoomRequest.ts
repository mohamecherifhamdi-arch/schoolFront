export class AddRoomRequest {
  newRoomName: string;
  newRoomType: string;
  newRoomCapacity: number | null;
  newRoomEquipment: string[];
  newRoomStatus: string;

  constructor(
    newRoomName: string = '',
    newRoomType: string = '',
    newRoomCapacity: number | null = null,
    newRoomEquipment: string[] = [],
    newRoomStatus: string = 'Libre'
  ) {
    this.newRoomName = newRoomName;
    this.newRoomType = newRoomType;
    this.newRoomCapacity = newRoomCapacity;
    this.newRoomEquipment = newRoomEquipment;
    this.newRoomStatus = newRoomStatus;
  }
}