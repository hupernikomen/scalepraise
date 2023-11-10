import moment from 'moment';
import CalendarItem from "./CalendarItem";

// Louvores
const praises = {
  friday: ["Tu és soberano", "Maranata", "Meu Barquinho", "Galileu", "Jerusalem"],
  ebd: [],
  sunday: ["Sobre as aguas", "Maranata", "Galileu", "3 Palavrinhas", "Como José", "Não há Deus maior", "Filho Prodigo", "Filho do Deus vivo", "Reis dos Reis", "Remove a pedra"],
  hcc: ['456', '001', '002', '001', '540'],
  sundayprelude: ["Vem, esta é a hora", "Jesus em tua presença", "Jesus é o caminho","Jó"],
  supper: ["Bendito Cordeiro","Bendito Cordeiro","Bendito Cordeiro","Bendito Cordeiro"] // Louvors de Ceia
}

// Musicos
const musicians = {
  instrumentalists: [],
  vocals: {
    friday: ["Lidiane", "Laís", "Edvan"],
    ebd: ["Wilson", "Paulinha"],
    sunday: ["Paulinha", "Fernanda", "Laís", "Kelviane", "Lidiane", "Duda"]
  }
}

function SelectPraiseSunday(week) {
  switch (week) {
    case 1:
      return [praises.sundayprelude[0],praises.sunday[0], praises.sunday[1]]

    case 2:
      return [praises.sundayprelude[1],praises.sunday[2], praises.sunday[3]]

    case 3:
      return [praises.sundayprelude[2],praises.sunday[1], praises.sunday[4]]

    case 4:
      return [praises.sundayprelude[3],praises.sunday[3], praises.sunday[5]]

    default:
      return [praises.sundayprelude[4],praises.sunday[4], praises.sunday[6]]
  }
}



const scales = [
  {
    date: somarDias(proximoDomingo(), -2),
    cult: 'Doutrina / Oração',
    praises: [praises?.friday[getWeekNumber() - 1], praises?.friday[getWeekNumber()]],
    vocals: musicians.vocals.friday
  },
  {
    date: proximoDomingo(),
    cult: getSundaysInMonth() === getWeekNumber() ? 'EBD com Ceia' : 'EBD',
    praises: getSundaysInMonth() === getWeekNumber() ? praises.supper : praises.ebd,
    vocals: musicians.vocals.ebd
  },
  {
    date: proximoDomingo(),
    cult: 'Louvor e Pregação',
    praises: SelectPraiseSunday(getWeekNumber()),
    hcc: [praises?.hcc[getWeekNumber() - 1], praises?.hcc[getWeekNumber()]],
    vocals: ["Edmilson", "Edvan", ...musicians.vocals.sunday] // LOGICA PRA SELECIONAR VOCAIS
  },


]

const otherscales = [
  {
    date: moment("2023/11/13"),
    cult: 'Especial',
    praises: ["Lovar a Deus"],
    vocals: ["Edmilson", "Edvan", "Duda", "Kelviane"]
  },
]





function proximoDomingo() {
  return moment().day(7);
}


function somarDias(data, dias) {
  return moment(data).add(dias, 'days');
}


function getWeekNumber() {
  var today = new Date();
  var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var pastDaysOfMonth = today.getDate() - 1;
  var weekNumber = Math.ceil((pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7);
  return weekNumber;
}

function getSundaysInMonth() {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  var sundays = 0;

  for (var day = 1; day <= 31; day++) {
    var date = new Date(year, month, day);
    if (date.getMonth() === month && date.getDay() === 0) {
      sundays++;
    }
  }

  return sundays;
}


const sortedScales = scales.concat(otherscales).sort((a, b) => {
  return moment(a.date) - moment(b.date);
});

export default function App() {
  return (
    <div>


      <h1 style={{ textAlign: 'center', fontSize: 28 }}>Escala Louvor</h1>
      <h3 style={{ textAlign: 'center', fontWeight: 300, fontSize: 16, color: '#000', fontStyle: 'italic' }}>Próxima atualização: {moment().day(8).format('DD/MM')}</h3>

      {sortedScales.map((scale, index) => {
        return (
          <CalendarItem key={index} data={scale} />
        )
      })}
    </div>
  );
}
