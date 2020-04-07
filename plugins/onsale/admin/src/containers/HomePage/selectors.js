import { createSelector } from 'reselect';
import pluginId from '../../pluginId';

const selectHomePageDomain = () => state => state.get(`${pluginId}_homePage`);

const selectHomePage = () => createSelector(
  selectHomePageDomain(),
  (substate) => substate.toJS()
);

export default selectHomePage;