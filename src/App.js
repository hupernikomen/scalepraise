import CalendarItem from './CalendarItem';
import { useEffect, useState } from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { proximo, numeroDaSemana, numeroDeDomingosMes, converteData } from './functions';

const listaLouvores = require('./utils/louvores.json');
const versiculos = require('./utils/versiculos.json');
const hinos = require('./utils/selecaohinos.json');

export default function App() {
  const [louvoresTocador, setLouvoresTocador] = useState([]);
  const [tipoLouvor, setTipoLouvor] = useState('');
  const tocadores = ['Andre', 'Thiago', 'Warley', 'Rhuan'];
  const [tocador, setTocador] = useState('');
  const [obs, setObs] = useState([]);

  var moment = require('moment');
  var data_hora_atual = new Date();

  const numDaSemanaNoAno = moment(data_hora_atual).startOf('isoWeek').format('ww');

  useEffect(() => {
    buscaTocador(tocador, tipoLouvor);
  }, [tocador, tipoLouvor]);

  const [sortVerso, setSortVerso] = useState(Math.floor(Math.random() * versiculos.length));

  useEffect(() => {
    // setTimeout(() => {
    //   setObs([
    //     {
    //       data: new Date(2024, 1, 7),
    //       titulo: 'Reunião',
    //       mensagem: 'No domingo do dia 07/01, após o culto, teremos uma reunião para tratarmos do ano de 2024 '
    //     }
    //   ]);
    // }, 7000);

    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * versiculos.length);
      setSortVerso(index);
    }, 8000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Musicos
  const musicos = {
    instrumentistas: {
      sexta: ['Wesley', 'Warley'],
      psh: ['Thiago', 'Andre', 'Warley', 'Rhuan', 'Thiago'],
      ebd: ['Annes']
    },

    vocalistas: {
      oracaoedoutrina: ['Lidiane', 'Laís', 'Edvan'],
      psh: [
        ['Wilson', 'Paulinha'],
        ['Kelviane', 'Fernanda'],
        ['Edmilson', 'Fernanda'],
        ['Lidiane', 'Laís', 'Edvan'],
        ['Convite', 'Convite']
      ], // COM CHUVA
      ebd: ['Wilson', 'Paulinha']
    }
  };

  let tocadorIbav = null;
  if (numeroDaSemana() === numeroDeDomingosMes()) {
    tocadorIbav = 'Warley';
  } else if (numeroDaSemana() % 2) {
    tocadorIbav = 'Andre';
  } else {
    tocadorIbav = 'Thiago';
  }

  const buscaLouvores = (tipo, tocador, numDaSemanaNoAno) => {
    const listaTipo = listaLouvores.filter((item) => item.tipo === tipo);
    const listatocador = listaTipo.filter((item) => item.tocadores?.indexOf(tocador) > -1);

    // const posicao = index - Math.floor(index / listatocador.length) * listatocador.length;
    const posicao = (numDaSemanaNoAno - 1) % listatocador.length;
    return listatocador[posicao] || '[ Livre Escolha ]';
  };

  const escalas = [
    {
      culto: 'Doutrina / Oração',
      data: proximo(5),
      louvores: [buscaLouvores('sexta', 'Warley', numDaSemanaNoAno - 1), buscaLouvores('sexta', 'Warley', numDaSemanaNoAno)],
      vocalistas: musicos.vocalistas.oracaoedoutrina,
      instrumentistas: musicos.instrumentistas.sexta,
      status: true
    },
    {
      data: proximo(0),
      culto: numeroDeDomingosMes() === numeroDaSemana() ? 'EBD com Ceia' : 'EBD',
      louvores: [],
      vocalistas: musicos.vocalistas.ebd,
      instrumentistas: musicos.instrumentistas.ebd,
      status: true
    },
    {
      culto: 'Louvor e Pregação',
      data: proximo(0),
      louvores: [buscaLouvores('preludio', tocadorIbav, numDaSemanaNoAno), buscaLouvores('primeiromomento', tocadorIbav, numDaSemanaNoAno), buscaLouvores('comunhao', tocadorIbav, numDaSemanaNoAno)],
      hcc: hinos[parseInt(numDaSemanaNoAno)],
      vocalistas: ['Edmilson', 'Edvan', ...VozesFemininas()],
      instrumentistas: ['Wesley', 'Annes', tocadorIbav],
      status: true
    },
    {
      culto: 'PSH',
      data: proximo(6),
      louvores: [
        buscaLouvores('preludio', musicos.instrumentistas.psh[0], numDaSemanaNoAno),
        buscaLouvores('primeiromomento', musicos.instrumentistas.psh[0], numDaSemanaNoAno + 1),
        buscaLouvores('primeiromomento', musicos.instrumentistas.psh[0], numDaSemanaNoAno + 2),
        buscaLouvores('comunhao', musicos.instrumentistas.psh[0], numDaSemanaNoAno + 2)
      ],
      vocalistas: musicos.vocalistas.psh[numeroDaSemana() - 1],
      instrumentistas: [musicos.instrumentistas.psh[numeroDaSemana() - 1], 'Annes'],
      status: true
    },
    // ________________________________________

    {
      data: converteData('29/12/2023'),
      culto: 'Culto Oração Especial',
      louvores: [''],
      vocalistas: ['Edvan', 'Laís', 'Lidiane'],
      instrumentistas: ['Wesley', 'Warley']
    }
  ];

  // Busca o Tocador com base no tipo de louvor
  function buscaTocador(tocador, tipo) {
    const louvorEncontrado = listaLouvores.filter((louvor) => louvor.tocadores?.includes(tocador) && louvor.tipo === tipo);
    setLouvoresTocador(louvorEncontrado);
  }

  // Coloca as datas em ordem cronologica
  const ordenaEscala = escalas.sort((a, b) => {
    return moment(a.data) - moment(b.data);
  });

  // Seleção de vozes femininas para louvor e pregação
  function VozesFemininas() {
    const voz1 = ['Lais', 'Paulinha', 'Kelviane', 'Fernanda', 'Lidiane'];
    const voz2 = ['Lais', 'Kelviane', 'Lidiane'];

    let i1 = (numDaSemanaNoAno - 1) % voz1.length;
    let i2 = (numDaSemanaNoAno - 1) % voz2.length;

    if (voz1[i1] === voz2[i2]) {
      i1++;
    }

    let vozList = [voz1[i1], voz2[i2]];

    if (vozList.indexOf('Paulinha') === -1) {
      vozList.push('Paulinha');
    }

    return vozList;
  }

  function SorteiaVersiculo() {
    return (
      <div style={{ padding: 18, background: '#58731e' }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
          <FiBookOpen size={16} color="#FFF" />
          <label style={{ fontSize: 26, fontWeight: 600, color: '#FFF', marginLeft: 12 }}>{versiculos[sortVerso].ref}</label>
        </div>
        <label style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 300, color: '#FFF' }}>{versiculos[sortVerso].texto}</label>
      </div>
    );
  }

  return (
    <div style={{ flex: 1 }}>
      {obs.length > 0 ? (
        <div style={{ position: 'fixed', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ width: '75%', background: '#fff', borderRadius: 6, padding: '18px 18px 50px 18px' }}>
            {obs.map((item, index) => {
              return (
                <div key={index} style={{ margin: '18px 0' }}>
                  <div style={{ textAlign: 'center', fontWeight: 400, fontSize: 20 }}>{item.titulo}</div>
                  <div style={{ fontWeight: 300, textAlign: 'center', margin: 10, fontSize: 16 }}>{item.mensagem}</div>
                </div>
              );
            })}
          </div>

          <div
            onClick={() => setObs([])}
            style={{
              borderRadius: 99,
              background: '#58731e',
              padding: '15px',
              marginTop: -25,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
              fontFamily: 'monospace'
            }}
          >
            FECHAR
          </div>
        </div>
      ) : null}

      <div
        style={{
          position: 'sticky',
          top: 0,
          boxShadow: '1px 0px 5px #00000070',
          backgroundColor: '#ffffff99',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 75
        }}
      >
        <div style={{ width: '100vw', height: 75, background: '#fff', opacity: 0.7 }} />
        <div style={{ position: 'absolute' }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#000', margin: 0 }}>ESCALA DE LOUVOR #{numDaSemanaNoAno}</h1>
          <span style={{ fontWeight: 300, fontSize: 12, marginTop: 3 }}>IGREJA BATISTA ÁRVORE DA VIDA</span>
        </div>
      </div>

      <div>{SorteiaVersiculo()}</div>

      <div style={{ padding: 18, marginTop: 20 }}>
        <div style={{ marginBottom: 30, background: '#f1f1f1', padding: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <select
              style={{ fontWeight: 300, fontSize: 15, width: '50%', background: '#fff', height: 40, padding: '0 12px', borderRadius: 6, outline: 'none' }}
              onChange={(e) => setTocador(e.target.value)}
            >
              <option>Busque Louvores</option>
              {tocadores.map((tocador, index) => (
                <option key={index}>{tocador}</option>
              ))}
            </select>

            {tocador ? (
              <select
                style={{ fontWeight: 300, fontSize: 15, width: '50%', background: '#fff', padding: '0 12px', height: 40, borderRadius: 6, outline: 'none' }}
                onChange={(e) => setTipoLouvor(e.target.value)}
              >
                <option>Momento</option>
                <option value={'preludio'}>Prelúdio</option>
                <option value={'primeiromomento'}>Primeiro Momento</option>
                <option value={'comunhao'}>Comunhão</option>
                <option value={'ceia'}>Ceia</option>
              </select>
            ) : null}
          </div>

          <div style={{ margin: 18 }}>
            {louvoresTocador.map((louvor, index) => {
              return (
                <div key={index} style={{ fontWeight: 300, alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                  - {louvor?.louvor}
                  {louvor?.tom ? <span style={{ fontWeight: 300, marginLeft: 20, color: '#795548' }}> ♪ {louvor?.tom}</span> : null}
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
    </div>
  );
}
