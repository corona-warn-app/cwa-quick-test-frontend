/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2023, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the 'License'); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 * Used character transliteration from
 * https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
 */

import React from 'react';

const initBeforeUnLoad = (onUnload?: () => void) => {
  window.onbeforeunload = () => {
    if (onUnload) {
      onUnload();
    }
  };
};
// Hook
const useOnUnload = (onUnload: () => void) => {
  const [handleOnUnload] = React.useState<() => void>(onUnload);

  React.useEffect(() => {
    initBeforeUnLoad(handleOnUnload);
    return () => initBeforeUnLoad(undefined);
  }, [handleOnUnload]);

  // return [handleOnUnload, setHandleOnUnload] as const;
};

export default useOnUnload;
