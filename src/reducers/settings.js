import { settings as settingsData } from '../data/ActiveSettings';

const initialSettings = settingsData;

const settings = (state = initialSettings, action) => {
  switch (action.type) {
    case 'UPDATE':
      return { ...action.settings };
    default:
      return state;
  }
};

export default settings;
