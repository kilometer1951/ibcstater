/**
 * Plugin to validate unique array items by props
 * @param {import("ajv").Ajv} ajv
 */
export function AjvPluginUniqueItemsByProperty(ajv) { //eslint-disable-line id-length
    /* istanbul ignore next */
    function validateUniqueItemsByProperty(
        schema,
        data,
        parentSchema,
        dataPath
    ) {
        validateUniqueItemsByProperty.errors = validateUniqueItemsByProperty.errors || [];
        const hasDuplicates = data.map(data => data[schema])
            .some((item, index, all) => all.indexOf(item) !== index); //eslint-disable-line id-length
        if (hasDuplicates) {
            validateUniqueItemsByProperty.errors.push({
                keyword: 'uniqueItemsByProp',
                dataPath,
                message: 'must have unique items'
            });
        }
        return !hasDuplicates;
    }

    ajv.addKeyword('uniqueItemsByProperty', {
        type: 'array',
        errors: true,
        metaSchema: {
            type: 'string',
            additionalProperties: false
        },
        validate: validateUniqueItemsByProperty
    });
}
