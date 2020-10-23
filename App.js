

export function isNullOrWhiteSpace(value) {
    if (isNullOrUndefined(value)) {
        return true;
    } else if (isString(value)) {
        return value.trim().length === 0;
    } else {
        return value.toString().trim().length === 0;
    }
}

const ajvInstance = new Ajv({
    schemas: [
        JSONSchemaSonicAPIPayload
    ],
    allErrors: true,
    jsonPointers: true
});
AjvPluginUniqueItemsByProperty(ajvInstance);
AjvErrors(ajvInstance);

export function getJSONSchemaValidator(schemaId) {
    return ajvInstance.getSchema(schemaId);
}

export const schemaValidatorPlanogramSearch = getJSONSchemaValidator(
    'ID'
);

export function validateBySchema(validatorFunction, data) {
    const isValid = validatorFunction(data);
    if (isValid) {
        return { isValid };
    } else {
        return {
            isValid,
            errors: validatorFunction.errors.map((error) => {
                let location = error.dataPath;
                switch (error.keyword) {
                    case 'additionalProperties':
                        location += `/${error.params.additionalProperty}`;
                        break;
                    case 'required':
                        location += `/${error.params.missingProperty}`;
                        break;
                }
                return {
                    message: error.message,
                    location
                };
            })
        };
    }
}
