import { usuario } from './generated/prisma';
declare global {
    namespace Express {
        interface Request {
            user: usuario;
        }
    }
}
//# sourceMappingURL=global-types.d.ts.map