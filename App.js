{
    "$id": "id",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "description": "Schemas for API payloads related to FETCH operations on Planogram",
    "definitions": {
        "PlanogramSearch": {
            "$id": "id",
            "description": "OMS Planogram",
            "type": "object",
            "properties": {
                "storeId": {
                   "type":"string"
                },
                "identifier": {
                    "type":"string"
                },
                "values": {
                    "type":"array",
                    "items": {"type":"string"}
                }
            },
            "required": [
                "storeId",
                "identifier",
                "values"
            ],
            "additionalProperties": false,
            "errorMessage": {
                "required": {
                    "storeId": "Store Id is required",
                    "identifier": "identifier is required",
                    "values": "Value is required"
                },
                "additionalProperties": "Planogram data is not in required format"
            }
        }
    }
}
