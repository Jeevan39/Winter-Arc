import React from 'react';
import {
  Sun,
  Dumbbell,
  Brain,
  BookOpen,
  Code,
  Droplets,
  Moon,
  Flame,
  Heart,
  Bed,
  GraduationCap,
  Music,
  Apple,
  Bike,
  Target,
  Mountain,
  Snowflake,
  Shield,
  Zap,
  Coffee,
  Footprints,
  PenTool,
  Sparkles,
  Smile,
  Compass,
  Trophy,
  Eye,
  ShieldAlert,
  Utensils,
  Wind,
  Clock,
  Scale,
  BatteryCharging,
  Camera,
  Activity,
  LucideProps,
} from 'lucide-react';

export interface IconOption {
  name: string;
  label: string;
  category: 'mind' | 'body' | 'focus' | 'lifestyle';
}

export const ICON_OPTIONS: IconOption[] = [
  { name: 'Sun', label: 'Wake Early', category: 'lifestyle' },
  { name: 'Dumbbell', label: 'Gym / Lift', category: 'body' },
  { name: 'Brain', label: 'Meditation', category: 'mind' },
  { name: 'BookOpen', label: 'Reading', category: 'mind' },
  { name: 'Code', label: 'Coding / Tech', category: 'focus' },
  { name: 'Droplets', label: 'Hydration', category: 'body' },
  { name: 'Moon', label: 'Sleep Early', category: 'lifestyle' },
  { name: 'Flame', label: 'Cardio / Calorie', category: 'body' },
  { name: 'Heart', label: 'Health & Care', category: 'body' },
  { name: 'Snowflake', label: 'Cold Discipline', category: 'lifestyle' },
  { name: 'GraduationCap', label: 'Study / Learn', category: 'focus' },
  { name: 'Target', label: 'Deep Focus', category: 'focus' },
  { name: 'Mountain', label: 'Endurance', category: 'body' },
  { name: 'PenTool', label: 'Journaling', category: 'mind' },
  { name: 'Apple', label: 'Clean Food', category: 'body' },
  { name: 'Utensils', label: 'Intermittent Fast', category: 'body' },
  { name: 'ShieldAlert', label: 'No Social Media', category: 'mind' },
  { name: 'Footprints', label: '10k Steps', category: 'body' },
  { name: 'Bike', label: 'Cycling', category: 'body' },
  { name: 'Music', label: 'Music Practice', category: 'lifestyle' },
  { name: 'Coffee', label: 'Morning Ritual', category: 'lifestyle' },
  { name: 'Wind', label: 'Breathwork', category: 'mind' },
  { name: 'Sparkles', label: 'Gratitude', category: 'mind' },
  { name: 'Shield', label: 'Discipline', category: 'mind' },
  { name: 'Zap', label: 'Energy Rush', category: 'focus' },
  { name: 'Clock', label: 'Time Boxing', category: 'focus' },
  { name: 'Compass', label: 'Vision Planning', category: 'focus' },
  { name: 'Trophy', label: 'Win Daily', category: 'lifestyle' },
  { name: 'Bed', label: '8h Sleep', category: 'lifestyle' },
  { name: 'Scale', label: 'Balance', category: 'mind' },
  { name: 'BatteryCharging', label: 'Recharge', category: 'lifestyle' },
  { name: 'Activity', label: 'Vitals', category: 'body' },
  { name: 'Camera', label: 'Daily Photo', category: 'lifestyle' },
  { name: 'Eye', label: 'Visualization', category: 'mind' },
];

export const HABIT_COLORS = [
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#38bdf8', name: 'Ice Blue' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#ec4899', name: 'Rose' },
  { hex: '#06b6d4', name: 'Cyan' },
  { hex: '#ef4444', name: 'Crimson' },
  { hex: '#3b82f6', name: 'Cobalt' },
  { hex: '#84cc16', name: 'Lime' },
  { hex: '#eab308', name: 'Gold' },
];

interface HabitIconProps extends LucideProps {
  name: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Sun': return <Sun {...props} />;
    case 'Dumbbell': return <Dumbbell {...props} />;
    case 'Brain': return <Brain {...props} />;
    case 'BookOpen': return <BookOpen {...props} />;
    case 'Code': return <Code {...props} />;
    case 'Droplets': return <Droplets {...props} />;
    case 'Moon': return <Moon {...props} />;
    case 'Flame': return <Flame {...props} />;
    case 'Heart': return <Heart {...props} />;
    case 'Snowflake': return <Snowflake {...props} />;
    case 'GraduationCap': return <GraduationCap {...props} />;
    case 'Target': return <Target {...props} />;
    case 'Mountain': return <Mountain {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'Apple': return <Apple {...props} />;
    case 'Utensils': return <Utensils {...props} />;
    case 'ShieldAlert': return <ShieldAlert {...props} />;
    case 'Footprints': return <Footprints {...props} />;
    case 'Bike': return <Bike {...props} />;
    case 'Music': return <Music {...props} />;
    case 'Coffee': return <Coffee {...props} />;
    case 'Wind': return <Wind {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'Shield': return <Shield {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'Compass': return <Compass {...props} />;
    case 'Trophy': return <Trophy {...props} />;
    case 'Bed': return <Bed {...props} />;
    case 'Scale': return <Scale {...props} />;
    case 'BatteryCharging': return <BatteryCharging {...props} />;
    case 'Activity': return <Activity {...props} />;
    case 'Camera': return <Camera {...props} />;
    case 'Eye': return <Eye {...props} />;
    default: return <Target {...props} />;
  }
};
