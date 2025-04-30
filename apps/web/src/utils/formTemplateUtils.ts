import { rgb } from 'pdf-lib';

//colors for group buttons: colors[0] = border/text color, colors[1] = background color
export const groupColors = [
  ['#1367EA', '#EEF5FF'],
  ['#BD21CA', '#FDEAFF'],
  ['#7645E8', '#ECE4FF'],
  ['#567E26', '#EDFFD6'],
  ['#A16308', '#FFFDDB'],
];

// used by pdf lib 
export const groupRgbColors = [
  [rgb(19 / 255, 103 / 255, 234 / 255), rgb(238 / 255, 245 / 255, 255 / 255)],
  [rgb(189 / 255, 3 / 2553, 202 / 255), rgb(253 / 255, 234 / 255, 255 / 255)],
  [rgb(118 / 255, 69 / 255, 23 / 255), rgb(236 / 255, 228 / 255, 255 / 255)],
  [rgb(86 / 255, 126 / 255, 38 / 255), rgb(237 / 255, 255 / 255, 214 / 255)],
  [rgb(161 / 255, 99 / 255, 8 / 255), rgb(255 / 255, 253 / 255, 219 / 255)],
];
