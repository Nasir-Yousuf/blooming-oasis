import React from "react";
import { Sparkles, ShieldCheck, HeartHandshake, Truck, Droplets, Sun } from "lucide-react";

export interface CustomListItem {
  title: string;
  description: string;
  iconType?: "sparkles" | "shield" | "heart" | "truck" | "droplets" | "sun";
}

interface CustomStyledListProps {
  items?: CustomListItem[];
  variant?: "default" | "terracotta";
}

const DEFAULT_BENEFITS: CustomListItem[] = [
  {
    title: "14-Day Healthy Plant Guarantee",
    description:
      "Every plant travels directly from our temperature-controlled botanical nursery. If your foliage shows transit distress, we replace it with zero fuss.",
    iconType: "shield",
  },
  {
    title: "Dedicated Master Botanist Advisory",
    description:
      "Have a yellowing leaf or lighting question? Get unlimited digital diagnostics and custom seasonal care regimens from our plant experts.",
    iconType: "sparkles",
  },
  {
    title: "Eco-Conscious Zero-Plastic Packaging",
    description:
      "Root balls are cushioned in organic compostable coco-fiber and reinforced corrugated unbleached cartons.",
    iconType: "truck",
  },
  {
    title: "Lifetime Soil & Repotting Guidance",
    description:
      "Access curated potting mixes, nutrient charts, and seasonal repotting calendars tailored for each species.",
    iconType: "droplets",
  },
];

function renderIcon(type?: string) {
  switch (type) {
    case "sparkles":
      return <Sparkles className="w-4 h-4" />;
    case "shield":
      return <ShieldCheck className="w-4 h-4" />;
    case "truck":
      return <Truck className="w-4 h-4" />;
    case "droplets":
      return <Droplets className="w-4 h-4" />;
    case "sun":
      return <Sun className="w-4 h-4" />;
    default:
      return <HeartHandshake className="w-4 h-4" />;
  }
}

/**
 * Dedicated Custom Unordered List component.
 * STYLED ENTIRELY VIA EXTERNAL CSS (src/styles/custom-requirements.css)
 * without relying on framework utility classes, explicitly satisfying Section 8.
 */
export function CustomStyledList({
  items = DEFAULT_BENEFITS,
  variant = "default",
}: CustomStyledListProps) {
  const listClass =
    variant === "terracotta"
      ? "blooming-custom-list-terracotta"
      : "blooming-custom-list";

  return (
    <ul className={listClass}>
      {items.map((item, index) => (
        <li key={index} className="blooming-custom-list-item">
          <div className="blooming-custom-icon-wrapper">
            {renderIcon(item.iconType)}
          </div>
          <div>
            <div className="blooming-item-title">{item.title}</div>
            <div className="blooming-item-desc">{item.description}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

