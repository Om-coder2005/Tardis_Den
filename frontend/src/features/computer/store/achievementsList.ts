export type AchievementCategory = 'Exploration' | 'Library' | 'Telescope' | 'Journal' | 'Photobooth' | 'Desktop';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string; // Emoji for simplicity and performance
}

export const ACHIEVEMENTS: Achievement[] = [
  // Exploration
  { id: 'exp_enter', title: 'First Steps', description: 'Enter the observatory for the first time.', category: 'Exploration', icon: '🚪' },
  { id: 'exp_visit_all', title: 'Curious Mind', description: 'Interact with every object in the room.', category: 'Exploration', icon: '🔍' },
  { id: 'exp_rest', title: 'Quiet Reflection', description: 'Spend time in the rest area.', category: 'Exploration', icon: '☕' },

  // Library
  { id: 'lib_first_book', title: 'Avid Reader', description: 'Open your first book from the library.', category: 'Library', icon: '📖' },
  { id: 'lib_search', title: 'Archivist', description: 'Search for a specific title in the library.', category: 'Library', icon: '📚' },

  // Telescope
  { id: 'tel_first_obs', title: 'First Light', description: 'Look through the telescope for the first time.', category: 'Telescope', icon: '🔭' },
  { id: 'tel_planet', title: 'Planetary Observer', description: 'Observe a planet in our solar system.', category: 'Telescope', icon: '🪐' },

  // Journal
  { id: 'jou_first_entry', title: 'Captain\'s Log', description: 'Write your first journal entry.', category: 'Journal', icon: '✍️' },

  // Photobooth
  { id: 'pho_first_photo', title: 'Captured Moment', description: 'Take your first polaroid in the photobooth.', category: 'Photobooth', icon: '📷' },

  // Desktop
  { id: 'des_wallpaper', title: 'Making it Yours', description: 'Customize the desktop wallpaper.', category: 'Desktop', icon: '🖼️' },
  { id: 'des_theme', title: 'Ambiance', description: 'Change the room theme from settings.', category: 'Desktop', icon: '🌙' },
  { id: 'des_launch_all', title: 'System Administrator', description: 'Launch all applications on the desktop.', category: 'Desktop', icon: '💻' },
];
