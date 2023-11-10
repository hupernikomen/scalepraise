import moment from 'moment';
import CalendarItem from "./CalendarItem";
const tons = require('./utils/canticos.json')

// Louvores
const praises = {
  friday: ["Tu és soberano", "Maranata", "Meu Barquinho", "Galileu", "Jerusalem"],
  ebd: [],
  sundayprelude: ["Vem, esta é a hora", "Jesus em Tua presença", "Em Espírito em verdade", "Renova-me"],
  sunday: ["Sobre as águas", "Maranata", "Galileu", "Tu és soberano", "Foi por amor", "Não há Deus maior", "Filho Prodigo", "Ao único",],
  sundaycommunion: ["Filho do Deus vivo"],
  hcc: ['456', '001', '002', '001', '540'],
  supper: ["Bendito Cordeiro"] // Louvors de Ceia
}

// Musicos
const musicians = {
  instrumentalists: [
    
  ],
  vocals: {
    friday: ["Lidiane", "Laís", "Edvan"],
    ebd: ["Wilson", "Paulinha"],
    sunday: ["Paulinha", "Fernanda", "Laís", "Kelviane", "Lidiane", "Duda"]
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
    vocals: ["Edmilson", "Edvan", ...musicians.vocals.sunday], // LOGICA PRA SELECIONAR VOCAIS
    instrumentalists: ["Wesley", "Annes", ...musicians.instrumentalists.sunday]
  },
]

const otherscales = [
  {
    date: moment("2023/11/13"),
    cult: 'Culto Especial',
    praises: ["Lovar a Deus"],
    vocals: ["Edmilson", "Edvan", "Duda", "Kelviane"]
  },
]

function SelectPraiseSunday(week) {
  switch (week) {
    case 1:
      return [praises.sundayprelude[0], praises.sunday[0], praises.sundaycommunion[0]]

    case 2:
      return [praises.sundayprelude[1], praises.sunday[2], praises.sundaycommunion[1]]

    case 3:
      return [praises.sundayprelude[2], praises.sunday[1], praises.sundaycommunion[2]]

    case 4:
      return [praises.sundayprelude[3], praises.sunday[3], praises.sundaycommunion[3]]

    default:
      return [praises.sundayprelude[4], praises.sunday[4], praises.sundaycommunion[4]]
  }
}


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
const uniqueItems = praises.sunday?.concat(praises.friday, praises.sundayprelude, praises.supper).filter((item, index, array) => {
  return array.indexOf(item) === index;
});
function getTons(n) {
  for (let i = 0; i < tons.length; i++) {
    if (tons[i].name === n) return tons[i].tom;

  }
  return null; // caso não encontre, retorna null
}



function ListPraises() {
  return (
    <div>
      <h3 style={{ paddingLeft: 30, fontWeight: 400, fontSize: 18 }}>Louvores do mês:</h3>
      <div style={{ display: 'flex', overflow: 'auto', height: 80, gap: 6, padding: '0px 12px 12px 12px' }}>
        {
          uniqueItems.map((pray) => {
            return (
              <div style={{ position: 'relative', minWidth: 95, height: 40, borderRadius: 10, backgroundColor: '#00796B', display: 'grid', alignItems: 'center', justifyContent: 'center', padding: 8, }}>
                <strong style={{ textAlign: 'center', fontWeight: 400, fontSize: 14, color: '#fff' }}>{pray}</strong>
                <strong style={{ boxShadow: '1px 1px 5px #00000040', fontWeight: 500, position: 'absolute', bottom: -10, left: 6, backgroundColor: '#fff', fontSize: 14, paddingLeft: 8, paddingRight: 8, paddingTop: 1, paddingBottom: 1, borderRadius: 12 }}>{getTons(pray)}</strong>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}



export default function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 600, marginBottom: 70 }}>Escala Louvor</h1>

      <ListPraises />
      {sortedScales.map((scale, index) => {
        return (
          <CalendarItem key={index} data={scale} />
        )
      })}

      <p style={{ textAlign: 'center' }}>Ministério de Louvor Adonai</p>
    </div>
  );
}
