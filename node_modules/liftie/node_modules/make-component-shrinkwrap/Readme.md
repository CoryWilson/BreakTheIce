
# make-component-shrinkwrap

component related make target for component-shrinkwrap workflow

## Installation

```
$ npm install --save-dev make-component-shrinkwrap
```

## Example

Include:

```Makefile
PROJECT=my-super-app
BUILD_DIR=/path/to/build


include node_modules/make-component-shrinkwrap/index.mk
```

If `SRC` is set it's going to be used as a dependency.

### Targets

- `component-install` - installs components using components install (for the first time)
- `components` - using shrinkwrap to install components
- `shrinkwrap` - store currently installed state in component-shrinkwrap.json

- `$(BUILD_DIR)/$(PROJECT).js` - .js file build by component - can be used as a dependency of your build target

# License

  MIT
