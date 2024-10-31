import React, {ReactNode, useContext} from "react"
import css from "../styles/TokenInfo.pcss"
import {Token, Tokens} from "spotlight/common/modules/tokens"
import {TokenTrait} from "spotlight/feed/components/TokenTrait"
import {FeedContext} from "spotlight/feed"

interface Props {
  token?: Token;
  children?: ReactNode;
}

export function TokenInfo({token, children}: Props) {
  const {state} = useContext(FeedContext)
  const showTraits = state.getDesign().lightboxShowTraits

  const traits = token?.traits ?? Array.from({length: 3}).map(() => null)

  return (
    <article className={css.container}>

      <header className={css.header}>
        {token
          ? <div className={css.tokenName}>
            <a href={Tokens.getOpenSeaUrl(token)} target="_blank" title={token.description}>
              {Tokens.getName(token)}
            </a>
          </div>

          : <div className={css.skeletonName} />
        }
      </header>

      <div className={css.traits}>
        {showTraits && (
          <div className={css.traitsScroller}>
            {(traits ?? []).map(trait => <TokenTrait key={trait.type} trait={trait} />)}
          </div>
        )}
      </div>

      {children && (
        <div className={css.footer}>
          {children}
        </div>
      )}
    </article>
  )
}
