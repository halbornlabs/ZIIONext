install:
	gnome-extensions pack --extra-source=Resources/ --extra-source=PrefsLib/ --extra-source=constants.js  --force
	gnome-extensions install ziionext@halborn.shell-extension.zip --force
	rm ziionext@halborn.shell-extension.zip
