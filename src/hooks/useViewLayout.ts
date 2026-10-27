import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  applyToRoot,
  autoLayout,
  effectiveLayout,
  readPreference,
  writePreference,
  type EffectiveLayout,
  type ViewPreference,
} from '../app/viewPreference';

export interface ViewLayoutValue {
  preference: ViewPreference;
  layout: EffectiveLayout;
  setPreference: (p: ViewPreference) => void;
}

export const ViewLayoutContext = createContext<ViewLayoutValue>({
  preference: 'auto',
  layout: 'wide',
  setPreference: () => undefined,
});

export const useViewLayout = () => useContext(ViewLayoutContext);

/** Kovayı temsil eden bir genişlik (effectiveLayout’a vermek için). */
const bucketWidth = (b: EffectiveLayout) => (b === 'narrow' ? 400 : b === 'medium' ? 900 : 1400);

/** CSS medya sorgularıyla aynı ölçü: kaydırma çubuğu dahil pencere genişliği. */
const viewportWidth = () => (typeof window === 'undefined' ? 1440 : window.innerWidth || document.documentElement.clientWidth);

/**
 * Uygulama kökünde bir kez kullanılır. Tercih değişince yalnız yerleşim değişir;
 * reaktör, senaryo, saat ve oynatma durumu React ağacında aynı kalır (yeniden bağlama yok).
 */
export function useViewLayoutState(): ViewLayoutValue {
  const [preference, setPref] = useState<ViewPreference>(() => readPreference());
  // Yalnız genişlik kovası (dar/orta/geniş) tutulur: boyut değişse de kova aynıysa yeniden çizim olmaz.
  const [autoBucket, setAutoBucket] = useState(() => autoLayout(viewportWidth()));
  const layout = effectiveLayout(preference, preference === 'auto' ? bucketWidth(autoBucket) : 0);

  // Genişlik ve yön değişimleri: yalnız otomatik modda yerleşimi etkiler, tercih saklanmaz.
  useEffect(() => {
    const onResize = () => setAutoBucket(autoLayout(viewportWidth()));
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  // Çizimden önce köke yaz (index.html’deki erken betikle aynı değerler; sıçrama olmaz).
  useLayoutEffect(() => {
    applyToRoot(preference, layout);
  }, [preference, layout]);

  const setPreference = useCallback((p: ViewPreference) => {
    writePreference(p);
    setPref(p);
    // “Otomatik” yeniden seçilince güncel genişliğe hemen dönülür.
    setAutoBucket(autoLayout(viewportWidth()));
  }, []);

  return { preference, layout, setPreference };
}
