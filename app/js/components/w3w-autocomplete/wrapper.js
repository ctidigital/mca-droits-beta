import { createElement, render } from 'preact'; /** @jsx createElement */
import Autocomplete from './autocomplete';

function w3wAutocomplete(options) {
  if (!options.element) {
    throw new Error('element is not defined');
  }
  if (!options.id) {
    throw new Error('id is not defined');
  }
  render(<Autocomplete {...options} />, options.element);
}

w3wAutocomplete.enhanceSelectElement = (configurationOptions) => {
  if (!configurationOptions.selectElement) {
    throw new Error('selectElement is not defined');
  }

  // Set defaults.
  if (!configurationOptions.source) {
    let availableOptions = [].filter.call(
      configurationOptions.selectElement.options,
      (option) => option.value || configurationOptions.preserveNullOptions
    );
    configurationOptions.source = availableOptions.map(
      (option) => option.textContent || option.innerText
    );
  }
  configurationOptions.onConfirm =
    configurationOptions.onConfirm ||
    ((query) => {
      const requestedOption = [].filter.call(
        configurationOptions.selectElement.options,
        (option) => (option.textContent || option.innerText) === query
      )[0];
      if (requestedOption) {
        requestedOption.selected = true;
      }
    });

  if (
    configurationOptions.selectElement.value ||
    configurationOptions.defaultValue === undefined
  ) {
    const option =
      configurationOptions.selectElement.options[
        configurationOptions.selectElement.options.selectedIndex
      ];
    configurationOptions.defaultValue = option.textContent || option.innerText;
  }

  if (configurationOptions.name === undefined) configurationOptions.name = '';
  if (configurationOptions.id === undefined) {
    if (configurationOptions.selectElement.id === undefined) {
      configurationOptions.id = '';
    } else {
      configurationOptions.id = configurationOptions.selectElement.id;
    }
  }
  if (configurationOptions.autoselect === undefined)
    configurationOptions.autoselect = true;

  const element = document.createElement('div');

  configurationOptions.selectElement.parentNode.insertBefore(
    element,
    configurationOptions.selectElement
  );

  w3wAutocomplete({
    ...configurationOptions,
    element: element
  });

  configurationOptions.selectElement.style.display = 'none';
  configurationOptions.selectElement.id =
    configurationOptions.selectElement.id + '-select';
};

export default w3wAutocomplete;