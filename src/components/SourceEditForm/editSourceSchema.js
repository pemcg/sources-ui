import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent } from '@patternfly/react-core';
import { temporaryHardcodedSourceSchemas, asyncValidator } from '@redhat-cloud-services/frontend-components-sources';
import { FormattedMessage } from 'react-intl';

import { endpointToUrl } from '../SourcesSimpleView/formatters';

const compileAllSourcesComboOptions = (sourceTypes) => (
    [
        ...sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    ]
);

const fieldsToStep = (fields, stepName, nextStep) => ({
    ...fields, // expected to include title and fields
    name: stepName,
    stepKey: stepName,
    nextStep
});

const indexedStepName = (base, index) => index === 0 ? base : `${base}_${index}`;

const fieldsToSteps = (fields, stepNamePrefix, lastStep) =>
    Array.isArray(fields) ?
        fields.map((page, index) =>
            fieldsToSteps(
                page,
                indexedStepName(stepNamePrefix, index),
                index < fields.length - 1 ? indexedStepName(stepNamePrefix, index + 1) : lastStep)
        ) : fieldsToStep(fields, stepNamePrefix, lastStep);

/* Switch between using hard-coded provider schemas and schemas from the api/source_types */
const sourceTypeSchemaHardcodedWithFallback = t => (
    temporaryHardcodedSourceSchemas[t.name] ||
    { ...t.schema, fields: t.schema.fields.sort((_a, b) => b.type === 'hidden' ? -1 : 0) }
);
const sourceTypeSchemaWithFallback = t => (t.schema || temporaryHardcodedSourceSchemas[t.name]);
const sourceTypeSchemaHardcoded = t => temporaryHardcodedSourceSchemas[t.name];
const sourceTypeSchemaServer = t => t.schema;

const schemaMode = 4; // defaults to 0
const sourceTypeSchema = {
    0: sourceTypeSchemaWithFallback,
    1: sourceTypeSchemaHardcoded,
    2: sourceTypeSchemaServer,
    4: sourceTypeSchemaHardcodedWithFallback
}[schemaMode];

const firstStepEdit = (sourceTypes, type, sourceId) => ({
    title: <FormattedMessage
        id="sources.editSource"
        defaultMessage="Edit a source"
    />,
    name: 'step_1',
    stepKey: 1,
    nextStep: type,
    fields: [{
        component: componentTypes.TEXT_FIELD,
        name: 'source.name',
        type: 'text',
        label: <FormattedMessage
            id="sources.name"
            defaultMessage="Name"
        />,
        validate: [
            (value) => asyncValidator(value, sourceId)
        ],
        isRequired: true
    }, {
        component: componentTypes.SELECT_COMPONENT,
        name: 'source_type',
        label: <FormattedMessage
            id="sources.type"
            defaultMessage="Type"
        />,
        isRequired: true,
        isDisabled: true,
        readOnly: true, // make it grey ;-)
        options: compileAllSourcesComboOptions(sourceTypes),
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    }]
});

const summaryStep = (sourceTypes) => ({
    fields: [{
        component: 'description',
        name: 'description',
        content: <TextContent>
            <FormattedMessage
                id="sources.summaryDescription"
                defaultMessage="Review source details and click Add source to complete source creation. Click Back to revise."
            />
        </TextContent>
    }, {
        name: 'summary',
        component: 'summary',
        sourceTypes,
        showApp: false
    }],
    stepKey: 'summary',
    name: 'summary',
    title: <FormattedMessage
        id="sources.reviewSummary"
        defaultMessage="Review source details"
    />
});

const initialValues = source => {
    const url = source.endpoint ? endpointToUrl(source.endpoint) : '';

    return {
        url,
        endpoint: source.endpoint,
        authentication: source.authentication,
        source: source.source,
        source_type: source.source_type
    };
};

export function sourceEditForm(sourceTypes, source) {
    const sourceType = sourceTypes && sourceTypes.find((type) => type.id === source.source_type_id);
    const typeName = sourceType.name;

    const sourceTypeSteps = fieldsToSteps(sourceTypeSchema(sourceType), typeName, 'summary');
    const structuredSteps = Array.isArray(sourceTypeSteps) ? sourceTypeSteps : [sourceTypeSteps];

    return {
        initialValues: initialValues({ source_type: sourceType.name, ...source }),
        schemaType: 'default',
        showFormControls: false,
        schema: {
            fields: [{
                component: componentTypes.WIZARD,
                name: 'wizard',
                inModal: true,
                title: <FormattedMessage
                    id="sources.editSource"
                    defaultMessage="Edit Source"
                />,
                description: <FormattedMessage
                    id="sources.sources.editSourceDescription"
                    defaultMessage="You are editing a source"
                />,
                fields: [
                    firstStepEdit(sourceTypes, typeName, source.id),
                    ...structuredSteps,
                    summaryStep(sourceTypes)
                ]
            }]
        }
    };
}