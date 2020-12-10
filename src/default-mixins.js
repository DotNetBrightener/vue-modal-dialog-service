import { ModalDialogService } from './modal-dialog-services/modal-dialog-service';

export const modalDialogMixins = {
  beforeCreate () {
    if (undefined === this['$modalDialogService']) {
      this['$modalDialogService'] = new ModalDialogService(this);
    }
  },
  created () {
    // if the application uses vue-i18n, the $t function will be injected in beforeCreate()
    // otherwise, we create it here to make use of the function in our plugin
    // to prevent compilation issue
    if (undefined === this['$t']) {
      this.$t = (...params) => params[0] || '';
    }
  }
}
