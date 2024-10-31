import {Device} from "spotlight/utils/responsive"
import {DashiconTy} from "spotlight/common/components/Dashicon"

export function getDeviceIcon(device: Device): DashiconTy {
  switch (device) {
    case Device.DESKTOP:
      return "desktop"
    case Device.TABLET:
      return "tablet"
    case Device.PHONE:
      return "smartphone"
  }
}
