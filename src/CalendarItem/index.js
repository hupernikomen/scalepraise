import { useEffect, useState } from 'react';
import './estilo.css';
import moment from 'moment';
const escala = require('../utils/praisesList2.json');

const listaLouvores = require('../utils/praisesList2.json');

export default function CalendarItem({ data }) {
  const tocadores = ['André', 'Thiago', 'Warley', 'Rhuan'];
  const [clicado, setClicado] = useState(false);
  const [tocador, setTocador] = useState('');
  const [louvoresTocador, setLouvoresTocador] = useState([]);
  const [tipoLouvor, setTipoLouvor] = useState('');

  useEffect(() => {
    buscaTocador(tocador, tipoLouvor);
  }, [tocador, tipoLouvor]);

  const semana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  if (moment(data.date).isBefore(moment(), 'day')) {
    return null;
  }

  // Busca hino do cantor cristao com base no numero
  function cantorCristao(num) {
    for (let i = 0; i < listaLouvores.length; i++) {
      if (listaLouvores[i]?.num === num) return listaLouvores[i].louvor;
    }
    return null; // caso não encontre, retorna null
  }

  // Busca o Tocador com base no tipo de louvor
  function buscaTocador(tocador, tipo) {
    const louvorEncontrado = escala.filter(
      (louvor) => louvor.tocadores?.includes(tocador) && louvor.tipo === tipo
    );
    setLouvoresTocador(louvorEncontrado.map((louvor) => louvor.louvor));
  }

  return (
    <div className="container">
      <div className="top">
        <h1 className="title" style={{ color: data.cult === 'PSH' ? '#795548' : '#00796B' }}>
          {data.culto}
        </h1>

        <div className="date">
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: data.cult === 'PSH' ? '#795548' : '#00796B'
            }}
          >
            {semana[moment(data.date).day()]}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 400,
              marginTop: 1,
              marginRight: 2,
              color: '#00000070'
            }}
          >
            {moment(data.date).format('DD/MM')}
          </span>
        </div>
      </div>
      <div
        onClick={() => setClicado(!clicado)}
        style={{ display: 'grid', marginBottom: 12, gap: 2 }}
      >
        {data?.louvores?.map((louvor, index) => {
          const tom = escala.find((item) => item.louvor === louvor);

          return (
            <label key={index} style={{ fontSize: 15, fontWeight: 300, alignItems: 'center' }}>
              - {louvor} {index === 0 && data.culto === 'Louvor e Pregação' ? ' [ Prelúdio ]' : ''}
              <strong style={{ marginLeft: 6 }}>{tom?.tom}</strong>
            </label>
          );
        })}
        {data.hcc?.map((hcc, index) => {
          return (
            <label key={index} style={{ fontSize: 15, fontWeight: 300 }}>
              CC {hcc} - {cantorCristao(hcc)}{' '}
            </label>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          borderWidth: 0.5,
          borderTop: '1px solid #aaa',
          paddingTop: 12,
          gap: 6
        }}
      >
        {data.vocalistas?.concat(data?.instrumentistas).map((musicos, index) => {
          return (
            <strong key={index} style={{ fontSize: 15, fontWeight: 300 }}>
              {musicos}
            </strong>
          );
        })}
      </div>

      {clicado ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <select
              style={{ height: 28, padding: '0px 6px', borderRadius: 6, backgroundColor: '#fff' }}
              onChange={(e) => setTocador(e.target.value)}
            >
              {tocadores.map((guitarist) => (
                <option>{guitarist}</option>
              ))}
            </select>

            <select
              style={{ height: 28, padding: '0px 6px', borderRadius: 6, backgroundColor: '#fff' }}
              onChange={(e) => setTipoLouvor(e.target.value)}
            >
              <option value={'prelude'}>Prelúdio</option>
              <option value={'firstmoment'}>Primeiro Momento</option>
              <option value={'communion'}>Comunhão</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            {louvoresTocador.map((praise) => {
              return <div style={{ fontSize: 15, fontWeight: 300 }}>- {praise}</div>;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
