current_dir = $(shell pwd)

DEFAULT: clone_selenium atoms

clone_selenium:
	mkdir -p tmp
	rm -rf tmp/selenium
	git clone --branch=selenium-2.49.0 --depth=1 https://github.com/SeleniumHQ/selenium.git tmp/selenium

atoms:
	rm -rf atoms
	cd tmp/selenium && ./go clean
	mkdir atoms
	minify=true ./import_atoms.sh $(current_dir)/tmp/selenium $(current_dir)/atoms

.PHONY: \
	DEFAULT \
	clone_selenium \
	atoms
