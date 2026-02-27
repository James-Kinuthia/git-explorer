import { LucideIcon } from "lucide-react-native";

export interface StatProps {
    icon: LucideIcon;
    label: string;
    value?: number | null;
    bgClass: string;
    borderClass: string;
    iconClass: string;
};

export interface InfoItemProps{
    condition?: string | null;
    icon: LucideIcon;
    label: string;
    value?: string | null;
    iconClass: string; 
    isLink?: boolean;
}