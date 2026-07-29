export interface RoomObject {
  id: string;
  name: string;
  description: string;
  svgFileName: string;
  // Bounding box defined in percentages (0-100) relative to the background image
  x: number; 
  y: number;
  width: number;
  height: number;
  // Isometric depth sorting
  zIndex: number;
  // Camera focus settings (where the camera should center and zoom when clicked)
  focusX: number;
  focusY: number;
  focusScale: number;
}

export const OBJECT_REGISTRY: RoomObject[] = [
  {
    id: 'telescope',
    name: 'Telescope',
    description: 'Look into the vast cosmos.',
    svgFileName: 'telescope.svg',
    x: 47.42, y: 33.39, width: 8.79, height: 19.33,
    zIndex: 15,
    focusX: 45, focusY: 41, focusScale: 2.5,
  },
  {
    id: 'desk',
    name: 'Work Desk',
    description: 'Where the real work happens.',
    svgFileName: 'work desk.svg',
    x: 54.78, y: 33.49, width: 23.44, height: 35.64,
    zIndex: 10,
    focusX: 63, focusY: 53, focusScale: 2.0,
  },
  {
    id: 'journal',
    name: 'Captain\'s Journal',
    description: 'Chronicles of the journey.',
    svgFileName: 'book.svg',
    x: 47.37, y: 70.89, width: 3.13, height: 4.25,
    zIndex: 25,
    focusX: 37, focusY: 67, focusScale: 4.0,
  },
  {
    id: 'bookshelf',
    name: 'Library',
    description: 'Ancient tomes and modern manuals.',
    svgFileName: 'book-shelf.svg',
    x: 34.84, y: 12.17, width: 23.83, height: 44.68,
    zIndex: 5,
    focusX: 36.5, focusY: 32, focusScale: 2.0,
  },
  {
    id: 'bed',
    name: 'Resting Quarters',
    description: 'A cozy spot for reading and resting.',
    svgFileName: 'bed.svg',
    x: 28.37, y: 40.48, width: 27.02, height: 33.58,
    zIndex: 20,
    focusX: 32.5, focusY: 57, focusScale: 2.0,
  },
  {
    id: 'camera',
    name: 'Vintage Camera',
    description: 'Capture the moment with the photobooth.',
    svgFileName: 'camera.svg',
    x: 54.79, y: 42.79, width: 6.32, height: 16.17,
    zIndex: 30,
    focusX: 51.5, focusY: 46, focusScale: 3.0,
  }
];
