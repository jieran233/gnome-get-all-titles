/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Gio from 'gi://Gio';

const GetAllTitlesOfWindowsInterface = `
<node>
  <interface name="io.github.jieran233.GetAllTitlesOfWindows">
    <method name="getWindowsByTitle">
      <arg name="fullTitle" type="s" direction="in" />
      <arg name="windows" type="as" direction="out" />
    </method>
    <method name="getWindowsByPrefix">
      <arg name="prefix" type="s" direction="in" />
      <arg name="windows" type="as" direction="out" />
    </method>
    <method name="getWindowsBySuffix">
      <arg name="suffix" type="s" direction="in" />
      <arg name="windows" type="as" direction="out" />
    </method>
    <method name="getWindowsBySubstring">
      <arg name="substring" type="s" direction="in" />
      <arg name="windows" type="as" direction="out" />
    </method>
    <method name="getWindowsByWmClass">
      <arg name="name" type="s" direction="in" />
      <arg name="windows" type="as" direction="out" />
    </method>
    <method name="getWindowsByWmClassInstance">
      <arg name="instance" type="s" direction="in" />
      <arg name="windows" type="as" direction="out" />
    </method>
  </interface>
</node>
`;

export default class ActivateWindowByTitle {
    #dbus;

    enable() {
        this.#dbus = Gio.DBusExportedObject.wrapJSObject(
            GetAllTitlesOfWindowsInterface,
            this,
        );
        this.#dbus.export(
            Gio.DBus.session,
            '/io/github/jieran233/GetAllTitlesOfWindows',
        );
    }

    disable() {
        this.#dbus.unexport_from_connection(
            Gio.DBus.session,
        );
        this.#dbus = undefined;
    }

    #getWindowsByPredicate(predicate) {
        const windows = [];
        for (const actor of global.get_window_actors()) {
            const window = actor.get_meta_window();
            if (predicate(window)) {
                windows.push(window.get_title());
            }
        }
        return windows;
    }

    #getWindowsByTitlePredicate(predicate) {
        return this.#getWindowsByPredicate((window) => {
            const title = window.get_title();
            if (title === null) {
                return false;
            }
            return predicate(title);
        });
    }

    #getWindowsByWmClassPredicate(predicate) {
        return this.#getWindowsByPredicate((window) => {
            const wmClass = window.get_wm_class();
            if (!wmClass) {
                return false;
            }
            const [className, instance] = wmClass;
            return predicate(className);
        });
    }

    getWindowsByTitle(fullTitle) {
        return this.#getWindowsByTitlePredicate(
            (title) => title === fullTitle,
        );
    }

    getWindowsByPrefix(prefix) {
        return this.#getWindowsByTitlePredicate(
            (title) => title.startsWith(prefix),
        );
    }

    getWindowsBySuffix(suffix) {
        return this.#getWindowsByTitlePredicate(
            (title) => title.endsWith(suffix),
        );
    }

    getWindowsBySubstring(substring) {
        return this.#getWindowsByTitlePredicate(
            (title) => title.includes(substring),
        );
    }

    getWindowsByWmClass(name) {
        return this.#getWindowsByWmClassPredicate(
            (className) => className === name,
        );
    }

    getWindowsByWmClassInstance(instance) {
        return this.#getWindowsByWmClassPredicate(
            (className) => className === instance,
        );
    }
}
