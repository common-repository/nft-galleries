import {FeedOptions, FeedState} from "spotlight/feed"
import {Device} from "spotlight/utils/responsive"
import {withPartial} from "spotlight/utils/objects/withPartial"
import {FakePreview} from "spotlight/feed-editor/config"
import {isPlainObject} from "spotlight/utils/objects/isPlainObject"

export function createFakeFeed(config: FakePreview, options: Partial<FeedOptions>, device: Device) {
  if (!isPlainObject(config)) {
    return null
  }

  options = withPartial(options, {
    wallets: [config.wallet.address],
  })

  const [state] = new FeedState(options, device, {getWallet: () => config.wallet}).load({
    tokens: [],
  })

  return state
}
