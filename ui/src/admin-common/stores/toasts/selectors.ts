import {Dictionary} from "spotlight/utils/dictionary";
import {ToastsState} from "spotlight/admin-common/stores/toasts/index";

export const selectToasts = (state: ToastsState) => Dictionary.values(state.toasts);
