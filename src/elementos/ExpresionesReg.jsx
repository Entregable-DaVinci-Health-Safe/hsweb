//ExpresionesRegulares
const ExpReg = {
	//usuario: /^[a-zA-Z0-9_-]{4,16}$/, // Letras, numeros, guion y guion_bajo
	nombre: /^[a-zA-ZÀ-ÿ\s]{4,40}$/, // Letras y espacios, pueden llevar acentos.
	password: /^.{8,20}$/, // 8 a 20 digitos.
	correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	telefono: /^\d{7,14}$/, // 7 a 14 numeros.
	cantidad: /^\d{1,4}$/, // 1 a 4 numeros.
	matricula: /^\d{4,12}$/, // 4 a 12 numeros.
	dni: /^\d{7,8}$/, // 7 a 8 numeros.
	direccion: /^[a-zA-ZÀ-ÿ0-9_-\s]{4,40}$/, // Letras y espacios, pueden llevar acentos.
	piso: /^[a-zA-Z\d]{0,2}$/, // 0 a 2 numeros y letras.
	signosVitaLes: /^[1-9]\d*(\.\d{1,2})?$/, //numeros positivos mayores que 0 con 2 decimales como maximo
	
	requirements: [
		{ regex: /[a-z]/, label: 'Al menos una letra minúscula' },
		{ regex: /[A-Z]/, label: 'Al menos una letra mayúscula' },
		{ regex: /[^\w\s'"`]/, label: 'Al menos un símbolo (que no sea \' o ")' },
		{ regex: /^.{8,20}$/, label: 'Entre 8 y 20 caracteres' },
		// { regex: /^(?!.*(\d)\1{2}).*$/, label: 'No más de 3 números consecutivos' }
	  ]
	
}


export default ExpReg;