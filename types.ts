
import { Type } from "@google/genai";
export { Type };

export type Role = 'admin' | 'coach' | 'student';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  gymName?: string;
}

export interface TrainingMethod {
  id: string;
  name: string;
  description: string;
}

export interface SubAction {
  id: string;
  name: string;
  videoUrl?: string; 
  steps: string[]; // 关联的执行步骤：每个细分动作拥有独立的步骤
}

/**
 * TechLevel represents a specific mastery level within a TechPack.
 */
export interface TechLevel {
  points: string[];
  methods: TrainingMethod[];
  actions: SubAction[]; 
  videoUrl?: string; 
  steps: string[]; 
}

export interface TechPack {
  id: string;
  title: string;
  category: string;
  origin: 'official' | 'private'; // 'official' = Combat Bible, 'private' = Gym's own
  owner_gym_id?: string;
  can_edit: boolean; // Official content is generally false for gym owners
  levels: {
    l1: TechLevel;
    l2: TechLevel;
    l3: TechLevel;
  };
}

export interface Klass {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  startDate?: string; 
  endDate?: string;   
  days: number[]; 
  student_count: number;
  level_tag: string;
  coach_ids?: string[];      // 主讲教练 IDs
  assistant_ids?: string[];  // 助教 IDs
}

export type TrainingMode = 'shadow' | 'props' | 'bag' | 'mitts' | 'partner' | 'custom';

export interface PlannedItem {
  pack_id: string;
  custom_title?: string; 
  level: 'l1' | 'l2' | 'l3';
  selected_method_id?: string;
  frequency: string;
  reps: string;
  duration: number;
  training_mode?: TrainingMode; 
  custom_training_mode?: string; 
  selected_action_ids?: string[]; 
}

export type ComplianceStatus = 'normal' | 'deviation';

export interface Lesson {
  id: string;
  klass_id: string;
  date: string; 
  coach_id: string;
  planned_items: PlannedItem[];
  status: 'planning' | 'ongoing' | 'completed';
}

export interface FeedbackRecord {
  id: string;
  studentName: string;
  className: string;
  date: string;
  intensity: number; 
  experience: number; 
  tags?: string[];
  packIds?: string[]; 
}

export interface CoachStats {
  id: string;
  name: string;
  avatar?: string; 
  level: string; 
  joinDate: string;
  complianceRate: number; 
  preparationRate: number; 
  avgExperience: number; 
  avgIntensity: number; 
  feedbackHistory: FeedbackRecord[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'coach' | 'admin' | 'reception';
  joinDate: string;
  status: 'active' | 'inactive';
  phone?: string;
}
