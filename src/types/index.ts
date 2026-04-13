export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  posted: string;
  logo: string;
  logoColor: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface SocialLink {
  platform: string;
  href: string;
}
