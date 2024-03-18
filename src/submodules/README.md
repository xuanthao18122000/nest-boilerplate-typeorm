# FICO SALEX SUBMODULE

## Submodule

```bash
# Submodule add repo gitlab
$ git submodule add ssh://git@lubrytics.com:9289/fico-ytl/boilerplate/backend/boilerplate-submodules.git src/submodules

# Delete submodule and Run script remove submodule
$ rm -rf .git/modules/src/submodules

# Update new code branch submodule
$ git submodule update --remote

# When clone project run script
$ Delete folder submodules
$ Run: git submodule add --force ssh://git@lubrytics.com:9289/fico-ytl/boilerplate/backend/boilerplate-submodules.git src/submodules
```
## .gitsubmodile

```bash
# Create file .gitsubmodule and add script to file
[submodule "src/submodules"]
	path = src/submodules
	url = ../../backend/boilerplate-submodules.git
	branch = dev

```
