import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React, { PureComponent } from 'react'

import { Props as BaseProps, SuccessStateType } from '..'
import { coinOrder, getData } from './selectors'
import { Icon, Text } from 'blockchain-info-components'
import {
  InitSwapFormValuesType,
  SwapSideType
} from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { StickyTopFlyoutWrapper, TopText } from '../components'
import { SwapAccountType } from 'data/types'
import CryptoAccountOption from './CryptoAccountOption'

class CoinSelection extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.swapActions.fetchPairs()
    this.props.swapActions.fetchCustodialEligibility()
  }

  checkAccountSelected = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'BASE' && values?.BASE?.label === account.label) ||
      (side === 'COUNTER' && values?.COUNTER?.label === account.label)
    ) {
      return true
    } else {
      return false
    }
  }
  checkBaseCustodial = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'COUNTER' &&
        values?.BASE?.type === 'CUSTODIAL' &&
        account.type === 'ACCOUNT') ||
      (side === 'BASE' &&
        values?.COUNTER?.type === 'ACCOUNT' &&
        account.type === 'CUSTODIAL')
    ) {
      return true
    } else {
      return false
    }
  }
  checkCoinSelected = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'COUNTER' && values?.BASE?.coin === account.coin) ||
      (side === 'BASE' && values?.COUNTER?.coin === account.coin)
    ) {
      return true
    } else {
      return false
    }
  }

  checkBaseAccountZero = (side: SwapSideType, account: SwapAccountType) => {
    if ((account.balance === 0 || account.balance === '0') && side === 'BASE') {
      return true
    } else {
      return false
    }
  }

  checkCustodialEligibility = (
    custodialEligibility: boolean,
    account: SwapAccountType
  ) => {
    if (account.type === 'CUSTODIAL' && !custodialEligibility) {
      return false
    } else {
      return true
    }
  }

  render () {
    const { coins, custodialEligbility, values, walletCurrency } = this.props
    return (
      <>
        <StickyTopFlyoutWrapper>
          <TopText spaceBetween={false} marginBottom>
            <Icon
              role='button'
              data-e2e='backToInitSwap'
              name='arrow-back'
              cursor
              size='24px'
              color='grey600'
              onClick={() =>
                this.props.swapActions.setStep({
                  step: 'INIT_SWAP'
                })
              }
            />{' '}
            <Text
              size='20px'
              color='grey900'
              weight={600}
              style={{ marginLeft: '24px' }}
            >
              {this.props.side === 'BASE' ? (
                <FormattedMessage
                  id='copy.swap_from'
                  defaultMessage='Swap from'
                />
              ) : (
                <FormattedMessage
                  id='copy.receive_to'
                  defaultMessage='Receive to'
                />
              )}
            </Text>
          </TopText>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ margin: '10px 0 0 48px' }}
          >
            {this.props.side === 'BASE' ? (
              <FormattedMessage
                id='copy.swap_from_origin'
                defaultMessage='Which wallet do you want to Swap from?'
              />
            ) : (
              <FormattedMessage
                id='copy.swap_for_destination'
                defaultMessage='Which crypto do you want to Swap for?'
              />
            )}
          </Text>
        </StickyTopFlyoutWrapper>
        {coinOrder.map(coin => {
          const accounts =
            (this.props.accounts[coin] as Array<SwapAccountType>) || []
          return accounts.map(account => {
            const isAccountSelected = this.checkAccountSelected(
              this.props.side,
              values,
              account
            )
            const isCoinSelected = this.checkCoinSelected(
              this.props.side,
              values,
              account
            )
            const hideCustodialToAccount = this.checkBaseCustodial(
              this.props.side,
              values,
              account
            )

            const isBaseAccountZero = this.checkBaseAccountZero(
              this.props.side,
              account
            )
            const isCutodialEligibile = this.checkCustodialEligibility(
              custodialEligbility,
              account
            )

            return (
              !isBaseAccountZero &&
              !isCoinSelected &&
              !hideCustodialToAccount &&
              isCutodialEligibile && (
                <CryptoAccountOption
                  account={account}
                  coins={coins}
                  isAccountSelected={isAccountSelected}
                  isSwap={true}
                  walletCurrency={walletCurrency}
                  onClick={() =>
                    this.props.swapActions.changePair(this.props.side, account)
                  }
                />
              )
            )
          })
        })}
      </>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  values: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType,
  custodialEligbility: selectors.components.swap
    .getCustodialEligibility(state)
    .getOrElse(false),
  ...getData(state, ownProps)
})

const connector = connect(mapStateToProps)

export type OwnProps = BaseProps & {
  handleClose: () => void
  side: 'BASE' | 'COUNTER'
}
export type Props = OwnProps &
  SuccessStateType &
  ConnectedProps<typeof connector>

export default connector(CoinSelection)
