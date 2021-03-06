import React from 'react';
import { mount } from 'enzyme';
import { Button } from '@patternfly/react-core';
import configureStore from 'redux-mock-store';
import { Route } from 'react-router-dom';
import { Text } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import ApplicationList from '../../../components/ApplicationsList/ApplicationList';
import { sourceTypesData } from '../../__mocks__/sourceTypesData';
import { sourcesDataGraphQl, SOURCE_ALL_APS_ID, SOURCE_ONE_APS_ID } from '../../__mocks__/sourcesData';
import { applicationTypesData } from '../../__mocks__/applicationTypesData';
import { replaceRouteId, routes } from '../../../Routes';

describe('ApplicationList', () => {
    let store;
    let mockStore;
    let initialProps;
    let spySetApp;
    let initialEntry;
    let initialStore;

    beforeEach(() => {
        initialStore = {
            sources: {
                entities: sourcesDataGraphQl,
                appTypes: applicationTypesData.data,
                sourceTypes: sourceTypesData.data
            }
        };
        mockStore = configureStore();
        store = mockStore(initialStore);
        spySetApp = jest.fn();

        initialProps = {
            setApplicationToRemove: spySetApp
        };
    });

    afterEach(() => {
        spySetApp.mockReset();
    });

    it('renders correctly with application', () => {
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ONE_APS_ID)];

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <ApplicationList {...initialProps} { ...args }/> } />,
            store,
            initialEntry
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === SOURCE_ONE_APS_ID);
        const applicationType = applicationTypesData.data.find((x) => x.id === source.applications[0].application_type_id);

        expect(wrapper.find(Text).first().text()).toEqual(applicationType.display_name);
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    it('renders correctly with prefix', () => {
        const PREFIX = '##';
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ONE_APS_ID)];

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <ApplicationList {...initialProps} { ...args } namePrefix={PREFIX}/> } />,
            store,
            initialEntry
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === SOURCE_ONE_APS_ID);
        const applicationType = applicationTypesData.data.find((x) => x.id === source.applications[0].application_type_id);

        expect(wrapper.find(Text).first().text()).toEqual(`${PREFIX}${applicationType.display_name}`);
    });

    it('renders correctly with applications', () => {
        initialEntry = [replaceRouteId(routes.sourceManageApps.path, SOURCE_ALL_APS_ID)];

        const wrapper = mount(componentWrapperIntl(
            <Route path={routes.sourceManageApps.path} render={ (...args) => <ApplicationList {...initialProps} { ...args }/> } />,
            store,
            initialEntry
        ));

        const source = sourcesDataGraphQl.find((x) => x.id === SOURCE_ALL_APS_ID);
        const applicationType = applicationTypesData.data.find((x) => x.id === source.applications[0].application_type_id);
        const applicationType1 = applicationTypesData.data.find((x) => x.id === source.applications[1].application_type_id);
        const applicationType2 = applicationTypesData.data.find((x) => x.id === source.applications[2].application_type_id);

        expect(wrapper.find(Text).first().text()).toEqual(applicationType.display_name);
        expect(wrapper.find(Text).at(1).text()).toEqual(applicationType1.display_name);
        expect(wrapper.find(Text).last().text()).toEqual(applicationType2.display_name);
        expect(wrapper.find(Button)).toHaveLength(3);
    });
});
