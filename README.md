# DHIS2 Tally Sheet

The **Tally Sheets App** is a custom web application for an easy, quick and automatic generation of tally sheets given a dataset in DHIS2. Teams working in the fields can generate Tally Sheets to print on paper and take with them to their interventions. It also allows end users to export **DHIS2 datasets** into **Excel file** for offline editing and printing for data collection.

## Features
- **Dataset Selection** → Browse all available datasets in a dropdown (datasets with the attribute `hideInTallySheet = yes` are excluded).
- **Customizable View** → Adjust titles, remove sections, and preview the dataset before exporting.
- **One-Click Print/Export** → Print as a file or generate an Excel tally sheet ready for use in data collection.

## Typical Use Case
1. Select a dataset from the dropdown.
2. Preview and customize the dataset layout.
3. Export the tally sheet to Excel.
4. Edit or print the sheet for field data collection.

![tally_sheets-1](https://github.com/user-attachments/assets/4b8d512e-c0bb-4286-b76e-e36b69181738)

## Setup

```shell
$ nvm use # uses node version in .nvmrc
$ yarn install
```

This project uses **Yarn 4** managed by **Corepack** and declares:

```json
"packageManager": "yarn@4.12.0"
```

### If you have Yarn 1 globally and see a packageManager error

If running `yarn` shows an error like:

> This project's package.json defines "packageManager": "yarn@4.12.0". However the current global version of Yarn is 1.22.x.

do the following once on your machine:

```bash
# 1) Remove global Yarn (optional but recommended)
npm uninstall -g yarn

# 2) Enable Corepack (shipped with Node 16.9+ / 14.19+)
corepack enable

# 3) Set Yarn 1.x as the default for projects WITHOUT packageManager
corepack prepare yarn@1.22.22 --activate
```

Then, in this project (normal case, once Corepack is enabled):

```bash
nvm use # use the version from .nvmrc
yarn install
```

If for some reason `yarn --version` still shows `1.x` inside this repo (for example due to old Corepack state), you can force Yarn 4 explicitly:

```bash
corepack use yarn@4.12.0
yarn --version # should now print 4.12.0
yarn install
```

After this:

- This repo will use **Yarn 4.12.0**.
- Other repos without `packageManager` will keep using **Yarn 1.22.22** (or whatever you activated with `corepack prepare`).

## Build

Build a production distributable DHIS2 zip file:

```shell
$ yarn build
```

## Development

Copy `.env` to `.env.local` and configure DHIS2 instance to use. Then start the development server:

```shell
$ yarn start
```

Now in your browser, go to `http://localhost:8081`.

## Tests

```shell
$ yarn test
```

## Some development tips

### Clean architecture folder structure

-   `src/domain`: Domain layer of the app (entities, use cases, repository definitions)
-   `src/data`: Data of the app (repository implementations)
-   `src/webapp/pages`: Main React components.
-   `src/webapp/components`: React components.
-   `src/utils`: Misc utilities.
-   `i18n/`: Contains literal translations (gettext format)
-   `public/`: General non-React webapp resources.

## Data structures

-   `Future.ts`: Async values, similar to promises, but cancellables and with type-safe errors.
-   `Collection.ts`: Similar to Lodash, provides a wrapper over JS arrays.
-   `Obj.ts`: Similar to Lodash, provides a wrapper over JS objects.
-   `HashMap.ts`: Similar to ES6 map, but immutable.
-   `Struct.ts`: Base class for typical classes with attributes. Features: create, update.
-   `Either.ts`: Either a success value or an error.

## Docs

We use [TypeDoc](https://typedoc.org/example/):

```shell
$ yarn generate-docs
```

### i18n

Update i18n .po files from `i18n.t(...)` calls in the source code:

```shell
$ yarn localize
```

### Scripts

Check the example script, entry `"script-example"`in `package.json`->scripts and `src/scripts/example.ts`.

### Misc Notes

-   Requests to DHIS2 will be transparently proxied (see `vite.config.ts` -> `server.proxy`) from `http://localhost:PORT/dhis2/xyz` to `${VITE_DHIS2_BASE_URL}/xyz`. This prevents CORS and cross-domain problems.

-   You can use `.env` variables within the React app: `const value = import.meta.env.VITE_SOME_VAR;`
