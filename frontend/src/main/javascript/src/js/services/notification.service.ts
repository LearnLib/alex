/*
 * Copyright 2018 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Service for notifications. */
export class NotificationService {

  /**
   * Creates a native notification.
   *
   * @param message The message to display.
   * @param duration How long the notification is displayed.
   */
  notify(message: string, duration: number = 5000): void {
    // notify the user that the learning process has finished
    if (('Notification' in window) && Notification.permission === 'granted') {
      const notification = new Notification(message);
      setTimeout(notification.close.bind(notification), duration);
    }
  }
}
