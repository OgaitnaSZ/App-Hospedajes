import swaggerJsdoc, { Options } from "swagger-jsdoc";

/**
 * API Config Info
 */
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Documentacion de API de App de Hospedajes",
        version: "1.0.1"
    },
    servers:[
        {
            url: "http://localhost:4001/api"
        }
    ],
    components:{
        securitySchemes:{
            bearerAuth:{
                type:"http",
                scheme:"bearer",
                bearerFormat: "JWT"
            }
        },
        schemas:{
           
        }
    },
}

/**
 * Opciones
 */
const options: Options = {
    swaggerDefinition,
    apis:[
        "./routes/*.ts"
    ]
}

const openApiConfiguration = swaggerJsdoc(options);

export default openApiConfiguration;