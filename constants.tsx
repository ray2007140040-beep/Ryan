
import { TechPack } from './types';

export const COLORS = {
  background: '#000000',
  surface: '#1A1A1A',
  primary: '#E60012',
  textPrimary: '#F2F2F2',
  textSecondary: '#8E8E93',
};

export const TECH_PACK_LIBRARY: TechPack[] = [
  {
    id: 'tp1',
    title: '拳法基础单元 (Boxing Basics)',
    category: '站立打击',
    origin: 'official',
    can_edit: false,
    levels: {
      l1: {
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        actions: [
            { 
              id: 'a1', 
              name: '前手刺拳 (Jab)', 
              videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
              steps: ['前脚微向前迈步', '拳头直线击出并旋转', '击打后迅速收回至下颌']
            },
            { 
              id: 'a2', 
              name: '后手直拳 (Cross)', 
              steps: ['后脚蹬地转胯', '核心发力带动拳头击出', '身体重心保持在中线']
            }
        ],
        points: ['核心收紧', '手部快速回防'],
        methods: [{ id: 'm1', name: '镜前空击', description: '校正发力点' }],
        steps: []
      },
      l2: { actions: [], points: [], methods: [], steps: [] },
      l3: { actions: [], points: [], methods: [], steps: [] }
    }
  },
  {
    id: 'tp_private_1',
    title: '本馆特色内围缠抱 (Gym Clinch)',
    category: '泰拳内围',
    origin: 'private',
    owner_gym_id: 'gym_001',
    can_edit: true,
    levels: {
      l1: {
        actions: [
            { id: 'pa1', name: '内围控制 (Plum)', steps: ['双手扣住对手后脑', '肘部向内收紧控制重心'] }
        ],
        points: ['利用身体重量', '破坏对手平衡'],
        methods: [{ id: 'pm1', name: '双人控项练习', description: '场馆特色专项' }],
        steps: []
      },
      l2: { actions: [], points: [], methods: [], steps: [] },
      l3: { actions: [], points: [], methods: [], steps: [] }
    }
  }
];
