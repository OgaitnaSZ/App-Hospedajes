"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actividad = exports.habitacion = exports.hospedaje = exports.userLoginAdmin = exports.userLogin = exports.userRegister = void 0;
// Auth
exports.userRegister = {
    "nombre": "Santiago",
    "apellido": "Zelaya",
    "email": "test123@gmail.com",
    "telefono": "12381923",
    "password": "test123"
};
exports.userLogin = {
    "email": "test123@gmail.com",
    "password": "test123"
};
// Admin
exports.userLoginAdmin = {
    "email": "admin@gmail.com",
    "password": "admin"
};
exports.hospedaje = {
    "titulo": "Hotel en Santiago",
    "descripcion": "descripcion de hotel de prueba",
    "servicios": "1,2,3,4",
    "estrellas": 4,
    "telefono": "381873912",
    "ciudad": "Santiago",
    "direccion": "Av. Roca 1880",
    "coordenadas": "-147189321381, 21478291312",
    "imagen": "https://images.trvl-media.com/lodging/19000000/18540000/18530600/18530574/ab40061a.jpg"
};
exports.habitacion = {
    "idHospedaje": "",
    "numero": "101",
    "precio": 400,
    "capacidad": 4,
    "tipo": "suite",
    "servicios": "1,2,3,4"
};
exports.actividad = {
    "nombre": "Tour de Senderismo en la Quebrada",
    "descripcion": "Una excursión guiada de 4 horas por la Quebrada con vistas panorámicas y explicaciones sobre la flora y fauna local.",
    "imagen": "https://example.com/images/tour-quebrada.jpg",
    "ciudad": "Tucuman",
    "precio": 3500
};
//# sourceMappingURL=helperData.js.map