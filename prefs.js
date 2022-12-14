const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const PrefsLib = Me.imports.PrefsLib;
const { Gtk, GObject } = imports.gi;

const Config = imports.misc.config;
const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major);

function init() { }

var IconGrid = GObject.registerClass(class ZIIONext_IconGrid extends Gtk.FlowBox {
    _init() {
        super._init({
            row_spacing: 10,
            column_spacing: 10,
            vexpand: false,
            hexpand: true,
            valign: Gtk.Align.START,
            halign: Gtk.Align.CENTER,
            homogeneous: true,
            selection_mode: Gtk.SelectionMode.SINGLE,
            margin_top: 5,
        });
        this.childrenCount = 0;
    }

    add(widget) {
        this.insert(widget, -1);
        this.childrenCount++;
    }
});


function fillPreferencesWindow(window) {
    let Settings = ExtensionUtils.getSettings(Me.metadata['settings-schema']);
    PrefsLib.adw.fillPrefsWindow(window, IconGrid, Settings);
}

function buildPrefsWidget() {
    let Settings = ExtensionUtils.getSettings(Me.metadata['settings-schema']);
    return PrefsLib.gtk.getMainPrefs(IconGrid, shellVersion, Settings);
}

