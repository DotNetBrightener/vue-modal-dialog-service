import { modalDialogMixins } from "./default-mixins";

export const ModalDialogPlugin = {
  install (Vue, options = {}) {
    Vue.mixin(modalDialogMixins);
  },
  NAME: 'ModalDialogPlugin'
}

export default ModalDialogPlugin;
