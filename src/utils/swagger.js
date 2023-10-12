import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

const options = {
    definition: {
        openapi: '3.0.0',
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ],
        tags: [
            {
                name: "User",
                description: "User routes",
            },

        ],
        paths: {
        },
        info: {
            title: 'NFT Marketplace Project',
            version: '1.0.0',
            description:
                'API document for NFT Marketplace Project',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            }
        ]
    },
    apis: ['../route/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
    // Swagger page
    app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    // Docs in JSON format
    app.get('docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
