// Legacy gtk preferences window for compatibility with older versions of GNOME

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Constants = Me.imports.constants;
const {Gtk, Gdk, Gio, GLib, GObject} = imports.gi;


var ZIIONextPreferencesWidget = GObject.registerClass(class ZIIONext_PreferencesWidget extends Gtk.Box{
    _init(IconGrid, shellVersion, Settings) {
        super._init({
            orientation: Gtk.Orientation.VERTICAL,
            margin_top: 24,
            margin_start: 24,
            margin_bottom: 24,
            margin_end: 24,
            spacing: 24,
        });
        this._settings = Settings;

        let changeIconText = new Gtk.Label({
            label: "Icon",
            use_markup: true,
            xalign: 0,
        })

        let iconsFrame = new Gtk.Frame({
            valign: Gtk.Align.START,
        });
        let iconsBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5
        });

        if (shellVersion < 40){
            iconsFrame.add(iconsBox);
        }
        else{
            iconsFrame.set_child(iconsBox);
        }

        let iconsFlowBox = new IconGrid();
        iconsFlowBox.connect('child-activated', ()=> {
            let selectedChild = iconsFlowBox.get_selected_children();
            let selectedChildIndex = selectedChild[0].get_index();
            this._settings.set_int('menu-button-icon-image', selectedChildIndex);
        });
        Constants.DistroIcons.forEach((icon)=>{
            let iconName = icon.PATH.replace("/Resources/", '');
            iconName = iconName.replace(".svg", '');
            let iconImage = new Gtk.Image({
                icon_name: iconName,
                pixel_size: 36
            });
            iconsFlowBox.add(iconImage);
        });

        if (shellVersion < 40){
            iconsBox.add(changeIconText)
            iconsBox.add(iconsFlowBox);
            this.add(iconsFrame)
        }
        else {
            iconsBox.append(changeIconText)
            iconsBox.append(iconsFlowBox);
            this.append(iconsFrame)
        }

        let children = iconsFlowBox.childrenCount;
        for(let i = 0; i < children; i++){
            if(i === this._settings.get_int('menu-button-icon-image')){
                iconsFlowBox.select_child(iconsFlowBox.get_child_at_index(i));
                break;
            }
        }

        let menuButtonIconSizeFrame = new Gtk.Frame();
        let menuButtonIconSizeBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });
        let iconSize = this._settings.get_int('menu-button-icon-size');
        let menuButtonIconSizeLabel = new Gtk.Label({
            label: 'Icon Size',
            use_markup: true,
            xalign: 0,
            hexpand: true
        });
        let menuButtonIconSizeScale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment: new Gtk.Adjustment({
                lower: 14,
                upper: 64,
                step_increment: 1,
                page_increment: 1,
                page_size: 0
            }),
            digits: 0,
            round_digits: 0,
            hexpand: true,
            draw_value: true,
            value_pos: Gtk.PositionType.RIGHT
        });

        if (shellVersion < 40){
            menuButtonIconSizeScale.connect('format-value', (scale, value) => { return value.toString() + ' px'; });
        }
        else{
            menuButtonIconSizeScale.set_format_value_func( (scale, value) => {
                return "\t" + value + "px";
            });
        }

        menuButtonIconSizeScale.set_value(iconSize);
        menuButtonIconSizeScale.connect('value-changed', () => {
            this._settings.set_int('menu-button-icon-size', menuButtonIconSizeScale.get_value());
        });
        if (shellVersion < 40){
            menuButtonIconSizeBox.add(menuButtonIconSizeLabel);
            menuButtonIconSizeBox.add(menuButtonIconSizeScale);
            menuButtonIconSizeFrame.add(menuButtonIconSizeBox);
            this.add(menuButtonIconSizeFrame);
        }
        else{
            menuButtonIconSizeBox.append(menuButtonIconSizeLabel);
            menuButtonIconSizeBox.append(menuButtonIconSizeScale);
            menuButtonIconSizeFrame.set_child(menuButtonIconSizeBox);
            this.append(menuButtonIconSizeFrame);
        }

        let clickType = this._settings.get_int('menu-button-icon-click-type');
        let menuButtonIconClickTypeFrame = new Gtk.Frame();
        let menuButtonIconClickTypeBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        let menuButtonIconClickTypeLabel = new Gtk.Label({
            label: 'Icon Click Type to open Activities',
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let menuButtonIconClickTypeCombo= new Gtk.ComboBoxText();
        menuButtonIconClickTypeCombo.append("1", "Left Click ");
        menuButtonIconClickTypeCombo.append("2", "Middle Click ");
        menuButtonIconClickTypeCombo.append("3", "Right Click ");
        menuButtonIconClickTypeCombo.set_active_id(clickType.toString());

        menuButtonIconClickTypeCombo.connect('changed', () => {
            this._settings.set_int('menu-button-icon-click-type', parseInt(menuButtonIconClickTypeCombo.get_active_id()));
        });

        if (shellVersion < 40){
            menuButtonIconClickTypeBox.add(menuButtonIconClickTypeLabel);
            menuButtonIconClickTypeBox.add(menuButtonIconClickTypeCombo);
            menuButtonIconClickTypeFrame.add(menuButtonIconClickTypeBox);
            this.add(menuButtonIconClickTypeFrame);
        }
        else{
            menuButtonIconClickTypeBox.append(menuButtonIconClickTypeLabel);
            menuButtonIconClickTypeBox.append(menuButtonIconClickTypeCombo);
            menuButtonIconClickTypeFrame.set_child(menuButtonIconClickTypeBox);
            this.append(menuButtonIconClickTypeFrame);
        }

        let extensionApp = this._settings.get_string('menu-button-extensions-app');
        let menuButtonExtensionsAppFrame = new Gtk.Frame();
        let menuButtonExtensionsAppBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        let menuButtonExtensionsAppLabel = new Gtk.Label({
            label: 'Preferred Extensions Application',
            use_markup: true,
            xalign: 0,
            hexpand: true
        });

        let menuButtonExtensionsAppCombo = new Gtk.ComboBoxText();
        menuButtonExtensionsAppCombo.append("org.gnome.Extensions.desktop", "GNOME Extensions");
        menuButtonExtensionsAppCombo.append("com.mattjakeman.ExtensionManager.desktop", "Extensions Manager");
        menuButtonExtensionsAppCombo.set_active_id(extensionApp.toString());

        menuButtonExtensionsAppCombo.connect('changed', () => {
            this._settings.set_string('menu-button-extensions-app', menuButtonExtensionsAppCombo.get_active_id());
        });

        if (shellVersion < 40){
            menuButtonExtensionsAppBox.add(menuButtonExtensionsAppLabel);
            menuButtonExtensionsAppBox.add(menuButtonExtensionsAppCombo);
            menuButtonExtensionsAppFrame.add(menuButtonExtensionsAppBox);
            this.add(menuButtonExtensionsAppFrame);
        }
        else{
            menuButtonExtensionsAppBox.append(menuButtonExtensionsAppLabel);
            menuButtonExtensionsAppBox.append(menuButtonExtensionsAppCombo);
            menuButtonExtensionsAppFrame.set_child(menuButtonExtensionsAppBox);
            this.append(menuButtonExtensionsAppFrame);
        }


        let menuButtonTerminalFrame = new Gtk.Frame();
        let menuButtonTerminalBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        // Change Terminal and build it's option in prefs
        let currentTerminal = this._settings.get_string('menu-button-terminal');
        let changeTerminalText = new Gtk.Label({
            label: "Terminal",
            use_markup: true,

        })

        let changeTerminalInput = new Gtk.Entry({
            halign: Gtk.Align.END,
            hexpand: true,
        });

        changeTerminalInput.set_text(currentTerminal);
        changeTerminalInput.connect('changed', () => {
            this._settings.set_string('menu-button-terminal', changeTerminalInput.get_text());
        });

        if (shellVersion < 40){
            menuButtonTerminalBox.add(changeTerminalText);
            menuButtonTerminalBox.add(changeTerminalInput);
            menuButtonTerminalFrame.add(menuButtonTerminalBox);
            this.add(menuButtonTerminalFrame);
        }
        else{
            menuButtonTerminalBox.append(changeTerminalText);
            menuButtonTerminalBox.append(changeTerminalInput);
            menuButtonTerminalFrame.set_child(menuButtonTerminalBox);
            this.append(menuButtonTerminalFrame);
        }

        let menuButtonSCFrame = new Gtk.Frame();
        let menuButtonSCBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        // Change Software Center and build it's option in prefs
        let currentSoftwareCenter = this._settings.get_string('menu-button-software-center');
        let changeSoftwareCenterText = new Gtk.Label({
            label: "Software Center",
            use_markup: true,
            xalign: 0,
        })

        let changeSoftwareCenterInput = new Gtk.Entry({
            halign: Gtk.Align.END,
            hexpand: true,
        });

        changeSoftwareCenterInput.set_text(currentSoftwareCenter);
        changeSoftwareCenterInput.connect('changed', () => {
            this._settings.set_string('menu-button-software-center', changeSoftwareCenterInput.get_text());
        });

        if (shellVersion < 40){
            menuButtonSCBox.add(changeSoftwareCenterText);
            menuButtonSCBox.add(changeSoftwareCenterInput);
            menuButtonSCFrame.add(menuButtonSCBox);
            this.add(menuButtonSCFrame);
        }
        else{
            menuButtonSCBox.append(changeSoftwareCenterText);
            menuButtonSCBox.append(changeSoftwareCenterInput);
            menuButtonSCFrame.set_child(menuButtonSCBox);
            this.append(menuButtonSCFrame);
        }

        // Toggle Power Options visibility and build it's option in prefs
        let PowerOptionFrame = new Gtk.Frame();
        let PowerOptionBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        let enablePowerOptionText = new Gtk.Label({
            label: "Enable Power Options",
            use_markup: true,
            xalign: 0,
            hexpand: true
        })

        let showPowerOptionsSwitch= new Gtk.Switch({
            halign: Gtk.Align.END,
        });

        showPowerOptionsSwitch.set_active(this._settings.get_boolean('show-power-options'));
        showPowerOptionsSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-power-options', widget.get_active());
        });

        if (shellVersion < 40){
            PowerOptionBox.add(enablePowerOptionText);
            PowerOptionBox.add(showPowerOptionsSwitch);
            PowerOptionFrame.add(PowerOptionBox);
            this.add(PowerOptionFrame);
        }
        else{
            PowerOptionBox.append(enablePowerOptionText);
            PowerOptionBox.append(showPowerOptionsSwitch);
            PowerOptionFrame.set_child(PowerOptionBox);
            this.append(PowerOptionFrame);
        }

        // Toggle Force Quit option and build it's option in prefs
        let forceQuitOptionFrame = new Gtk.Frame();
        let forceQuitOptionBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        let enableFQOptionText = new Gtk.Label({
            label: "Hide Force Quit option",
            use_markup: true,
            xalign: 0,
            hexpand: true
        })

        let showFQOptionsSwitch= new Gtk.Switch({
            halign: Gtk.Align.END,
        });

        showFQOptionsSwitch.set_active(this._settings.get_boolean('hide-forcequit'));
        showFQOptionsSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('hide-forcequit', widget.get_active());
        });

        if (shellVersion < 40){
            forceQuitOptionBox.add(enableFQOptionText);
            forceQuitOptionBox.add(showFQOptionsSwitch);
            forceQuitOptionFrame.add(forceQuitOptionBox);
            this.add(forceQuitOptionFrame);
        }
        else{
            forceQuitOptionBox.append(enableFQOptionText);
            forceQuitOptionBox.append(showFQOptionsSwitch);
            forceQuitOptionFrame.set_child(forceQuitOptionBox);
            this.append(forceQuitOptionFrame);
        }

        // Toggle Lock Screen option and build it's option in prefs
        let lockScreenOptionFrame = new Gtk.Frame();
        let lockScreenOptionBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        let enableLSOptionText = new Gtk.Label({
            label: "Show Lock Screen option",
            use_markup: true,
            xalign: 0,
            hexpand: true
        })

        let showLCOptionsSwitch= new Gtk.Switch({
            halign: Gtk.Align.END,
        });

        showLCOptionsSwitch.set_active(this._settings.get_boolean('show-lockscreen'));
        showLCOptionsSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('show-lockscreen', widget.get_active());
        });

        if (shellVersion < 40){
            lockScreenOptionBox.add(enableLSOptionText);
            lockScreenOptionBox.add(showLCOptionsSwitch);
            lockScreenOptionFrame.add(lockScreenOptionBox);
            this.add(lockScreenOptionFrame);
        }
        else{
            lockScreenOptionBox.append(enableLSOptionText);
            lockScreenOptionBox.append(showLCOptionsSwitch);
            lockScreenOptionFrame.set_child(lockScreenOptionBox);
            this.append(lockScreenOptionFrame);
        }

        // Toggle Software centre option and build it's option in prefs
        let SoftwareCentreOptionFrame = new Gtk.Frame();
        let softwareCentreOptionBox = new Gtk.Box({
            margin_top: 5,
            margin_bottom: 5,
            margin_start: 5,
            margin_end: 5,
        });

        let hideSCOptionText = new Gtk.Label({
            label: "Hide Software Centre option",
            use_markup: true,
            xalign: 0,
            hexpand: true
        })

        let hideSCOptionSwitch= new Gtk.Switch({
            halign: Gtk.Align.END,
        });

        hideSCOptionSwitch.set_active(this._settings.get_boolean('hide-softwarecentre'));
        hideSCOptionSwitch.connect('notify::active', (widget) => {
            this._settings.set_boolean('hide-softwarecentre', widget.get_active());
        });

        if (shellVersion < 40){
            softwareCentreOptionBox.add(hideSCOptionText);
            softwareCentreOptionBox.add(hideSCOptionSwitch);
            SoftwareCentreOptionFrame.add(softwareCentreOptionBox);
            this.add(SoftwareCentreOptionFrame);
        }
        else{
            softwareCentreOptionBox.append(hideSCOptionText);
            softwareCentreOptionBox.append(hideSCOptionSwitch);
            SoftwareCentreOptionFrame.set_child(softwareCentreOptionBox);
            this.append(SoftwareCentreOptionFrame);
        }

    }
})

function getMainPrefs(IconGrid, shellVersion, Settings) {
    let widget = new ZIIONextPreferencesWidget(IconGrid, shellVersion, Settings);
    if (shellVersion < 40){
        let iconTheme = Gtk.IconTheme.get_default();
        if(!iconTheme.get_search_path().includes(Me.path + "/Resources"))
            iconTheme.append_search_path(Me.path + "/Resources");
        widget.show_all();
        return widget;
    }

    var scrollBox = new Gtk.ScrolledWindow();
    scrollBox.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
    let iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default());
    if(!iconTheme.get_search_path().includes(Me.path + "/Resources"))
        iconTheme.add_search_path(Me.path + "/Resources");
    widget.show();
    scrollBox.set_child(widget);
    return scrollBox;
}