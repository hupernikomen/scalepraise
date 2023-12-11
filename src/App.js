import moment from 'moment';
import CalendarItem from "./CalendarItem";
const escala = require('./utils/praisesList.json')


// Louvores
const praises = {
  friday: ["louvor Friday1", "louvor Friday2", "louvor Friday3", "louvor Friday4", "louvor Friday5"], // 5 LOUVORES
  psh: ["louvor PSH1", "louvor PSH2", "louvor PSH3", "louvor PSH4", "louvor PSH5", "louvor PSH6", "louvor PSH7"],
  ebd: [],
  sundayprelude: ["louvor Preludio1", "louvor Preludio2", "louvor Preludio3", "louvor Preludio4"], // 4 LOUVORES
  sunday: ["louvor Sunday1", "louvor Sunday2", "louvor Sunday3", "louvor Sunday4", "louvor Sunday5"], // 5 LOUVORES , SENDO 3 DE SEXTA
  sundaycommunion: ["louvor Communion1", "louvor Communion2", "louvor Communion3", "louvor Communion4", "louvor Communion5"], // 5 LOUVORES
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
    // Doutrina / Oração
    date: findNextFriday(),
    cult: 'Doutrina / Oração',
    praises: [praises?.friday[getWeekNumber() - 1], praises?.friday[getWeekNumber()]],
    vocals: musicians.vocals.friday,
    instrumentalists: musicians.instrumentalists.friday
  },
  {
    // EBD 
    date: findNextSunday(),
    cult: getSundaysInMonth() === getWeekNumber() ? 'EBD com Ceia' : 'EBD',
    praises: getSundaysInMonth() === getWeekNumber() ? praises.supper : praises.ebd,
    vocals: musicians.vocals.ebd,
    instrumentalists: musicians.instrumentalists.ebd
  },
  {
    // Culto de Louvor e Pregação 
    date: findNextSunday(),
    cult: 'Louvor e Pregação',
    praises: SelectPraiseSunday(getWeekNumber()),
    hcc: [praises?.hcc[getWeekNumber() - 1], praises?.hcc[getWeekNumber()]],
    vocals: ["Edmilson", "Edvan", getWeekNumber() % 2 === 0 ? "Fernanda" : "Paulinha", musicians.vocals.sunday[getWeekNumber() - 1]],
    instrumentalists: ["Wesley", "Annes", getWeekNumber() % 2 === 0 ? "André" : "Thiago"]
  },
  {
    date: findNextSaturday(),
    cult: 'PSH',
    praises: [praises?.psh[getWeekNumber() - 1], praises?.psh[getWeekNumber()], praises?.psh[getWeekNumber() + 1]],
    vocals: musicians.vocals.psh[getWeekNumber() - 1],
    instrumentalists: musicians.instrumentalists.psh[getWeekNumber() - 1]
  }
]


const otherscales = [
  {
    date: parseDate('24/12/2023'),
    cult: 'Culto Especial de Natal',
    praises: [""],
    vocals: ["Edmilson", "Edvan", "Fernanda", "Laís", "Paulinha"]
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

function parseDate(dateString) {
  // Divide a string da data em dia, mês e ano
  const [day, month, year] = dateString.split('/');

  // Criar um objeto de data JavaScript com o dia, mês e ano
  const date = new Date(year, month - 1, day);

  return date;
}





function findNextSunday() {
  const now = new Date();
 
  // Encontre o próximo dia que seja domingo
  let nextSunday = new Date(now.getTime());
  while (nextSunday.getDay() !== 0) {
     nextSunday.setDate(nextSunday.getDate() + 1);
  }
 
  return nextSunday;
 }



function findNextFriday() {
  const now = new Date();

  // Encontre o próximo dia que seja sexta-feira
  let nextFriday = new Date(now.getTime());
  while (nextFriday.getDay() !== 5) {
     nextFriday.setDate(nextFriday.getDate() + 1);
  }
 
  return nextFriday;
 }



function findNextSaturday() {
  const now = new Date();

  // Encontre o próximo dia que seja sexta-feira
  let nextFriday = new Date(now.getTime());
  while (nextFriday.getDay() !== 6) {
     nextFriday.setDate(nextFriday.getDate() + 1);
  }
 
  return nextFriday;
 }



function getWeekNumber() {
  // Retorna o número da semana com base na data atual
  var today = new Date();
  var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var pastDaysOfMonth = today.getDate() - 1;
  var weekNumber = Math.ceil((pastDaysOfMonth + firstDayOfMonth.getDay() + 1) / 7);
  return weekNumber;
}

function getSundaysInMonth() {
  // Retorna o número de domingos em um mês específico
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

const uniqueItems = praises.sunday?.concat(praises.friday, praises.sundayprelude, praises.supper, praises.sundaycommunion).filter((item, index, array) => {
  return array.indexOf(item) === index;
});

function getTons(n) {
  // Retorna o tom de uma escala com base no nome fornecido
  for (let i = 0; i < escala.length; i++) {
    if (escala[i].name === n) return escala[i].tom;
  }
  return null; // caso não encontre, retorna null
}

const width = window.innerWidth;
const widthInPx = parseInt(width / 4.7);


function ListPraises() {
  return (
    <div style={{ marginBottom: 30, padding: 6 }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', padding: '0px 30px' }}>
        <p style={{ marginRight: 6, fontWeight: 300, fontSize: 14, }}>Em Árvores Verdes e PSH, deverão ser trabalhados esses {uniqueItems.length} louvores nos proximos 30 dias.</p>
      </div>


      <div style={{ display: 'flex', overflow: 'scroll', height: 80, gap: 8, padding: '18px 6px' }}>
        {
          uniqueItems.map((pray) => {
            return (
              <div style={{ flexWrap: 'wrap', padding: '0px 12px', boxShadow: '0px 1px 3px #00000030', position: 'relative', minWidth: widthInPx, borderRadius: '18px 0px 18px 0px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ textAlign: 'center', fontWeight: 300, fontSize: 15, color: '#000' }}>{pray}</strong>
                {getTons(pray) ? <strong style={{ boxShadow: '1px 1px 5px #00000040', fontWeight: 500, position: 'absolute', bottom: -12, left: 6, backgroundColor: '#222', fontSize: 14, padding: '2px 12px', borderRadius: 12, color: '#fff' }}>{getTons(pray)}</strong> : null}
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
      <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 800, }}>ESCALA DE LOUVOR ADONAI</h1>

      <ListPraises />

      {sortedScales.map((scale, index) => {
        return (
          <CalendarItem key={index} data={scale} />
        )
      })}

      <p style={{ textAlign: 'center', marginTop: 50, fontWeight: 300 }}>Ministério de Louvor Adonai</p>
    </div>
  );
}
