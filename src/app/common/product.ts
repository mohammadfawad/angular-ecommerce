export class Product {

  id: number = 0;
  sku: string = "";
  name: string = "";
  description: string = "";
  unitPrice: number = 0;
  imageUrl: string = "";
  active: boolean = false;
  unitsInStock: number = 0;
  dateCreated: Date = new Date(0, 0, 0);
  lastUpdated: Date = new Date(0, 0, 0);

  constructor() {}
}
