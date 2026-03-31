import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'PMS Admin API',
    description: 'Auto-generated API documentation for PMS Admin Portal'
  },
  host: 'localhost:5000',
  schemes: ['http'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = './swagger-output.json';
const routes = ['./index.js']; // The entry point to your API

// Generate swagger-output.json
swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc).then(() => {
  console.log("Swagger documentation has been generated successfully.");
});
