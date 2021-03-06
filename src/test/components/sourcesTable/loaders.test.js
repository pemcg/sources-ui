import React from 'react';
import { mount } from 'enzyme';
import { RowWrapper } from '@patternfly/react-table';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/cjs/PageHeader';
import { Section } from '@redhat-cloud-services/frontend-components/components/cjs/Section';

import { PlaceHolderTable, RowWrapperLoader, Loader, AppPlaceholder } from '../../../components/SourcesTable/loaders';
import { COLUMN_COUNT } from '../../../views/sourcesViewDefinition';
import { IntlProvider } from 'react-intl';

describe('loaders', () => {
    describe('PlaceholderTable', () => {
        it('renders correctly', () => {
            const wrapper = mount(<PlaceHolderTable />);

            expect(wrapper.find(Spinner)).toHaveLength(1);
            expect(wrapper.find(Bullseye)).toHaveLength(1);
        });
    });

    describe('RowWrapperLoader', () => {
        const row = {
            cells: ['CellText']
        };

        it('renders loader when item is deleting', () => {
            const wrapper = mount(
                <table>
                    <tbody>
                        <RowWrapperLoader row={{ ...row, isDeleting: true }} />
                    </tbody>
                </table>
            );

            expect(wrapper.find(Loader).length).toEqual(1);
            expect(wrapper.find(RowWrapper).length).toEqual(0);
            expect(wrapper.find('td').props().colSpan).toEqual(COLUMN_COUNT);
        });

        it('renders rowWrapper when item is not deleting', () => {
            const wrapper = mount(
                <table>
                    <tbody>
                        <RowWrapperLoader row={row} />
                    </tbody>
                </table>
            );

            expect(wrapper.find(Loader).length).toEqual(0);
            expect(wrapper.find(RowWrapper).length).toEqual(1);
        });
    });

    describe('AppPlaceholder', () => {
        it('renders correctly', () => {
            const wrapper = mount(<IntlProvider locale="en">
                <AppPlaceholder />
            </IntlProvider>
            );

            expect(wrapper.find(PageHeader)).toHaveLength(1);
            expect(wrapper.find(PageHeaderTitle).text()).toEqual(' Sources ');
            expect(wrapper.find(Section)).toHaveLength(1);
            expect(wrapper.find(Loader).length).toEqual(1);
        });
    });
});
