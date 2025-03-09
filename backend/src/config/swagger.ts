import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Land Title Management API',
        version: '1.0.0',
        description: 'API for managing land titles using Hyperledger Fabric and IPFS',
    },
    servers: [
        {
            url: 'http://localhost:6060',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [{ bearerAuth: [] }],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts'], // Path to your route files
};

export default options;