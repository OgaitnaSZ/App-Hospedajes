# App Hospedajes
Aplicación web full stack que permite explorar y reservar hospedajes en distintas provincias de Argentina. 
Cada hospedaje cuenta con sus propios servicios, habitaciones y actividades relacionadas.

## Características principales
- Listado de hospedajes distribuidos en 4 provincias de Argentina.
- Detalle de servicios por hospedaje y por habitación.
- Sistema de reservas.
- Gestión de hospedajes, habitaciones y actividades turísticas.
- Autenticación con JWT.
- Integración con Mercado Pago (token de prueba incluido).

## Tecnologías usadas
- Angular (Frontend)
- Express (Backend)
- MySQL (Base de Datos)
- TailwindCSS (Estilos)

## Dependencias adicionales backend
- **Node.js** + **Express**
- **Prisma ORM** + **MySQL**
- **JWT** para autenticación
- **Swagger** para documentación de API
- **Mercado Pago SDK** para pagos
- **Nodemailer** para notificaciones
- **Multer** para carga de imágenes
- **TypeScript** para tipado
- **Jest** para testing
- **Nodemon** para desarrollo

## Dependencias adicionales frontend
- **Angular 20**
- **Angular Material**
- **TailwindCSS**
- **SwiperJS** para carruseles
- **ngx-infinite-scroll** para scroll infinito
- **RxJS** para gestión reactiva

## Estructura general del proyecto/backend
├── prisma/<br>
├── src/<br>
├── .env<br>
└── package.json<br>
<br>
/frontend<br>
├── src/<br>
├── angular.json<br>
└── package.json<br>
<br>
/db<br>
  └── data.sql<br>

## Instrucciones para correr el proyecto
### 1. Clonar el repositorio
```bash
git clone https://github.com/OgaitnaSZ/App-Hospedajes.git
cd app-hospedajes
```

### 2. Configurar la base de datos
- Crear una base de datos en tu servidor MySQL local.
- Importar el archivo .sql incluido en el proyecto (se encuentra en la raíz o en la carpeta /db, según tu estructura).

### 3. Configurar variables de entorno
Dentro de /backend, crear un archivo .env con el siguiente contenido:
```
DATABASE_URL=mysql://usuario:password@localhost:3306/nombre_de_tu_db
NODE_ENV=prod
JWT_SECRET=AppHospedajes
PORT=4001
PUBLIC_URL=http://localhost:4001
MP_ACCESS_TOKEN=APP_USR-789193192318643-102217-c4e5469831c28fd8867e8067b16a4774-2022849958
```
Reemplazá usuario, password y app-hospedajes con tus credenciales locales.

### 4. Instalar dependencias y ejecutar el backend
```
cd backend
npm install
npx prisma db pull
npx prisma generate
npm run dev
```
El backend se ejecutará en: ```http://localhost:4001```

### 5. Instalar dependencias y ejecutar el frontend
```
cd frontend
npm install
ng serve -o
```
Si no tenés Angular CLI instalado globalmente:
```
npm install -g @angular/cli
```
El frontend se abrirá en: ```http://localhost:4200```

### Usuario de prueba (Admin)
```
email: admin@gmail.com
password: admin
```
## Pendientes de desarrollo
- Agregar columna estado a habitaciones y modificar eliminación por desactivación lógica.
- Completar componente de detalles de reserva.
- Crear componente para ver pagos de usuarios.
- Agregar opción para cambiar medio de pago (efectivo o Mercado Pago), dejando la reserva en estado “pendiente”.
- Activar infinite scrolling en hospedajes, actividades, historial y pagos.
- Implementar filtros por servicios en habitaciones y hospedajes.

## Notas técnicas
- **Prisma ORM** sincroniza modelos con la base de datos. Ejecutar ``npx prisma db pull`` y ``npx prisma generate`` ante cualquier cambio.
- **Swagger** documenta las rutas del backend (accesible desde ```/api-docs```).
