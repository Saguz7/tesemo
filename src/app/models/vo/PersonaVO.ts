export class PersonaVO {
    id: number;
    nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    curp: string;
    ruta: string;

    constructor(
        idProveedor?: number,
        nombre?: string,
        primer_apellido?: string,
        segundo_apellido?: string,
        curp?: string,
        ruta?: string
    ) {}
}
