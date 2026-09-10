export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten_free' | 'spicy' | 'halal';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // category id
  image?: string;
  dietary?: DietaryTag[];
  allergens?: string[]; // e.g. ['A', 'G', 'C']
  isChefSpecial?: boolean;
  isDailySpecial?: boolean;
  isAvailable: boolean;
  portionSize?: string; // e.g. "für 2 Personen", "300g", "0,75l"
  calories?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface OpeningHourDay {
  day: string; // "Montag", "Dienstag", etc.
  dayShort: string; // "Mo", "Di", etc.
  hours: string; // e.g. "11:30 - 14:30, 17:30 - 22:30"
  isClosed?: boolean;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  cuisine: string;
  storyTitle: string;
  storyText: string;
  phone: string;
  email: string;
  address: {
    street: string;
    zipCity: string;
    note?: string;
  };
  openingHours: OpeningHourDay[];
  currency: string;
  announcement?: string;
  showAnnouncement: boolean;
  heroImage: string;
  aboutImage: string;
}

export interface TableReservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'confirmed' | 'pending';
  createdAt: string;
}
