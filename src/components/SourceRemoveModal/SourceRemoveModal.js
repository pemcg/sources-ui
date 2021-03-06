import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal/Modal';
import { Checkbox } from '@patternfly/react-core/dist/js/components/Checkbox/Checkbox';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

import { removeSource } from '../../redux/sources/actions';
import { useSource } from '../../hooks/useSource';
import { routes } from '../../Routes';

import { bodyVariants, typesWithExtendedText } from './helpers';
import AppListInRemoval from './AppListInRemoval';

const SourceRemoveModal = () => {
    const { push } = useHistory();

    const [acknowledge, setAcknowledge] = useState(false);

    const intl = useIntl();
    const source = useSource();

    const dispatch = useDispatch();

    const { sourceTypes } = useSelector(({ sources }) => sources, shallowEqual);

    const returnToSources = () => push(routes.sources.path);

    const onSubmit = () => {
        returnToSources();
        dispatch(removeSource(source.id, intl.formatMessage({
            id: 'sources.notificationDeleteMessage',
            defaultMessage: `{title} was deleted successfully.`
        }, { title: source.name })));
    };

    const actions = [
        <Button
            id="deleteSubmit" key="submit" variant="danger" type="button" onClick={ onSubmit } isDisabled={!acknowledge}
        >
            <FormattedMessage
                id="sources.deleteConfirm"
                defaultMessage="Remove source and its data"
            />
        </Button>,
        <Button id="deleteCancel" key="cancel" variant="link" type="button" onClick={ returnToSources }>
            <FormattedMessage
                id="sources.deleteCancel"
                defaultMessage="Cancel"
            />
        </Button>
    ];

    const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id)?.name;

    const filteredApps = source.applications.filter(({ isDeleting }) => !isDeleting);

    const body = (
        <TextContent>
            <Text component={ TextVariants.p }>
                {filteredApps.length === 0 && bodyVariants('noApps', { name: source.name })}
                {filteredApps.length > 0 &&
                typesWithExtendedText.includes(sourceType) &&
                bodyVariants('withApps', { name: source.name, count: filteredApps.length })}
                {filteredApps.length > 0 &&
                !typesWithExtendedText.includes(sourceType) &&
                bodyVariants('withAppsExtendedText', { name: source.name, count: filteredApps.length })}
            </Text>
            {filteredApps.length > 0 &&
            <AppListInRemoval applications={filteredApps} />}
            <Checkbox
                label={intl.formatMessage({
                    id: 'sources.deleteCheckboxTitle',
                    defaultMessage: `I acknowledge that this action cannot be undone.`
                })}
                onChange={() => setAcknowledge((value) => !value)}
                aria-label={
                    intl.formatMessage({
                        id: 'sources.deleteCheckboxTitle',
                        defaultMessage: `I acknowledge that this action cannot be undone.`
                    })
                }
                id="acknowledgeDelete"
                name="acknowledgeDelete"
                isChecked={acknowledge}
            />
        </TextContent>
    );

    return (
        <Modal className="ins-c-sources__dialog--warning"
            aria-label={
                intl.formatMessage({
                    id: 'sources.deleteTitle',
                    defaultMessage: `Remove source?`
                })
            }
            header={
                <Title headingLevel="h1" size="2xl">
                    <ExclamationTriangleIcon size="sm" className="ins-m-alert ins-c-source__delete-icon pf-u-mr-sm" />
                    {intl.formatMessage({
                        id: 'sources.deleteTitle',
                        defaultMessage: `Remove source?`
                    })}
                </Title>
            }
            isOpen
            variant="small"
            onClose={ returnToSources }
            actions={ actions }
        >
            { body }
        </Modal>
    );
};

export default SourceRemoveModal;
