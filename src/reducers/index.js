import { combineReducers } from 'redux';
import layers from './layers';
import settings from './settings';

export default combineReducers({
  layers,
  settings,
});
