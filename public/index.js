// Todo: Might build-in support for bare import specifiers (npm packages)
//   using auto-built import maps; see `build-import-map` script in
//   `package.json`

// Use rolled up versions to stay ESM-only while build-free after a one-time
//   build
import {parse} from './vendor/uce-template/esm/index.js';
import loader from './vendor/uce-loader/esm/index.js';

import './templates.js';

const localComponents = [
  'choose-work-section-paragraph'
];

// const remoteComponents = [
//   // Remote component names
//   'some-imported-component-at-a-reliable-location'
// ];

loader({
  // eslint-disable-next-line unicorn/no-useless-spread -- Placeholding
  known: new Map([
    ...localComponents.map((path) => [path, `./views/`])
    // , ...remoteComponents.map((path) => [
    //   path, './node_modules/exported-components/'
    // ])
  ]),
  async on (componentName) {
    if (this.known.has(componentName)) {
      const basePath = this.known.get(componentName);
      const componentPath = `${basePath}${componentName}.uce`;
      const topLevelComponent = await fetch(componentPath);

      const parseComponent = async (component) => {
        const definition = await component.text();
        const template = parse(definition);

        const script = template.content.querySelector('script');
        if (script) {
          const imports = [];
          script.textContent = script.textContent.replace(
            // /^\s*import\s+(?<quote>["'])(?<path>\..*?\.uce)\k<quote>/gum,
            /^\s*import\s+(?<quote>["'])(?<path>.*?)\k<quote>/gum,
            (_, __, ___, $, $$, groups) => {
              imports.push(
                fetch(new URL(groups.path, new URL(componentPath, location)))
              );
              return '';
            }
          );
          /* eslint-disable max-len -- Too long */
          // .replace(
          //   /^\s*import\s+(?<variable>[\w{}\s\n]+\s+)?(?<quote>["'])(?<path>.*?(?!\.uce))\k<quote>/gum,
          //   (_, __, ___, ____, $, $$, groups) => {
          //     console.log('caught', `import ${groups.variable || ''} ${groups.quote}${groups.path}${groups.quote}`);
          //     return `import ${groups.variable || ''} ${groups.quote}${groups.path}${groups.quote}`;
          //   }
          // );
          /* eslint-enable max-len -- Too long */
          const subComponents = await Promise.all(imports);
          subComponents.forEach((subComponent) => {
            parseComponent(subComponent);
          });
        }
        document.body.append(template);
      };
      await parseComponent(topLevelComponent);
    }
  }
});
