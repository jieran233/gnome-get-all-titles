.PHONY: all

all:
	gnome-extensions pack --force

install:
	gnome-extensions install --force gnome-get-all-titles@jieran233.github.io.shell-extension.zip
	# Please logout to apply extension installation!