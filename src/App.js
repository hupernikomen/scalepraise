import CalendarItem from './CalendarItem';
import { useEffect, useState } from 'react';

const listaLouvores = require('./utils/louvores.json');

export default function App() {
  const [louvoresTocador, setLouvoresTocador] = useState([]);
  const [tipoLouvor, setTipoLouvor] = useState('');
  const tocadores = ['Andre', 'Thiago', 'Warley', 'Rhuan'];
  const [tocador, setTocador] = useState('');

  useEffect(() => {
    buscaTocador(tocador, tipoLouvor);
  }, [tocador, tipoLouvor]);

  // Musicos
  const musicos = {
    instrumentistas: {
      sexta: ['Wesley', 'Warley'],
      psh: ['Thiago', 'Andre', 'Warley', 'Rhuan', '[ Escolher ]'],
      ebd: ['Annes']
    },

    vocalistas: {
      sexta: ['Lidiane', 'Laís', 'Edvan'],
      psh: [['Wilson', 'Paulinha'], ['Kelviane', 'Fernanda'], ['Edmilson', 'Fernanda'], ['Lidiane', 'Duda', 'Laís'], [('Fernanda', 'Paulinha')]],
      ebd: ['Wilson', 'Paulinha'],
      domingonoite: ['Laís', 'Kelviane', 'Lidiane', 'Duda', '[ Escolher ]']
    }
  };

  // Revesamento do guitarrista com base no numero da semana
  // Revesamento de guitarrista para o domingo a noite
  const tocadorPSH = musicos.instrumentistas.psh[numeroDaSemana() - 1];
  const tocadorIbav = numeroDaSemana() % 2 === 0 ? 'André' : 'Thiago';

  var moment = require('moment');
  var data_hora_atual = new Date();

  const posicaoLouvor = moment(data_hora_atual).startOf('isoWeek').format('ww');

  const buscaLouvores = (tipo, tocador, i) => {
    const index = i - 1;
    const listaTipo = listaLouvores.filter((item) => item.tipo === tipo);
    const listatocador = listaTipo.filter((item) => item.tocadores?.indexOf(tocador) > -1);

    const posicao = index - Math.floor(index / listatocador.length) * listatocador.length;
    return listatocador[posicao];
  };

  const escalas = [
    // Doutrina / Oração
    {
      status: true, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximaSexta(),
      culto: 'Doutrina / Oração',
      louvores: [buscaLouvores('primeiromomento', 'Warley', posicaoLouvor), buscaLouvores('primeiromomento', 'Warley', posicaoLouvor + 1)],
      vocalistas: musicos.vocalistas.sexta,
      instrumentistas: musicos.instrumentistas.sexta
    },

    // EBD
    {
      status: true, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximoDomingo(),
      culto: numeroDeDomingosMes() === numeroDaSemana() ? 'EBD com Ceia' : 'EBD',
      louvores: [],
      vocalistas: musicos.vocalistas.ebd,
      instrumentistas: musicos.instrumentistas.ebd
    },

    // Culto de Louvor e Pregação
    {
      status: true, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximoDomingo(),
      culto: 'Louvor e Pregação',
      louvores: [buscaLouvores('preludio', tocadorIbav, posicaoLouvor), buscaLouvores('primeiromomento', tocadorIbav, posicaoLouvor + 1), buscaLouvores('comunhao', tocadorIbav, posicaoLouvor + 2)],
      hcc: [],
      vocalistas: ['Edmilson', 'Edvan', numeroDaSemana() % 2 === 0 ? 'Fernanda' : 'Paulinha', musicos.vocalistas.domingonoite[numeroDaSemana() - 1]],
      instrumentistas: ['Wesley', 'Annes', tocadorIbav]
    },

    // Culto PSH
    {
      status: true, // Defina false para ocultar caso tenha outro culto substituindo esse
      data: proximoSabado(),
      culto: 'PSH',
      louvores: [buscaLouvores('preludio', tocadorPSH, posicaoLouvor), buscaLouvores('primeiromomento', tocadorPSH, posicaoLouvor + 1), buscaLouvores('comunhao', tocadorPSH, posicaoLouvor + 2)],
      vocalistas: musicos.vocalistas.psh[numeroDaSemana() - 1],
      instrumentistas: musicos.instrumentistas.psh[numeroDaSemana() - 1]
    },
    // ________________________________________

    {
      data: converteData('29/12/2023'),
      culto: 'Culto Oração Especial',
      louvores: [''],
      vocalistas: ['Edvan', 'Laís', 'Lidiane'],
      instrumentistas: ['Wesley', 'Warley']
    },
    {
      data: converteData('24/12/2023'),
      culto: 'Culto Especial Natal',
      louvores: ['Bom estarmos aqui', 'Isaias 9', 'Nada além do sangue', 'Agnus Dei', 'CC 30 - Noite de paz'],
      vocalistas: ['Edmilson', 'Edvan', 'Fernanda', 'Laís', 'Paulinha'],
      instrumentistas: ['Wesley', 'Warley', 'André', 'Annes']
    },
    {
      data: converteData('31/12/2023'),
      culto: 'Culto Especial Ano Novo',
      louvores: ['Renova-me', 'Nada além do sangue', 'Agnus Dei', 'CC 560 - Ano Novo', 'CC 456 - O Estandarte'],
      vocalistas: ['Wilson', 'Kelviane', 'Duda', 'Lidiane', 'Paulinha'],
      instrumentistas: ['Wesley', 'André', 'Thiago', 'Annes']
    }
  ];

  //Converte data String em data Date
  function converteData(inData) {
    // Divide a string da data em dia, mês e ano
    const [day, month, year] = inData.split('/');

    // Criar um objeto de data JavaScript com o dia, mês e ano
    const data = new Date(year, month - 1, day);
    return data;
  }

  // Encontre o próximo dia que seja sexta-feira
  function proximaSexta() {
    let now = new Date();
    let nextFriday = new Date(now.getTime());
    while (nextFriday.getDay() !== 5) {
      nextFriday.setDate(nextFriday.getDate() + 1);
    }
    return nextFriday;
  }

  // Encontre o próximo dia que seja sexta-feira
  function proximoSabado() {
    let now = new Date();
    let nextFriday = new Date(now.getTime());
    while (nextFriday.getDay() !== 6) {
      nextFriday.setDate(nextFriday.getDate() + 1);
    }

    return nextFriday;
  }

  // Encontre o próximo dia que seja domingo
  function proximoDomingo() {
    let now = new Date();
    let nextSunday = new Date(now.getTime());
    while (nextSunday.getDay() !== 0) {
      nextSunday.setDate(nextSunday.getDate() + 1);
    }
    return nextSunday;
  }

  function numeroDaSemana() {
    // Retorna o número da semana com base na data atual
    let today = new Date();
    let primeiroDiaDoMes = new Date(today.getFullYear(), today.getMonth(), 1);
    let diasPassadosDoMes = today.getDate() - 1;
    let numeroDaSemana = Math.ceil((diasPassadosDoMes + primeiroDiaDoMes.getDay() + 1) / 7);
    return numeroDaSemana;
  }

  function numeroDeDomingosMes() {
    // Retorna o número de domingos em um mês específico
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let domingos = 0;

    for (let day = 1; day <= 31; day++) {
      let data = new Date(year, month, day);
      if (data.getMonth() === month && data.getDay() === 0) {
        domingos++;
      }
    }

    return domingos;
  }

  // Coloca as datas em ordem cronologica
  const ordenaEscala = escalas.sort((a, b) => {
    return moment(a.data) - moment(b.data);
  });

  // Busca o Tocador com base no tipo de louvor
  function buscaTocador(tocador, tipo) {
    const louvorEncontrado = listaLouvores.filter((louvor) => louvor.tocadores?.includes(tocador) && louvor.tipo === tipo);
    setLouvoresTocador(louvorEncontrado);
  }

  return (
    <div style={{ padding: 12 }}>
      <h1 style={{ margin: '30px 10px', fontSize: 24, fontWeight: 800 }}>ESCALA DE LOUVOR</h1>

      <div>
        <label style={{ margin: '10px' }}>Encontre Louvores</label>
        <div style={{ display: 'flex', margin: '6px 0', gap: 6 }}>
          <select style={{ height: 28, padding: '6px', borderRadius: 6, border: 0, outline: 'none' }} onChange={(e) => setTocador(e.target.value)}>
            <option>Tocador</option>
            {tocadores.map((tocador) => (
              <option>{tocador}</option>
            ))}
          </select>

          <select style={{ height: 28, padding: '6px', borderRadius: 6, border: 0, outline: 'none' }} onChange={(e) => setTipoLouvor(e.target.value)}>
            <option>Tipo</option>
            <option value={'preludio'}>Prelúdio</option>
            <option value={'primeiromomento'}>Primeiro Momento</option>
            <option value={'comunhao'}>Comunhão</option>
          </select>
        </div>

        <div style={{ margin: '18px 0' }}>
          {louvoresTocador.map((louvor) => {
            return (
              <div style={{ borderLeft: '4px solid #795548', fontSize: 15, fontWeight: 300, paddingLeft: '12px', margin: '2px 12px', backgroundColor: '#fff' }}>
                {louvor?.louvor}
                {louvor?.tom ? <span style={{ fontWeight: 600 }}> - ♪ {louvor?.tom}</span> : null}
              </div>
            );
          })}
        </div>
      </div>

      {ordenaEscala.map((scale, index) => (
        <CalendarItem key={index} data={scale} />
      ))}

      <p style={{ textAlign: 'center', marginTop: 50, fontWeight: 300 }}>Ministério de Louvor Adonai</p>
    </div>
  );
}
