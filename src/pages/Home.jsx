

import ArticleIcon from '@mui/icons-material/Article';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MedicationIcon from '@mui/icons-material/Medication';
import CheckIcon from '@mui/icons-material/Check';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../css/Home.css'

const historialesClinicos=[
  {
      doctor:"Dr.René Favaloro",
  },
  {
    doctor:"Dr.Juan Topo",
  },
  {
    doctor:"Dr.Solaire Astora",
  },
  {
    doctor:"Dr.Pedro Pascal",
  },
  {
    doctor:"Dr.René Alberto",
  },

  
]

const medGuardados = [
  {
    nombre: "Amoxidal",
    medicamento: "Amoxicilina",
    dosis: "10",
    uMedida: "ml",
    presentacion: "XXX",
    tipo: "capsulas blandas",
    icon: <CheckIcon/>
  },
  {
    nombre: "Tafirol",
    medicamento: "tafi",
    dosis: "1",
    uMedida: "g",
    presentacion: "XXX",
    tipo: "pastilla",
    icon: <PriorityHighIcon/>
  }
];

const Home = () => {
    return (
      <>
        <div style={{width: '50%', marginLeft: '10vh', marginTop: '5vh'}}>
      <Container>
        <Row>
          <Col>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                Historiales Clinicos
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Listado de Historiales Clinicos.
                </Typography>
                {
                   historialesClinicos.map((item, index)=>(
                <List component="nav" key={index}>
                  <ListItemButton>
                    <ListItemIcon>
                      <ArticleIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.doctor}/>
                    <ListItemIcon>
                     <VisibilityIcon/>
                    </ListItemIcon>
                  </ListItemButton>
                </List>
                  ))
                }
              </CardContent>
            </Card>
          </Col>

          <Col>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                Medicacion Habitual
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Listado de Medicacion Habitual.
                </Typography>
                {
                   medGuardados.map((item, index)=>(
                <List key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <MedicationIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.nombre} secondary={item.dosis + " | " + item.uMedida}/>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                  </ListItem>
                </List>
                  ))
                }
              </CardContent>
            </Card>
          </Col>
          </Row>
      </Container> 
        </div>
      </>
    );
  }

  export default Home