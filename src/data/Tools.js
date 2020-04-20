import { FiMousePointer, FiEdit2, FiCircle, FiSquare, FiMove, FiCrop } from 'react-icons/fi';
import { FaEraser, FaEyeDropper } from 'react-icons/fa';
import { AiOutlineLine } from 'react-icons/ai';
import { IoMdColorFill } from 'react-icons/io';

const tools = [
  {
    id: 1,
    name: 'Select Tool',
    icon: FiMousePointer,
    isSelected: true,
  },
  {
    id: 2,
    name: 'Pen Tool',
    icon: FiEdit2,
    isSelected: false,
  },
  {
    id: 3,
    name: 'Eraser Tool',
    icon: FaEraser,
    isSelected: false,
  },
  {
    id: 4,
    name: 'Line Tool',
    icon: AiOutlineLine,
    isSelected: false,
  },
  {
    id: 5,
    name: 'Circle Tool',
    icon: FiCircle,
    isSelected: false,
  },
  {
    id: 6,
    name: 'Rectangle Tool',
    icon: FiSquare,
    isSelected: false,
  },
  {
    id: 7,
    name: 'Color fill Tool',
    icon: IoMdColorFill,
    isSelected: false,
  },
  {
    id: 8,
    name: 'Eyedropper Tool',
    icon: FaEyeDropper,
    isSelected: false,
  },
  {
    id: 9,
    name: 'Crop Tool',
    icon: FiCrop,
    isSelected: false,
  },
  {
    id: 10,
    name: 'Move Tool',
    icon: FiMove,
    isSelected: false,
  },
];

export default tools;
