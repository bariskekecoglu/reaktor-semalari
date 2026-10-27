import { Suspense, lazy, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { SimClock } from '../simulation/clock';
import { EducationalModel, INITIAL_POWER } from '../simulation/educationalModel';
import { SimulationContext, usePrefersReducedMotion } from '../hooks/useSimulation';
import { appReducer, initialAppState } from './appState';
import { reactors } from '../reactors/registry';
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

export function App() {
  const [clock] = useState(() => new SimClock());
  const [model] = useState(() => new EducationalModel(INITIAL_POWER));
  const reducedMotion = usePrefersReducedMotion();
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const [power, setPower] = useState(INITIAL_POWER);

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

  const highlight = useMemo<ReadonlySet<string> | null>(() => {
    if (state.view === 'learn') return new Set(lessons[state.lessonStep]?.highlight ?? []);
    if (state.focus) {
      const f = config.focusActions.find((a) => a.id === state.focus);
      return f ? new Set(f.highlight) : null;
    }
    if (state.selected) {
      const c = config.components.find((x) => x.id === state.selected);
      return new Set([state.selected, ...(c?.related ?? [])]);
    }
    return null;
  }, [state.view, state.lessonStep, state.focus, state.selected, config, lessons]);

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
  const showOps = isPwr && state.view === 'scheme' && state.pwrView === 'ops';
  const detailTitle = config.details.find((d) => d.key === state.detail)?.title ?? '';

  return (
    <SimulationContext.Provider value={{ clock, model, reducedMotion }}>
      <div className={`app reactor-${state.reactor}`}>
        <Header
          reactor={state.reactor}
          config={config}
          view={state.view}
          onReactor={changeReactor}
          onView={(v) => dispatch({ type: 'setView', view: v })}
        />
        {reducedMotion && (
          <p className="notice" role="status">
            Sisteminizde “hareketi azalt” tercihi açık: animasyon duraklatılmış başlar. İsterseniz Oynat ile başlatabilirsiniz.
          </p>
        )}

        {isPwr && state.view !== 'compare' && (
          <nav className="seg subview" aria-label="PWR görünümü">
            <button type="button" aria-pressed={!showOps} className={!showOps ? 'on' : ''} onClick={() => dispatch({ type: 'setPwrView', view: 'plant' })}>
              Santral şeması
            </button>
            <button type="button" aria-pressed={showOps} className={showOps ? 'on' : ''} onClick={() => dispatch({ type: 'setPwrView', view: 'ops' })}>
              İşletme ve davranış
            </button>
          </nav>
        )}

        {state.view === 'compare' ? (
          <main className="main compare-main">
            <CompareView />
          </main>
        ) : showOps ? (
          <main className="main compare-main">
            <Suspense fallback={<p className="notice">İşletme modülü yükleniyor…</p>}>
              <PwrOperations />
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
                >
                  <Scene showLabels={state.showLabels} showFlow={state.showFlow} />
                </SceneViewport>
              </SceneContext.Provider>
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
                  onStep={(s) => dispatch({ type: 'lessonStep', step: s, count: lessons.length })}
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
        {!showOps && (
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
      </div>
    </SimulationContext.Provider>
  );
}
