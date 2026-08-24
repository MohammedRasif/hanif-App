import type { ServiceItem } from "./types";

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: "1",
    name: "Face wash",
    duration: "30 min",
    price: "$51",
    category: "Skin Care",
    description: "Bring a new stylist onto the team.",
    staff: ["Jhon", "doe", "doi", "kimiko"],
  },
  {
    id: "2",
    name: "Face wash",
    duration: "30 min",
    price: "$51",
    category: "Skin Care",
    description: "Deep pore cleansing and exfoliating face wash.",
    staff: ["Jhon", "doe", "doi"],
  },
  {
    id: "3",
    name: "Face wash",
    duration: "30 min",
    price: "$51",
    category: "Skin Care",
    description: "Herbal refreshing face wash with hot towel treatment.",
    staff: ["Jhon", "kimiko"],
  },
  {
    id: "4",
    name: "Hair Cut & Style",
    duration: "40 min",
    price: "$85",
    category: "Hair",
    description: "Classic haircut with custom fade and styling.",
    staff: ["Jhon", "doe", "Isaac"],
  },
  {
    id: "5",
    name: "Beard Trim & Shape",
    duration: "25 min",
    price: "$45",
    category: "Beard",
    description: "Hot towel finish with precision beard edge trim.",
    staff: ["doi", "kimiko"],
  },
];

export const MOCK_CATEGORIES = [
  "Skin Care",
  "Hair",
  "Beard",
  "Facial",
  "Special Care",
];

export const MOCK_STAFF_OPTIONS = [
  "Jhon",
  "doe",
  "doi",
  "kimiko",
  "Alex",
  "Sarah",
  "Isaac",
];
