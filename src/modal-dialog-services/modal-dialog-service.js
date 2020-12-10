import Vue from 'vue';
import ConfirmDialog from './confirm-dialog.vue';
import AlertDialog from './alert-dialog.vue';

const readonlyDescriptor = () => ({ enumerable: true, configurable: false, writable: false });
const omit = (obj, props) => Object.keys(obj)
  .filter(key => props.indexOf(key) === -1)
  .reduce((result, key) => ({ ...result, [key]: obj[key] }), {});

const BASE_PROPS = ['isCenter', 'modalDialogClasses', 'modalClasses', 'keyboard', 'modalAnimation', 'animDuration'];
const observerDialogs = Vue.observable({ openingDialogs: {} });
const allDialogs = Vue.observable({ openingDialogs: 0 });

export class ModalDialogService {
  constructor (vm) {
    Object.assign(this, { _vm: vm, _root: vm.$root });
    Object.defineProperties(this, {
      _vm: readonlyDescriptor(),
      _root: readonlyDescriptor()
    });
  }

  showConfirmation (message, title, options = {}) {
    return this.showModalDialog(ConfirmDialog, {
      message,
      title,
      isCenter: true,
      modalAnimation: 'zoomIn',
      animDuration: '0.4s',
      ...options
    });
  }

  showAlert (message, title, options = {}) {
    return this.showModalDialog(AlertDialog, {
      message,
      title,
      isCenter: true,
      modalAnimation: 'zoomIn',
      animDuration: '0.4s',
      ...options
    });
  }

  showModalDialog (component, options = {}) {
    const $parent = this._vm;
    return new Promise((resolve, reject) => {
      const ModalInstance = Vue.extend({
        template: `
  <div class="modal-container">
    <div class="modal" :class="[componentLoaded && 'show', true && modalClasses, modalAnimation && 'animate__animated animate__' + modalAnimation]" :style="{ 'z-index': modalDialogZIndex, '--animate-duration': animDuration }">
      <div class="modal-dialog" :class="[isCenter && 'modal-dialog-centered', true && modalDialogClasses]">
        <component :is="component" v-bind="props" @on-closing="__handleModalClose" @on-loaded="__modalComponentLoaded" />
      </div>
    </div>
    <div class="modal-backdrop show" v-if="shouldShowBackdrop" :style="{ 'z-index': modalBackdropZIndex }"></div>
  </div>
        `,
        data () {
          return {
            component: null,
            props: null,
            componentLoaded: false,

            keyboard: false,
            isCenter: false,
            modalDialogClasses: '',
            modalClasses: '',
            modalAnimation: 'zoomIn',
            animDuration: '0.4s'
          };
        },
        async destroyed () {
          const uid = this._uid;
          if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el)
          }

          const openingDialogs = observerDialogs.openingDialogs;
          delete openingDialogs[`${uid}`];
          allDialogs.openingDialogs--;

          Vue.set(observerDialogs, 'openingDialogs', openingDialogs);

          if (allDialogs.openingDialogs === 0) {
            document.body.classList.remove('modal-open');
          }

          document.removeEventListener('keyup', this.__handleKeyup);
        },
        async beforeMount () {
          const openingDialogs = observerDialogs.openingDialogs;
          openingDialogs[`${this._uid}`] = this;
          Vue.set(observerDialogs, 'openingDialogs', openingDialogs);
          allDialogs.openingDialogs++;

          if (allDialogs.openingDialogs > 0) {
            document.body.classList.add('modal-open');
          }
        },
        mounted () {
          this.component = Vue.extend({
            extends: component,
            mounted () {
              this.$emit('on-loaded');
            },
            methods: {
              ...component.methods,
              closeModal (resolveObject) {
                this.$emit('on-closing', resolveObject);
              }
            }
          });

          this.props = omit(options, BASE_PROPS);
          BASE_PROPS.forEach(propName => {
            if (options[propName]) {
              this[propName] = options[propName];
            }
          });

          if (this.keyboard) {
            document.addEventListener('keyup', this.__handleKeyup);
          }

          this.$$resolve = resolve;
          this.$$reject = reject;
        },
        computed: {
          shouldShowBackdrop () {
            const modalIndex = Object.keys(observerDialogs.openingDialogs).indexOf(`${this._uid}`);
            return allDialogs.openingDialogs === 1 || modalIndex === 0;
          },
          modalBackdropZIndex () {
            return (allDialogs.openingDialogs) * 10 + 1040;
          },
          modalDialogZIndex () {
            const modalIndex = Object.keys(observerDialogs.openingDialogs).indexOf(`${this._uid}`);
            return (modalIndex + 1) * 10 + 1042;
          }
        },
        methods: {
          async __handleKeyup (event) {
            const currentModalIndex = Object.keys(observerDialogs.openingDialogs).indexOf(`${this._uid}`);
            if (currentModalIndex < allDialogs.openingDialogs - 1) {
              return;
            }

            if (event.keyCode === 27) { // esc key
              if (this.keyboard === 'prompt') {
                const confirmed = await this.$modalDialogService.showConfirmation(
                  `You pressed ESC and that would close the dialog. Did you want to close or it was an accident?`,
                  `Close Dialog Confirmation`,
                  {
                    yesText: 'Yes, close the dialog',
                    noText: 'No, it was an accident'
                  }
                );

                if (!confirmed) {
                  return;
                }
              }
              this.$$reject({
                errorMessage: 'Dialog closed by user'
              });

              this.$nextTick(() => {
                this.$destroy();
              });
            }
          },
          __handleModalClose (resolveObject) {
            this.$$resolve(resolveObject);

            this.$nextTick(() => {
              this.$destroy();
            });
          },
          __modalComponentLoaded () {
            this.componentLoaded = true;
          }
        }
      });

      const msgBox = new ModalInstance({
        parent: $parent
      });

      const modalDiv = document.createElement('div');
      document.body.appendChild(modalDiv);
      msgBox.$mount(modalDiv);
    });
  }
}
