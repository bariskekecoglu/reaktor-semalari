import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { buildActionRegistry, localKnowledge as kb } from '../knowledge/kb';
import { formatSource, getSource, SOURCE_KIND_LABEL } from '../knowledge/sources';
import type { AssistantAction } from './actions';
import { actionReactor } from './actions';
import { guideCatalog, localAnswer } from './localGuide';
import { GuideLibrary } from './GuideLibrary';
import { validateActions } from './actions';
import { REACTOR_NAME } from './execute';
import type { AssistantContext, AssistantReply } from './types';


interface Msg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  reply?: AssistantReply;
}

interface Props {
  open: boolean;
  onClose: () => void;
  context: AssistantContext;
  /** “Şu anda gösterilen: …” */
  contextLabel: string;
  actionText: (a: AssistantAction) => string;
  onRun: (a: AssistantAction) => void;
  hasHighlight: boolean;
  onClearHighlight: () => void;
  restoreLabel: string | null;
  onRestore: () => void;
  /** Dışarıdan gönderilen soru (ör. dersteki “Asistana sor”). */
  seed?: { q: string; n: number } | null;
}

const reg = buildActionRegistry();

export function AssistantPanel({ open, onClose, context, contextLabel, actionText, onRun, hasHighlight, onClearHighlight, restoreLabel, onRestore, seed }: Props) {
  const [detailed, setDetailed] = useState(true);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const pendingRef = useRef(false);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToEnd = useRef(true);

  // Açılınca odak giriş alanına (mobilde klavye açılır; panel içeriği görünür alanda kalır).
  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Yeni ileti gelince, kullanıcı en alttaysa listeyi kaydır; odağı ele geçirme.
  useEffect(() => {
    const el = listRef.current;
    if (el && stickToEnd.current) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const seedDone = useRef(0);
  useEffect(() => {
    if (!open || !seed || seed.n === seedDone.current) return;
    seedDone.current = seed.n;
    void ask(seed.q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed]);


  const push = (m: Omit<Msg, 'id'>) => setMsgs((xs) => [...xs, { ...m, id: ++idRef.current }]);

  const autoRun = (reply: AssistantReply) => {
    // Yalnız ilk işlem ve yalnız reaktör değişimi gerektirmiyorsa kendiliğinden çalışır (simülasyon sıfırlanmaz).
    const first = reply.actions[0];
    if (!first || reply.clarify) return;
    const r = actionReactor(first);
    if (r && r !== context.reactor) return;
    onRun(first);
  };

  const ask = (question: string) => {
    const q = question.trim().slice(0, 500);
    if (!q || pendingRef.current) return;
    pendingRef.current = true;
    try {
      const previous = [...msgs].reverse().find((m) => m.reply)?.reply;
      const answer = localAnswer(kb, q, context, { detailed, previous });
      const reply = { ...answer, actions: validateActions(answer.actions, reg).actions };
      push({ role: 'user', text: q });
      setInput('');
      push({ role: 'assistant', text: reply.text, reply });
      setStatus(reply.text);
      autoRun(reply);
    } finally { pendingRef.current = false; }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };
  const onInputKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void ask(input);
    }
  };
  const onPanelKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <aside className="assistant" role="dialog" aria-modal="false" aria-labelledby="assistant-title" onKeyDown={onPanelKey}>
      <header className="assistant-head">
        <div>
          <h2 id="assistant-title">Asistan</h2>
          <p className="assistant-mode">Hazırlanmış cevaplar · cihazınızda çalışır</p>
        </div>
        <button type="button" className="assistant-close" onClick={onClose} aria-label="Asistanı kapat">
          ✕
        </button>
      </header>

      <div className="assistant-context">
        <p>
          <span className="eyebrow">Şu anda gösterilen</span> {contextLabel}
        </p>
        {(hasHighlight || restoreLabel) && (
          <div className="assistant-context-actions">
            {hasHighlight && (
              <button type="button" onClick={onClearHighlight}>
                Vurguyu temizle
              </button>
            )}
            {restoreLabel && (
              <button type="button" onClick={onRestore}>
                {restoreLabel}
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className="assistant-log"
        ref={listRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToEnd.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
        tabIndex={0}
        role="log"
        aria-label="Asistan iletileri"
      >
        <GuideLibrary cards={guideCatalog(kb)} reactor={context.reactor} onAsk={ask} />
        {msgs.length === 0 && (
          <div className="assistant-empty">
            <p>Örnek sorular:</p>
            <ul>
              {['PWR’de basınçlandırıcı ne işe yarar?', 'BWR’de buhar nerede oluşuyor?', 'VVER’in buhar üretecini göster.', 'Ksenon neden kapatmadan sonra artabiliyor?'].map((s) => (
                <li key={s}>
                  <button type="button" className="link" onClick={() => void ask(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={`assistant-msg from-${m.role}`}>
            {m.role === 'user' ? (
              <p>
                <span className="sr-only">Siz: </span>
                {m.text}
              </p>
            ) : (
              <MessageBody msg={m} actionText={actionText} onRun={onRun} onAsk={(q) => void ask(q)} currentReactor={context.reactor} />
            )}
          </div>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <form className="assistant-form" onSubmit={onSubmit}>
        <label htmlFor="assistant-input" className="sr-only">
          Sorunuz
        </label>
        <textarea
          id="assistant-input"
          ref={inputRef}
          rows={2}
          maxLength={500}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="Ör. “VVER’in buhar üretecini göster”"
          enterKeyHint="send"
        />
        <button type="submit" className="primary" disabled={!input.trim()}>
          Sor
        </button>
      </form>
      <div className="assistant-foot">
        <label>
          <input type="checkbox" checked={detailed} onChange={(e) => setDetailed(e.target.checked)} /> Ayrıntılı açıkla
        </label>
        <button type="button" className="link" onClick={() => setMsgs([])} disabled={msgs.length === 0}>
          Sohbeti temizle
        </button>
      </div>
      <p className="assistant-service">Sorularınız sunucuya gönderilmez. Sohbet yalnız bu sekmede tutulur.</p>
    </aside>
  );
}

function MessageBody({
  msg,
  actionText,
  onRun,
  onAsk,
  currentReactor,
}: {
  msg: Msg;
  actionText: (a: AssistantAction) => string;
  onRun: (a: AssistantAction) => void;
  onAsk: (q: string) => void;
  currentReactor: string;
}) {
  const r = msg.reply;
  return (
    <>
      <p className="assistant-who">Yerel rehber</p>
      <p>{msg.text}</p>
      {r?.clarify && r.clarify.options.length > 0 && (
        <div className="assistant-actions" role="group" aria-label={r.clarify.question}>
          {r.clarify.options.map((o) => (
            <button key={o.label} type="button" onClick={() => onAsk(o.query)}>
              {o.label}
            </button>
          ))}
        </div>
      )}
      {r && r.actions.length > 0 && (
        <div className="assistant-actions" role="group" aria-label="Uygulamada göster">
          {r.actions.map((a, i) => {
            const ar = actionReactor(a);
            const switching = ar && ar !== currentReactor;
            return (
              <button key={i} type="button" onClick={() => onRun(a)}>
                {actionText(a)}
                {switching && <small> ({REACTOR_NAME[ar]}’ye geçer; simülasyon başa döner)</small>}
              </button>
            );
          })}
        </div>
      )}
      {r && r.sourceIds.length > 0 && (
        <details className="assistant-sources">
          <summary>Kaynaklar ({r.sourceIds.length})</summary>
          <ul>
            {r.sourceIds.map((id) => {
              const s = getSource(id);
              if (!s) return null;
              return (
                <li key={id}>
                  <span className={`src-chip src-${s.kind}`}>{SOURCE_KIND_LABEL[s.kind]}</span> {formatSource(s)}
                  {s.url && (
                    <>
                      {' '}
                      <a href={s.url} target="_blank" rel="noreferrer noopener">
                        bağlantı
                      </a>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </details>
      )}
      {r?.rejected && <p className="assistant-note">Doğrulanamayan {r.rejected.length} öneri uygulanmadı.</p>}
    </>
  );
}
