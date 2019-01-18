/*
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {
  createModuleNamespace,
  FirebaseModule,
  getFirebaseNamespace,
} from 'react-native-firebase/lib/internal';

import {
  isNull,
  isObject,
  isUndefined,
  isString,
  isOneOf,
  isAlphaNumericUnderscore,
} from '@react-native-firebase/common';

const ReservedEventNames = [
  'app_clear_data',
  'app_uninstall',
  'app_update',
  'error',
  'first_open',
  'in_app_purchase',
  'notification_dismiss',
  'notification_foreground',
  'notification_open',
  'notification_receive',
  'os_update',
  'session_start',
  'user_engagement',
];

const statics = {};

const namespace = 'analytics';

const nativeModuleName = 'RNFBAnalytics';

class FirebaseAnalyticsModule extends FirebaseModule {
  /**
   * Logs an app event.
   * @param  {string} name
   * @param params
   * @return {Promise}
   */
  logEvent(name, params = {}) {
    if (!isString(name)) {
      throw new Error(
        `analytics.logEvent(): First argument 'name' is required and must be a string value.`,
      );
    }

    if (!isUndefined(params) && !isObject(params)) {
      throw new Error(
        `analytics.logEvent(): Second optional argument 'params' must be an object if provided.`,
      );
    }

    // check name is not a reserved event name
    if (isOneOf(name, ReservedEventNames)) {
      throw new Error(
        `analytics.logEvent(): event name '${name}' is a reserved event name and can not be used.`,
      );
    }

    // name format validation
    if (!isAlphaNumericUnderscore(name)) {
      throw new Error(
        `analytics.logEvent(): Event name '${name}' is invalid. Names should contain 1 to 32 alphanumeric characters or underscores.`,
      );
    }

    // maximum number of allowed params check
    if (params && Object.keys(params).length > 25)
      throw new Error('analytics.logEvent(): Maximum number of parameters exceeded (25).');

    // Parameter names can be up to 24 characters long and must start with an alphabetic character
    // and contain only alphanumeric characters and underscores. Only String, long and double param
    // types are supported. String parameter values can be up to 36 characters long. The "firebase_"
    // prefix is reserved and should not be used for parameter names.
    return this.native.logEvent(name, params);
  }

  /**
   * Sets whether analytics collection is enabled for this app on this device.
   * @param enabled
   */
  setAnalyticsCollectionEnabled(enabled) {
    return this.native.setAnalyticsCollectionEnabled(enabled);
  }

  /**
   * Sets the current screen name, which specifies the current visual context in your app.
   * @param screenName
   * @param screenClassOverride
   */
  setCurrentScreen(screenName, screenClassOverride) {
    return this.native.setCurrentScreen(screenName, screenClassOverride);
  }

  /**
   * Sets the minimum engagement time required before starting a session. The default value is 10000 (10 seconds).
   * @param milliseconds
   */
  setMinimumSessionDuration(milliseconds = 10000) {
    return this.native.setMinimumSessionDuration(milliseconds);
  }

  /**
   * Sets the duration of inactivity that terminates the current session. The default value is 1800000 (30 minutes).
   * @param milliseconds
   */
  setSessionTimeoutDuration(milliseconds = 1800000) {
    return this.native.setSessionTimeoutDuration(milliseconds);
  }

  /**
   * Sets the user ID property.
   * @param id
   */
  setUserId(id) {
    if (!isNull(id) && !isString(id)) {
      throw new Error('analytics.setUserId(): The supplied userId must be a string value or null.');
    }

    return this.native.setUserId(id);
  }

  /**
   * Sets a user property to a given value.
   * @param name
   * @param value
   */
  setUserProperty(name, value) {
    if (value !== null && !isString(value)) {
      throw new Error(
        'analytics.setUserProperty(): The supplied property must be a string value or null.',
      );
    }

    return this.native.setUserProperty(name, value);
  }

  /**
   * Sets multiple user properties to the supplied values.
   *
   * @RNFirebaseSpecific
   * @param object
   */
  setUserProperties(object) {
    return this.native.setUserProperties(object);
  }
}

// import analytics from '@react-native-firebase/analytics';
// analytics().logEvent(...);
export default createModuleNamespace({
  statics,
  namespace,
  nativeModuleName,
  hasMultiAppSupport: false,
  hasCustomUrlSupport: false,
  ModuleClass: FirebaseAnalyticsModule,
});

// import analytics, { firebase } from '@react-native-firebase/analytics';
// analytics().logEvent(...);
// firebase.analytics().logEvent(...);
export const firebase = getFirebaseNamespace();