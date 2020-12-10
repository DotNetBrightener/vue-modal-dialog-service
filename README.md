# vue-modal-dialog-service

An injected service into your Vue Component for showing Modal Dialogs with ease

[![GitHub open issues](https://img.shields.io/github/issues/dotnetbrightener/vue-modal-dialog-service.svg)](https://github.com/dotnetbrightener/vue-modal-dialog-service/issues)
![GitHub](https://img.shields.io/github/license/dotnetbrightener/vue-modal-dialog-service.svg)
[![Npm version](https://img.shields.io/npm/v/@dotnetbrightener/vue-modal-dialog-service.svg)](https://www.npmjs.com/package/@dotnetbrightener/vue-modal-dialog-service)


## Features


## Installation
``` bash
npm install @dotnetbrightener/vue-modal-dialog-service --save
```

## Usage

Reference the plugin to your `main.js`

```js
import Vue from 'vue';
import { ModalDialogPlugin } from '@dotnetbrightener/vue-modal-dialog-service';


Vue.use(ModalDialogPlugin);
```

In your component methods:

```js
... // omitted code
methods: {
    ... // ommited Code
    /**
    *   Show alert dialog with provided message
    */
    async showAlert() {
        await this.$modalDialogService.showAlert(`This is alert message`, `This is alert title`);
    },

    /**
    *   Show confirmation dialog with provided options
    */
    async showConfirmation() {
      const confirmed = await this.$modalDialogService.showConfirmation(`This is confirmation message`,
      `This is confirmation title`, 
      {
        yesText: 'Yes',
        noText: 'No'
      });

      // console.log('confirmed: ', confirmed); // will be true / false
    }
}
```

## Create custom dialog

Create a vue component as you would normally do

```html
<!-- dialog-components/custom-dialog-component.vue -->
<template>
    <div class="modal-content">
        <div class="modal-header" v-if="!!title">
            <h5 class="modal-title">
                Your 'title' props will display here {{ title }}
            </h5>
        </div>
        <div class="modal-body">
            This is content of custom dialog
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-primary btn-yes" @click="button1Clicked">
            Button 1
        </button>
        <button type="button" class="btn btn-light" @click="button2Clicked">
            Button 2
        </button>
        </div>
    </div>
</template>
<script>
export default {
    // the props will be passed from your execution
    props: [
        'title',
        'customContent'
    ],
    methods: {
        button1Clicked() {
            alert('you clicked button 1. It will not close the dialog');
        },

        button2Clicked() {
            alert('you clicked button 2. Now it will close the dialog');
            // return whatever you want to the caller by passing the value to .closeModal() method
            // ,closeModal is defined by the service
            this.closeModal('this is response from custom dialog');
        }
    }
};
</script>

```

In your component method, use the following to display the custom component

```js
... // omitted code
methods: {
    ... // ommited Code
    /**
    *   Show alert dialog with provided message
    */
    async showCustomComponent() {
        const dialogComponent = await import('./dialog-components/custom-dialog-component.vue').then(_ => _.default);

        const dialogResult = await this.$modalDialogService.showModalDialog(dialogComponent, {
            isCenter: true,
            // custom props
            title: 'This is custom props'
        });

        // dialogResult is whatever you return when you call this.closeModal() from the component;
    },
}
```

## Animation
If you would like to have animation in opening dialog modals, add the `link` to animated css stylesheet in your document's `head` section

``` html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
```

## Project Development 

### Setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
