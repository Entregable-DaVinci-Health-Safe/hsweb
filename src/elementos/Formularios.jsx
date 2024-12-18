
import styled, {css} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const colores = {
	borde: "#0075FF",
	error: "#bb2929",
	exito: "#1ed12d"
}

const Formulario = styled.form`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;

	@media (max-width: 800px){
		grid-template-columns: 1fr;
	}
`;

const Label = styled.label`
	display: block;
	font-weight: 700;
	padding: 10px;
	min-height: 40px;
	cursor: pointer;

	${props => props.valido === false && css`
		color: ${colores.error};
	`}
`;

const GrupoInput = styled.div`
	position: relative;
	z-index: 90;
`;

const Input = styled.input`
	width: 400px;
	background: #fff;
	border-radius: 3px;
	height: 45px;
	line-height: 45px;
	padding: 0 40px 0 0px;
	transition: .3s ease all;
	border: 1px solid ;

	&:focus {
		border: 3px solid ${colores.borde};
		outline: none;
		box-shadow: 3px 0px 30px rgba(163,163,163, 0.4);
	}

	${props => props.valido === true && css`
		border: 1px solid;
	`}

	${props => props.valido === false && css`
		border: 3px solid ${colores.error} !important;
	`}
`;

const DropdownWrapper = styled.div`

  width: 400px;
  height: 50px;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 0 40px 0 10px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const DropdownText = styled.span`
  font-size: 16px;
  color: gray;
`;



const DropdownList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 60px;
  left: 0;
  width: 300px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
  z-index: 90;
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;
  list-style-type: none;

  &:hover {
    background-color: lightgray;
  }
`;

const LeyendaError = styled.p`
	font-size: 12px;
	margin-bottom: 0;
	color: ${colores.error};
	display: none;

	${props => props.valido === true && css`
		display: none;
	`}

	${props => props.valido === false && css`
		display: block;
	`}
`;

const IconoValidacion = styled(FontAwesomeIcon)`
	position: absolute;
	right: 10px;
	bottom: 14px;
	z-index: 100;
	font-size: 16px;
	opacity: 0;

	${props => props.valido === false && css`
		opacity: 1;
		color: ${colores.error};
	`}

	${props => props.valido === true && css`
		opacity: 1;
		color: ${colores.exito};
	`}
`;

const ContenedorTerminos = styled.div`
	grid-column: span 2;

	input {
		margin-right: 10px;
	}

	@media (max-width: 800px){
		grid-column: span 1;
	}
`;

const ContenedorBotonCentrado = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	grid-column: span 2;

	@media (max-width: 800px){
		grid-column: span 1;
	}
`;

const Boton = styled.button`
	height: 45px;
	line-height: 45px;
	width: auto;
	background: #4d90fe;
	color: #fff;
	font-weight: bold;
	border: none;
	border-radius: 10px;
	cursor: pointer;
	transition: .1s ease all;

	&:hover {
		box-shadow: 3px 0px 30px rgba(163,163,163, 1);
	}
`;

const MensajeExito = styled.p`
	font-size: 14px;
	color: ${colores.exito};
`;

const MensajeError = styled.div`
	height: 45px;
	line-height: 45px;
	background: #F66060;
	padding: 0px 15px;
	border-radius: 3px;
	grid-column: span 2;
	p {
		margin: 0;
	} 
	b {
		margin-left: 10px;
	}
`;

const TextAreaWrapper = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 4px;
  resize: none;
`;

const DateTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DateTimeInput = styled.input`
width: 100%;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 5px;
	border: 0;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

export {
	Formulario,
	Label,
	GrupoInput,
	Input,
	LeyendaError,
	IconoValidacion,
	ContenedorTerminos,
	ContenedorBotonCentrado,
	Boton,
	MensajeExito,
	MensajeError,
	DropdownWrapper,
	DropdownItem,
	DropdownList,
	DropdownText,
	TextAreaWrapper,
	DateTimeWrapper,
	DateTimeInput
};
