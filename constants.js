// Global constants for the application

//export const API_URL = 'http://localhost:8080';

// export const API_URL = "http://132.248.32.215:8080";

// En produccion se usa process.env etc, localmente en nuestro puerto 8080 o donde tengas asignado el back

export const API_URL = process.env.REACT_APP_API_URL || '/api';


