import type { ReactorId, ReactorModule } from './shared/types';
import { pwrConfig } from './pwr/pwrConfig';
import { pwrLessons } from './pwr/pwrLessons';
import { PwrScene } from './pwr/PwrScene';
import { PwrCoreDetail } from './pwr/PwrCoreDetail';
import { PwrDetails } from './pwr/PwrDetails';
import { bwrConfig } from './bwr/bwrConfig';
import { bwrLessons } from './bwr/bwrLessons';
import { BwrScene } from './bwr/BwrScene';
import { BwrCoreDetail } from './bwr/BwrCoreDetail';
import { BwrDetails } from './bwr/BwrDetails';
import { vverConfig } from './vver/vverConfig';
import { vverLessons } from './vver/vverLessons';
import { VverScene } from './vver/VverScene';
import { VverCoreDetail } from './vver/VverCoreDetail';
import { VverDetails } from './vver/VverDetails';
import { rbmkConfig } from './rbmk/rbmkConfig';
import { rbmkLessons } from './rbmk/rbmkLessons';
import { RbmkScene } from './rbmk/RbmkScene';
import { RbmkCoreDetail } from './rbmk/RbmkCoreDetail';
import { RbmkDetails } from './rbmk/RbmkDetails';
import { canduConfig } from './candu/canduConfig';
import { canduLessons } from './candu/canduLessons';
import { CanduScene } from './candu/CanduScene';
import { CanduCoreDetail } from './candu/CanduCoreDetail';
import { CanduDetails } from './candu/CanduDetails';

/** Her reaktör kendi sahnesi, dersleri, yakın planları ve açıklamalarıyla bağımsız bir modüldür. */
export const reactors: Record<ReactorId, ReactorModule> = {
  pwr: { config: pwrConfig, lessons: pwrLessons, Scene: PwrScene, CoreDetail: PwrCoreDetail, Details: PwrDetails },
  bwr: { config: bwrConfig, lessons: bwrLessons, Scene: BwrScene, CoreDetail: BwrCoreDetail, Details: BwrDetails },
  vver: { config: vverConfig, lessons: vverLessons, Scene: VverScene, CoreDetail: VverCoreDetail, Details: VverDetails },
  rbmk: { config: rbmkConfig, lessons: rbmkLessons, Scene: RbmkScene, CoreDetail: RbmkCoreDetail, Details: RbmkDetails },
  candu: { config: canduConfig, lessons: canduLessons, Scene: CanduScene, CoreDetail: CanduCoreDetail, Details: CanduDetails },
};
