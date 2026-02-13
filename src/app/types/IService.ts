export interface IService extends Document {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  pricePerHour: number;
  rating: number;
  reviews: number;
  image: string;
  icon: any;
  createdAt: Date;
  updatedAt: Date;
}
