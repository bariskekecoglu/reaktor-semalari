import type { ReactorConfig } from '../reactors/shared/types';
import { formatSource, getSource } from '../knowledge/sources';
import { REACTOR_SAFETY_NOTES, SAFETY_TOPICS, safetyEquipment, safetyTopic, type SafetyTopicId } from './catalog';
import './safety.css';

export function SafetyPanel({ config, topicId, onTopic, onClose, onAsk, onInspect }: {
  config: ReactorConfig; topicId: SafetyTopicId; onTopic: (id: SafetyTopicId) => void;
  onClose: () => void; onAsk: (question: string) => void; onInspect: (ids: string[]) => void;
}) {
  const topic = safetyTopic(topicId);
  const note = REACTOR_SAFETY_NOTES[config.id];
  const equipment = safetyEquipment(config.id, topicId);
  return (
    <section className="safety-panel" aria-labelledby="safety-title">
      <header className="safety-heading">
        <div><p className="eyebrow">GÜVENLİK SİSTEMLERİ · {config.shortName}</p><h2 id="safety-title">Üç temel işlev, birden fazla koruma katmanı</h2></div>
        <button type="button" onClick={onClose}>Katmanı kapat</button>
      </header>
      <p>Reaktiviteyi kontrol et · Yakıtı soğut · Radyoaktif maddeyi tut</p>
      <nav className="safety-topics" aria-label="Güvenlik konuları">
        {SAFETY_TOPICS.map(t => <button type="button" key={t.id} className={topicId === t.id ? 'on' : ''} aria-pressed={topicId === t.id} onClick={() => onTopic(t.id)}>{t.title}</button>)}
      </nav>
      <div className="safety-content">
        <article aria-labelledby="safety-topic-title">
          <h3 id="safety-topic-title">{topic.title}</h3><p>{topic.summary}</p>
          <ol className="safety-chain" aria-label="Kavramsal ilişki; fiziksel borulama değildir">{topic.steps.map((step, i) => <li key={step}><span aria-hidden="true">{i + 1}</span>{step}</li>)}</ol>
          <p className="safety-distinction"><strong>Temel ayrım:</strong> {topic.distinction}</p>
          <div className="safety-actions">
            <button type="button" className="primary" onClick={() => onAsk(`${config.shortName} ${topic.question}`)}>Asistana sor</button>
            {equipment.length > 0 && <button type="button" onClick={() => onInspect(equipment)}>Şemada ilişkili parçaları vurgula</button>}
          </div>
        </article>
        <aside className="safety-scope" aria-label="Reaktöre özgü kapsam">
          <h3>{config.shortName} için kapsam</h3><p>{note.text}</p>
          <p>Bu katman kavramsal eğitim içindir. Sistemlerin devreye girmesi, kapasitesi ve kaza sonuçları hesaplanmaz.</p>
          <details><summary>Kaynaklar ve kapsam</summary><ul>{[...new Set([...topic.sourceIds, ...note.sourceIds])].map(id => {
            const source = getSource(id);
            return source && <li key={id}>{source.url ? <a href={source.url} target="_blank" rel="noopener noreferrer">{formatSource(source)}</a> : formatSource(source)}</li>;
          })}</ul></details>
        </aside>
      </div>
    </section>
  );
}
