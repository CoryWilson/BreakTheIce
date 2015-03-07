DIR ?= $(dir $(lastword $(MAKEFILE_LIST)))

BUILD_DIR ?= build

ifeq ($(PROJECT),)
$(error PROJECT needs to be set.)
endif

component-install:
	$(DIR)node_modules/.bin/component install $(COMPONENT_REMOTES)

components: $(COMPONENT_JSON)
	$(DIR)node_modules/.bin/component-shrinkwrap --install $(COMPONENT_REMOTES)

shrinkwrap:
	$(DIR)node_modules/.bin/component-shrinkwrap --save --check $(COMPONENT_REMOTES)

$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/$(PROJECT).js: components $(SRC)
	$(DIR)node_modules/.bin/component build --out $(BUILD_DIR) --use component-autoboot --name $(PROJECT)

.PHONY: shrinkwrap component-install
