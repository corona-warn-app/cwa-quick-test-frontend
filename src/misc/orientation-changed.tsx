/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2021, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';

const useOrientationChanged = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [orientation, setOrientation] = React.useState<any>();

  React.useEffect(() => {
    // Handler to call on window resize
    const handleChange = (e: any) => {
      // Set window width/height to state
      setOrientation(e);
    };

    // Add event listener
    window.addEventListener('orientationchange', handleChange);

    // Call handler right away so state gets updated with initial window size
    // handleChange();

    // Remove event listener on cleanup
    return () => window.removeEventListener('orientationchange', handleChange);
  }, []); // Empty array ensures that effect is only run on mount

  return orientation;
};

export default useOrientationChanged;
