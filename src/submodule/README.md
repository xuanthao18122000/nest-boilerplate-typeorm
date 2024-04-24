# FICO SALEX SUBMODULE

## Submodule

```bash
# Submodule add repo gitlab
$ git submodule add ssh://git@lubrytics.com:9289/fico-ytl/fico-salex/backend/fico-salex-submodules.git src/submodules

# Delete submodule and Run script remove submodule
$ rm -rf .git/modules/src/submodules

# Update new code branch submodule
$ git submodule update --remote

# When clone project run script
$ Delete folder submodules
$ Run: git submodule add --force ssh://git@lubrytics.com:9289/fico-ytl/fico-salex/backend/fico-salex-submodules.git src/submodules
```
## .gitmodules

```bash
# Create file .gitsubmodule and add script to file
[submodule "src/submodules"]
	path = src/submodules
	url = ../../backend/fico-salex-submodules.git
	branch = dev

```
```bash
## Set up database
$ CREATE EXTENSION unaccent
$ CREATE EXTENSION postgis

```