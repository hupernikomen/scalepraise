import moment from 'moment';
import CalendarItem from "./CalendarItem";
const escala = require('./utils/praisesList.json')

// Louvores
const praises = {
  friday: ["louvorFriday1", "louvorFriday2", "louvorFriday3", "louvorFriday4", "louvorFriday5"], // 5 LOUVORES
  psh: ["louvorPSH1", "louvorPSH2", "louvorPSH3", "louvorPSH4", "louvorPSH5", "louvorPSH6", "louvorPSH7"],
  ebd: [],
  sundayprelude: ["louvorPreludio1", "louvorPreludio2", "louvorPreludio3", "louvorPreludio4"], // 4 LOUVORES
  sunday: ["louvorSunday1", "louvorSunday2", "louvorSunday3", "louvorSunday4", "louvorSunday5"], // 5 LOUVORES , SENDO 3 DE SEXTA
  sundaycommunion: ["louvorCommunion1", "louvorCommunion2", "louvorCommunion3", "louvorCommunion4", "louvorCommunion5"], // 5 LOUVORES
  hcc: ['001', '002', '003', '004', '005'],
  supper: ["Bendito Cordeiro"] // Louvors de Ceia
}





// Musicos
const musicians = {
  instrumentalists: {
    friday: ["Wesley", "Warley"],
    psh: ["Thiago", "Andre", "Warley", "Rhuan", "Rhuan"],
    ebd: ["Annes"],
  },
  vocals: {
    friday: ["Lidiane", "Laís", "Edvan"],
    psh: [["Wilson", "Paulinha"], ["Kelviane", "Fernanda"], ["Edmilson", "Fernanda"], ["Lidiane", "Duda", "Laís"]],
    ebd: ["Wilson", "Paulinha"],
    sunday: ["Laís", "Kelviane", "Lidiane", "Duda"]
  }
}


const scales = [
  {
    date: somarDias(proximoDomingo(), -2),
    cult: 'Doutrina / Oração',
    praises: [praises?.friday[getWeekNumber() - 1], praises?.friday[getWeekNumber()]],
    vocals: musicians.vocals.friday,
    instrumentalists: musicians.instrumentalists.friday
  },
  {
    date: proximoDomingo(),
    cult: getSundaysInMonth() === getWeekNumber() ? 'EBD com Ceia' : 'EBD',
    praises: getSundaysInMonth() === getWeekNumber() ? praises.supper : praises.ebd,
    vocals: musicians.vocals.ebd,
    instrumentalists: musicians.instrumentalists.ebd
  },
  {
    date: proximoDomingo(),
    cult: 'Louvor e Pregação',
    praises: SelectPraiseSunday(getWeekNumber()),
    hcc: [praises?.hcc[getWeekNumber() - 1], praises?.hcc[getWeekNumber()]],
    instrumentalists: ["Wesley", "Annes", getWeekNumber() % 2 === 0 ? "André" : "Thiago"]
  },
]


const psh = [
  {
    date: somarDias(proximoDomingo(), -1),
    cult: 'PSH',
    praises: [praises?.psh[getWeekNumber() - 1], praises?.psh[getWeekNumber()], praises?.psh[getWeekNumber() + 1]],
    vocals: musicians.vocals.psh[getWeekNumber() - 1],
    instrumentalists: musicians.instrumentalists.psh[getWeekNumber() - 1]
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


// 12 LOUVORS PARA DOMINGOS
function SelectPraiseSunday(week) {
  switch (week) {
    case 1: return [praises.sundayprelude[0], praises.sunday[0], praises.sundaycommunion[0]]
    case 2: return [praises.sundayprelude[1], praises.sunday[1], praises.sundaycommunion[1]]
    case 3: return [praises.sundayprelude[2], praises.sunday[2], praises.sundaycommunion[2]]
    case 4: return [praises.sundayprelude[3], praises.sunday[1], praises.sundaycommunion[3]]

    default: return [praises.sundayprelude[4], praises.sunday[0], praises.sundaycommunion[4]]
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
const sortedScales = scales.concat(otherscales, psh).sort((a, b) => {
  return moment(a.date) - moment(b.date);
});
const uniqueItems = praises.sunday?.concat(praises.friday, praises.sundayprelude, praises.supper, praises.sundaycommunion).filter((item, index, array) => {
  return array.indexOf(item) === index;
});
function getTons(n) {
  for (let i = 0; i < escala.length; i++) {
    if (escala[i].name === n) return escala[i].tom;

  }
  return null; // caso não encontre, retorna null
}


const width = window.innerWidth;
const widthInPx = parseInt(width / 4.5);


function ListPraises() {
  return (
    <div style={{ margin: 12, marginBottom: 20, backgroundColor: '#fff', borderRadius: 6, padding: '15px 0px 15px 0px', }}>

      <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 18 }}>
        <h3>{uniqueItems.length}</h3>
        <h3 style={{ fontWeight: 400, fontSize: 18, marginLeft: 6 }}>Louvores do mês: </h3>
      </div>

      <p style={{ marginLeft: 18, marginRight: 18, fontWeight: 300, fontSize: 14, marginBottom: 32 }}>Em Árvores Verdes e PSH, deverão ser trabalhadas esses {uniqueItems.length} louvores nos proximos 30 dias.</p>

      <div style={{ display: 'flex', overflow: 'auto', height: 80, gap: 6, padding: '0px 12px 12px 12px' }}>
        {
          uniqueItems.map((pray) => {
            return (
              <div style={{ position: 'relative', minWidth: widthInPx, height: 40, borderRadius: 10, backgroundColor: '#795548', display: 'grid', alignItems: 'center', justifyContent: 'center', padding: 8, }}>
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
      <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, }}>LOUVOR ADONAI</h1>
      <h1 style={{ textAlign: 'center', fontSize: 18, fontWeight: 500, color: '#000', marginBottom: 30 }}>Louvem com alegria ao SENHOR.</h1>

      <ListPraises />

      {sortedScales.map((scale, index) => {
        return (
          <CalendarItem key={index} data={scale} />
        )
      })}

      <p style={{ textAlign: 'center', marginTop: 50 }}>Ministério de Louvor Adonai</p>
    </div>
  );
}
