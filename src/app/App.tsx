import { Suspense, lazy, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { SimClock } from '../simulation/clock';
import { EducationalModel, INITIAL_POWER } from '../simulation/educationalModel';
import { SimulationContext, usePrefersReducedMotion } from '../hooks/useSimulation';
import { ViewLayoutContext, useViewLayoutState } from '../hooks/useViewLayout';
import { appReducer, initialAppState, navSnapshot, type NavSnapshot } from './appState';
import { AssistantPanel } from '../assistant/AssistantPanel';
import { actionLabel, planAction, REACTOR_NAME } from '../assistant/execute';
import type { AssistantAction } from '../assistant/actions';
import type { AssistantContext } from '../assistant/types';
import { OPS_SECTIONS } from '../reactors/pwr/operations/sections';
import { findChartEvent } from '../reactors/pwr/operations/models/xenonScenarios';
import { PWR_XENON_SHUTDOWN, getPredictLesson } from '../lessons/predict/pwrXenonShutdown';
import { PredictLessonView } from '../lessons/predict/PredictLessonView';
import { emptyPredictState, restorePredictState, type PredictState } from '../lessons/predict/predictState';
import type { PredictStepId } from '../lessons/predict/types';
import { useProgress, buildCatalog } from '../progress/useProgress';
import { ProgressPanel } from '../progress/ProgressPanel';
import { lessonHash, parseLessonHash } from '../progress/deepLink';
import type { AppState } from './appState';
import type { PredictRecord } from '../progress/progressStore';

const CATALOG = buildCatalog();
import { isChernobylStage, type ChernobylStageId } from '../reactors/rbmk/chernobyl/stages';

/** Açılışta `#ders=…` bağlantısı varsa ilgili dersle başlar (bilinmeyen kimlikler yok sayılır). */
function initFromHash(base: AppState): AppState {
  if (typeof window === 'undefined') return base;
  const link = parseLessonHash(window.location.hash, CATALOG);
  if (!link) return base;
  let s = appReducer(base, { type: 'setReactor', reactor: link.kind === 'tour' ? link.reactor : link.kind === 'chernobyl' ? 'rbmk' : 'pwr' });
  if (link.kind === 'chernobyl') return appReducer(s, { type: 'setChernobylStage', stage: link.stage });
  if (link.kind === 'tour') {
    s = appReducer(s, { type: 'setLearnMode', mode: 'tour' });
    s = appReducer(s, { type: 'lessonStep', step: link.step, count: CATALOG.tours[link.reactor].length });
  } else s = appReducer(s, { type: 'setLearnMode', mode: 'predict' });
  return { ...s, sceneEpoch: 0 };
}

const toPredictState = (r: PredictRecord | undefined): PredictState =>
  r ? restorePredictState({ ...r, step: r.step as PredictStepId }) : emptyPredictState();
import { reactors } from '../reactors/registry';
import { tourReactor } from '../reactors/meta';
import type { ReactorId } from '../reactors/shared/types';
import { SceneContext, type SceneContextValue } from '../reactors/shared/SceneContext';
import { Header } from '../components/layout/Header';
import { SceneViewport } from '../components/layout/SceneViewport';
import { SidePanel } from '../components/layout/SidePanel';
import { Legend } from '../components/layout/Legend';
import { SourcesSection } from '../components/layout/SourcesSection';
import { ControlBar } from '../components/controls/ControlBar';
import { EnergyFlow } from '../components/charts/EnergyFlow';
import { TimeChart } from '../components/charts/TimeChart';
import { LessonPanel } from '../components/educational/LessonPanel';
import { DetailDialog } from '../components/educational/DetailDialog';
import { CompareView } from '../components/educational/CompareView';

// PWR işletme modülü ayrı bir parçada yüklenir; yalnız PWR seçiliyken açılır.
const PwrOperations = lazy(() => import('../reactors/pwr/operations/PwrOperations').then((m) => ({ default: m.PwrOperations })));
const ChernobylView = lazy(() => import('../reactors/rbmk/chernobyl/ChernobylView').then(m => ({ default: m.ChernobylView })));

export function App() {
  const [clock] = useState(() => new SimClock());
  const [model] = useState(() => new EducationalModel(INITIAL_POWER));
  const reducedMotion = usePrefersReducedMotion();
  const [state, dispatch] = useReducer(appReducer, initialAppState, initFromHash);
  // Öğrenme ilerlemesi: yalnız bu cihazda (localStorage; engelliyse bellekte).
  const progressApi = useProgress();
  const [power, setPower] = useState(INITIAL_POWER);
  // Yerleşim tercihi: yalnız düzeni değiştirir; reaktör/senaryo/oynatma durumuna dokunmaz.
  const viewLayout = useViewLayoutState();

  // Tek animasyon döngüsü: uygulama ömrü boyunca bir kez başlatılır.
  useEffect(() => {
    const unsub = clock.subscribe((dt) => model.step(dt), 0);
    clock.start();
    if (import.meta.env.DEV) (window as unknown as { __sim: unknown }).__sim = { clock, model };
    return () => {
      unsub();
      clock.stop();
    };
  }, [clock, model]);

  // Hareket azaltma tercihi: animasyon duraklatılmış başlar.
  useEffect(() => {
    if (reducedMotion) clock.pause();
  }, [reducedMotion, clock]);

  const mod = reactors[state.reactor];
  const { config, lessons } = mod;

  const resetSimulation = useCallback(() => {
    model.reset(INITIAL_POWER);
    setPower(INITIAL_POWER);
    clock.reset();
  }, [clock, model]);

  const changeReactor = (id: ReactorId) => {
    if (id === state.reactor) return;
    resetSimulation();
    dispatch({ type: 'setReactor', reactor: id });
  };

  const onPower = (p: number) => {
    setPower(p);
    model.setTarget(p);
  };

  // ---------- Asistan ----------
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [navBefore, setNavBefore] = useState<NavSnapshot | null>(null);
  const [xenonScenario, setXenonScenario] = useState<string | null>(null);
  const PREDICT_ID = PWR_XENON_SHUTDOWN.id;
  const [predictState, setPredictState] = useState<PredictState>(() => {
    const saved = toPredictState(progressApi.progress.predictions[PREDICT_ID]);
    const link = typeof window !== 'undefined' ? parseLessonHash(window.location.hash, CATALOG) : null;
    return link?.kind === 'predict' && link.stepId ? restorePredictState(saved, link.stepId) : saved;
  });
  /** Ders bileşenini yeniden bağlamak için (devam et / sıfırla). */
  const [predictEpoch, setPredictEpoch] = useState(0);
  const onPredictChange = useCallback(
    (ps: PredictState) => {
      setPredictState(ps);
      progressApi.recordPredict(PREDICT_ID, ps);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progressApi.recordPredict],
  );
  /** Başka bir bölümden asistana gönderilen hazır soru. */
  const [assistantSeed, setAssistantSeed] = useState<{ q: string; n: number } | null>(null);

  const lessonIndex = useCallback((id: string) => {
    for (const r of Object.keys(reactors) as ReactorId[]) {
      const i = reactors[r].lessons.findIndex((l) => l.id === id);
      if (i >= 0) return { reactor: r, step: i, count: reactors[r].lessons.length };
    }
    return null;
  }, []);

  const runAssistantAction = (a: AssistantAction) => {
    // İlk asistan gezinmesinden önceki konum saklanır (“Önceki konuma dön”).
    if (!navBefore) setNavBefore(navSnapshot(state));
    const plan = planAction(a, state, lessonIndex);
    // Reaktör değişimi yalnız kullanıcının tıklamasıyla gelir; mevcut kural gereği simülasyon başa döner.
    if (plan.needsReactorChange) resetSimulation();
    plan.dispatches.forEach(dispatch);
  };

  const restoreNav = () => {
    if (!navBefore) return;
    if (navBefore.reactor !== state.reactor) resetSimulation();
    dispatch({ type: 'restoreNav', nav: navBefore });
    setNavBefore(null);
  };

  // Anlatım adımı kaydı ve doğrudan bağlantı (hash) eşitlemesi.
  const learningTour = state.view === 'learn' && state.learnMode === 'tour';
  const learningPredict = state.view === 'learn' && state.learnMode === 'predict' && state.reactor === 'pwr';
  const showChernobyl = state.reactor === 'rbmk' && state.view === 'scheme' && state.rbmkView === 'chernobyl';
  useEffect(() => {
    if (showChernobyl) progressApi.recordChernobyl(state.chernobylStage);
  }, [showChernobyl, state.chernobylStage, progressApi.recordChernobyl]);
  // Yalnız görünümü açmak kayıtlı “kaldığım yer”i ezmesin: adım, kullanıcı ilerleyince kaydedilir.
  // Hiç kayıt yoksa ilk görülen adım kaydedilir.
  useEffect(() => {
    if (learningTour && !progressApi.progress.last) progressApi.recordTour(state.reactor, state.lessonStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningTour, state.reactor, state.lessonStep]);
  useEffect(() => {
    const h = showChernobyl ? lessonHash({ kind: 'chernobyl', stage: state.chernobylStage }, CATALOG) : learningTour
      ? lessonHash({ kind: 'tour', reactor: state.reactor, step: state.lessonStep }, CATALOG)
      : learningPredict
        ? lessonHash({ kind: 'predict', lessonId: PREDICT_ID, stepId: predictState.step }, CATALOG)
        : '';
    if (h !== window.location.hash && (h || window.location.hash.startsWith('#ders='))) {
      window.history.replaceState(null, '', h || window.location.pathname + window.location.search);
    }
  }, [showChernobyl, state.chernobylStage, learningTour, learningPredict, state.reactor, state.lessonStep, predictState.step, PREDICT_ID]);

  // Direct links pasted into an already open tab also navigate. replaceState does not trigger this listener.
  useEffect(() => {
    const navigate = () => {
      const link = parseLessonHash(window.location.hash, CATALOG);
      if (!link) return;
      const target = link.kind === 'tour' ? link.reactor : link.kind === 'chernobyl' ? 'rbmk' : 'pwr';
      if (target !== state.reactor) resetSimulation();
      dispatch({ type: 'setReactor', reactor: target });
      if (link.kind === 'chernobyl') dispatch({ type: 'setChernobylStage', stage: link.stage });
      else if (link.kind === 'tour') {
        dispatch({ type: 'setLearnMode', mode: 'tour' });
        dispatch({ type: 'lessonStep', step: link.step, count: CATALOG.tours[link.reactor].length });
      } else { dispatch({ type: 'setLearnMode', mode: 'predict' }); if (link.stepId) setPredictState(p => restorePredictState(p, link.stepId!)); }
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, [state.reactor, resetSimulation]);

  const openChernobyl = (stage: ChernobylStageId) => {
    if (state.reactor !== 'rbmk') changeReactor('rbmk');
    dispatch({ type: 'setChernobylStage', stage });
  };

  const openTour = (r: ReactorId, step?: number) => {
    if (r !== state.reactor) changeReactor(r);
    dispatch({ type: 'setLearnMode', mode: 'tour' });
    if (step !== undefined) {
      dispatch({ type: 'lessonStep', step, count: reactors[r].lessons.length });
      progressApi.recordTour(r, step);
    }
  };
  const openPredict = () => {
    if (state.reactor !== 'pwr') changeReactor('pwr');
    setPredictState(toPredictState(progressApi.progress.predictions[PREDICT_ID]));
    setPredictEpoch((n) => n + 1);
    dispatch({ type: 'setLearnMode', mode: 'predict' });
  };
  const resumeLearning = () => {
    const last = progressApi.progress.last;
    if (!last) return;
    if (last.lessonId === 'rbmk.chernobyl') { openChernobyl(isChernobylStage(last.stepId) ? last.stepId : 'conditions'); return; }
    const r = tourReactor(last.lessonId);
    if (r) {
      openTour(r, Math.max(0, reactors[r].lessons.findIndex((l) => l.id === last.stepId)));
    } else openPredict();
  };

  const closeAssistant = useCallback(() => {
    setAssistantOpen(false);
    // Panel kaldırıldıktan sonra odak açan düğmeye döner.
    setTimeout(() => document.getElementById('assistant-toggle')?.focus(), 0);
  }, []);

  const assistantCtx: AssistantContext = {
    reactor: state.reactor,
    view: state.view,
    pwrView: state.pwrView,
    opsSection: state.opsSection,
    selected: state.selected,
    xenonScenario: state.reactor === 'pwr' && state.view === 'scheme' && state.pwrView === 'ops' && state.opsSection === 'xenon' ? xenonScenario : null,
  };

  const stripNo = (t: string) => t.replace(/^\d+\.\s*/, '');
  const names = {
    equipment: (r: ReactorId, id: string) => reactors[r].config.components.find((c) => c.id === id)?.name ?? id,
    detail: (r: ReactorId, key: string) => reactors[r].config.details.find((d) => d.key === key)?.title ?? key,
    lesson: (id: string) => getPredictLesson(id)?.title ?? reactors[lessonIndex(id)?.reactor ?? 'pwr'].lessons.find((l) => l.id === id)?.title ?? id,
    section: (id: string) => stripNo(OPS_SECTIONS.find((x) => x.id === id)?.label ?? id),
    event: (id: string) => findChartEvent(id)?.event.title ?? id,
  };

  const highlight = useMemo<ReadonlySet<string> | null>(() => {
    if (state.view === 'learn') return new Set(lessons[state.lessonStep]?.highlight ?? []);
    if (state.assistantHL && state.assistantHL.reactor === state.reactor) return new Set(state.assistantHL.ids);
    if (state.focus) {
      const f = config.focusActions.find((a) => a.id === state.focus);
      return f ? new Set(f.highlight) : null;
    }
    if (state.selected) {
      const c = config.components.find((x) => x.id === state.selected);
      return new Set([state.selected, ...(c?.related ?? [])]);
    }
    return null;
  }, [state.view, state.lessonStep, state.focus, state.selected, state.assistantHL, state.reactor, config, lessons]);

  const sceneCtx = useMemo<SceneContextValue>(
    () => ({
      selected: state.view === 'learn' ? null : state.selected,
      highlight,
      onSelect: (id) => dispatch({ type: 'select', id: state.selected === id ? null : id }),
      nameOf: (id) => config.components.find((c) => c.id === id)?.name ?? id,
    }),
    [state.selected, state.view, highlight, config],
  );

  const { Scene, Details, CoreDetail } = mod;
  const isPwr = state.reactor === 'pwr';
  const selectedComp = state.view !== 'learn' && state.selected ? config.components.find((c) => c.id === state.selected) : undefined;
  const showOps = isPwr && state.view === 'scheme' && state.pwrView === 'ops';
  const showPredict = isPwr && state.view === 'learn' && state.learnMode === 'predict';
  const detailTitle = config.details.find((d) => d.key === state.detail)?.title ?? '';
  const contextLabel = [
    config.shortName,
    state.view === 'compare'
      ? 'Karşılaştırma'
      : showPredict
        ? 'Tahmin dersi'
        : state.view === 'learn'
          ? `Anlatım · ${lessons[state.lessonStep]?.title ?? ''}`
          : showOps
            ? `İşletme · ${names.section(state.opsSection)}`
            : showChernobyl ? 'Çernobil kaza analizi' : 'Santral şeması',
    selectedComp ? `Seçili: ${selectedComp.name}` : null,
    state.assistantHL && state.assistantHL.reactor === state.reactor ? `Vurgu: ${state.assistantHL.label}` : null,
    state.detail ? `Yakın plan: ${detailTitle}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <SimulationContext.Provider value={{ clock, model, reducedMotion }}>
      <ViewLayoutContext.Provider value={viewLayout}>
      <div className={`app reactor-${state.reactor}${assistantOpen ? ' has-assistant' : ''}`}>
        <Header
          reactor={state.reactor}
          config={config}
          view={state.view}
          onReactor={changeReactor}
          onView={(v) => dispatch({ type: 'setView', view: v })}
          assistantOpen={assistantOpen}
          onAssistant={() => (assistantOpen ? closeAssistant() : setAssistantOpen(true))}
        />
        {reducedMotion && (
          <p className="notice" role="status">
            Sisteminizde “hareketi azalt” tercihi açık: animasyon duraklatılmış başlar. İsterseniz Oynat ile başlatabilirsiniz.
          </p>
        )}

        {isPwr && state.view !== 'compare' && !showPredict && (
          <nav className="seg subview" aria-label="PWR görünümü">
            <button type="button" aria-pressed={!showOps} className={!showOps ? 'on' : ''} onClick={() => dispatch({ type: 'setPwrView', view: 'plant' })}>
              Santral şeması
            </button>
            <button type="button" aria-pressed={showOps} className={showOps ? 'on' : ''} onClick={() => dispatch({ type: 'setPwrView', view: 'ops' })}>
              İşletme ve davranış
            </button>
          </nav>
        )}

        {isPwr && state.view === 'learn' && (
          <nav className="seg subview" aria-label="Öğrenme türü">
            <button type="button" aria-pressed={state.learnMode === 'tour'} className={state.learnMode === 'tour' ? 'on' : ''} onClick={() => dispatch({ type: 'setLearnMode', mode: 'tour' })}>
              Adım adım anlatım
            </button>
            <button type="button" aria-pressed={state.learnMode === 'predict'} className={state.learnMode === 'predict' ? 'on' : ''} onClick={() => dispatch({ type: 'setLearnMode', mode: 'predict' })}>
              Tahmin et → dene → açıkla
            </button>
          </nav>
        )}

        {state.reactor === 'rbmk' && state.view !== 'compare' && <nav className="seg subview" aria-label="RBMK görünümü">
          <button type="button" aria-pressed={!showChernobyl} className={!showChernobyl ? 'on' : ''} onClick={() => dispatch({ type: 'setRbmkView', view: 'plant' })}>Santral şeması</button>
          <button type="button" aria-pressed={showChernobyl} className={showChernobyl ? 'on' : ''} onClick={() => openChernobyl(progressApi.progress.chernobyl ?? 'conditions')}>Çernobil 1986 — Kaza analizi</button>
        </nav>}

        {state.view === 'learn' && (
          <ProgressPanel
            progress={progressApi.progress}
            persistent={progressApi.persistent}
            onResume={resumeLearning}
            onOpenTour={(r) => openTour(r, Math.max(0, reactors[r].lessons.findIndex((l) => l.id === progressApi.progress.tourSteps[r])))}
            onOpenPredict={openPredict}
            onOpenChernobyl={() => openChernobyl(progressApi.progress.chernobyl ?? 'conditions')}
            onReset={() => {
              progressApi.reset();
              setPredictState(emptyPredictState());
              setPredictEpoch((n) => n + 1);
            }}
          />
        )}

        {state.assistantHL && state.assistantHL.reactor === state.reactor && state.view === 'scheme' && !showOps && (
          <p className="assistant-hl-bar" role="status">
            <span>
              Vurgulanan: <strong>{state.assistantHL.label}</strong>
            </span>
            <button type="button" onClick={() => dispatch({ type: 'assistantHighlight', hl: null })}>
              Vurguyu temizle
            </button>
          </p>
        )}

        {showChernobyl ? <main className="main compare-main"><Suspense fallback={<p className="notice">Kaza analizi yükleniyor…</p>}><ChernobylView stageId={state.chernobylStage} onStage={openChernobyl} onCompare={() => { dispatch({ type: 'setCompareTopic', topic: 'moderator' }); dispatch({ type: 'setView', view: 'compare' }); }} /></Suspense></main> : showPredict ? (
          <main className="main compare-main">
            <PredictLessonView
              key={predictEpoch}
              lesson={PWR_XENON_SHUTDOWN}
              initial={predictState}
              onChange={onPredictChange}
              onExit={() => dispatch({ type: 'setLearnMode', mode: 'tour' })}
              onAskAssistant={(q) => {
                setAssistantOpen(true);
                setAssistantSeed((x) => ({ q, n: (x?.n ?? 0) + 1 }));
              }}
            />
          </main>
        ) : state.view === 'compare' ? (
          <main className="main compare-main">
            <CompareView
              topicId={state.compareTopic}
              onTopic={(t) => dispatch({ type: 'setCompareTopic', topic: t })}
              currentReactor={state.reactor}
              onExplore={(r, topic) => {
                // Reaktör değişimi kullanıcının açık tıklamasıyla; mevcut kural gereği simülasyon başa döner.
                if (r !== state.reactor) changeReactor(r);
                dispatch({ type: 'setView', view: 'scheme' });
                dispatch({ type: 'setPwrView', view: 'plant' });
                dispatch({ type: 'assistantHighlight', hl: { reactor: r, ids: topic.sides[r].main, label: `Karşılaştırma · ${topic.label}` } });
              }}
            />
          </main>
        ) : showOps ? (
          <main className="main compare-main">
            <Suspense fallback={<p className="notice">İşletme modülü yükleniyor…</p>}>
              <PwrOperations
                section={state.opsSection}
                onSection={(s) => dispatch({ type: 'setOpsSection', section: s })}
                focusEvent={state.opsFocus}
                onXenonScenario={setXenonScenario}
              />
            </Suspense>
          </main>
        ) : (
          <main className="main">
            <section className="stage" aria-label={`${config.shortName} şeması`}>
              <SceneContext.Provider value={sceneCtx}>
                <SceneViewport
                  key={`${state.reactor}-${state.sceneEpoch}`}
                  notes={config.notes}
                  showLabels={state.showLabels}
                  showFlow={state.showFlow}
                  coreOpen={state.coreOpen}
                  onToggleLabels={() => dispatch({ type: 'toggleLabels' })}
                  onToggleFlow={() => dispatch({ type: 'toggleFlow' })}
                  onToggleCore={() => dispatch({ type: 'toggleCore' })}
                  onBackgroundClick={() => state.selected && dispatch({ type: 'select', id: null })}
                  labelDetail={state.labelDetail}
                  onLabelDetail={(d) => dispatch({ type: 'setLabelDetail', detail: d })}
                  selectedName={selectedComp?.name}
                >
                  <Scene showLabels={state.showLabels} showFlow={state.showFlow} />
                </SceneViewport>
              </SceneContext.Provider>
              {/* Dar ekranda yan panel aşağıda kalır; seçim şemanın hemen altında özetlenir. */}
              {viewLayout.layout === 'narrow' && selectedComp && (
                <div className="selection-bar" role="status">
                  <strong>{selectedComp.name}</strong>
                  <span className="role">{selectedComp.role}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('side-info-title');
                      el?.scrollIntoView({ block: 'start' });
                      el?.focus({ preventScroll: true });
                    }}
                  >
                    Ayrıntılar ↓
                  </button>
                </div>
              )}
              {state.detail && (
                <DetailDialog title={detailTitle} onClose={() => dispatch({ type: 'closeDetail' })}>
                  <SceneContext.Provider value={{ ...sceneCtx, highlight: null, selected: null }}>
                    <Details detailKey={state.detail} showFlow={state.showFlow} />
                  </SceneContext.Provider>
                </DetailDialog>
              )}
              <Legend reactor={state.reactor} />
            </section>
            <aside className="side">
              {state.view === 'learn' ? (
                <LessonPanel
                  lessons={lessons}
                  step={state.lessonStep}
                  reactorName={config.shortName}
                  onStep={(s) => {
                    const step = Math.max(0, Math.min(lessons.length - 1, s));
                    dispatch({ type: 'lessonStep', step, count: lessons.length });
                    progressApi.recordTour(state.reactor, step);
                  }}
                  onExit={() => dispatch({ type: 'setView', view: 'scheme' })}
                />
              ) : (
                <SidePanel
                  config={config}
                  selected={state.selected}
                  focus={state.focus}
                  onFocus={(id) => dispatch({ type: 'focus', id })}
                  onSelect={(id) => dispatch({ type: 'select', id })}
                  onDetail={(key) => dispatch({ type: 'openDetail', key })}
                />
              )}
            </aside>
          </main>
        )}

        {/* Santral sahnesinin kontrolleri ve göstergeleri işletme modülünde gizlenir; modülün kendi kontrolleri vardır. */}
        {!showOps && !showPredict && !showChernobyl && (
          <>
            <ControlBar
              power={power}
              onPower={onPower}
              onReset={() => {
                resetSimulation();
                dispatch({ type: 'reset' });
              }}
              learning={state.view === 'learn'}
              disabledScene={state.view === 'compare'}
              onToggleLearn={() => dispatch({ type: 'setView', view: state.view === 'learn' ? 'scheme' : 'learn' })}
            />

            <section className="panels" aria-label="Göstergeler">
              <div className="panel">
                <h2>Enerji dönüşümü</h2>
                <EnergyFlow reactor={state.reactor} />
              </div>
              <div className="panel">
                <h2>Zaman grafiği · son 60 simülasyon saniyesi</h2>
                <TimeChart key={state.sceneEpoch} />
              </div>
              {state.coreOpen && state.view !== 'compare' && (
                <div className="panel core-panel">
                  <h2>{config.details.find((d) => d.key === 'core')?.title ?? 'Çekirdek yakın planı'}</h2>
                  <CoreDetail key={state.reactor} showFlow={state.showFlow} />
                </div>
              )}
            </section>

          </>
        )}

        <SourcesSection />
        <div id="assistant-panel">
          <AssistantPanel
            open={assistantOpen}
            onClose={closeAssistant}
            context={assistantCtx}
            contextLabel={contextLabel}
            actionText={(a) => actionLabel(a, names)}
            onRun={runAssistantAction}
            hasHighlight={!!state.assistantHL}
            onClearHighlight={() => dispatch({ type: 'assistantHighlight', hl: null })}
            restoreLabel={navBefore ? `Önceki konuma dön${navBefore.reactor !== state.reactor ? ` (${REACTOR_NAME[navBefore.reactor]}; simülasyon başa döner)` : ''}` : null}
            onRestore={restoreNav}
            seed={assistantSeed}
          />
        </div>
      </div>
      </ViewLayoutContext.Provider>
    </SimulationContext.Provider>
  );
}
