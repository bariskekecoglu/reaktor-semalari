import { useMemo, useState } from 'react';
import type { GuideCard, GuideCategory } from './guideCatalog';
import { GUIDE_CATEGORIES } from './guideCatalog';
import { normalize } from './search';
import type { ReactorId } from '../reactors/shared/types';

export function GuideLibrary({ cards, reactor, onAsk }: {
  cards: readonly GuideCard[]; reactor: ReactorId; onAsk: (question: string) => void;
}) {
  const [category, setCategory] = useState<GuideCategory | ''>(() => reactor.toUpperCase() as GuideCategory);
  const [filter, setFilter] = useState('');
  const [limit, setLimit] = useState(8);
  const questions = useMemo(() => {
    const words = normalize(filter).split(' ').filter(Boolean);
    return cards.filter((c) => (!category || c.category === category) &&
      words.every((w) => normalize([c.question, ...c.variants].join(' ')).includes(w)));
  }, [cards, category, filter]);
  return (
    <details className="guide-library">
      <summary>Hazır sorular · {cards.length} cevap</summary>
      <label>
        Konu
        <select value={category} onChange={(e) => { setCategory(e.target.value as GuideCategory | ''); setLimit(8); }}>
          <option value="">Tüm konular</option>
          {GUIDE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label>
        Sorularda ara
        <input type="search" value={filter} onChange={(e) => { setFilter(e.target.value); setLimit(8); }} placeholder="Ör. kondenser, ksenon, ilerleme" />
      </label>
      <p>{questions.length} soru bulundu.</p>
      <ul>
        {questions.slice(0, limit).map((c) => <li key={c.id}><button type="button" className="link" onClick={() => onAsk(c.question)}>{c.question}</button></li>)}
      </ul>
      {questions.length > limit && <button type="button" onClick={() => setLimit((n) => n + 10)}>Daha fazla soru göster</button>}
      {questions.length === 0 && <p>Bu filtrede soru bulunamadı. Konuyu değiştirin veya aramayı kısaltın.</p>}
    </details>
  );
}
