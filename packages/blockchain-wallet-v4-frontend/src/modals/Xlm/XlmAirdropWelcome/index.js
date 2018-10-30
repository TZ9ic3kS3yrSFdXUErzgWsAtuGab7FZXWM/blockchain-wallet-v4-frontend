import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'
import { actions } from 'data'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'

import {
  Button,
  Image,
  Modal,
  ModalHeader,
  ModalBody,
  Text
} from 'blockchain-info-components'

const WelcomeModalHeader = styled(ModalHeader)`
  position: absolute;
  border: 0;
  > span {
    color: ${props => props.theme['gray-1']};
  }
`
const Container = styled.div`
  > div:nth-child(2) {
    margin: 10px 0 20px 0;
  }
`

class AirdropWelcomeContainer extends React.PureComponent {
  determineKycState () {
    const { userState, kycState } = this.props

    if (kycState === KYC_STATES.VERIFIED) {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.title'
              defaultMessage='Thank you for already verifying your identity'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.subtitle'
              defaultMessage='Hang tight, you will receive your XLM within the next 7 days.'
            />
          </Text>
          <Button
            nature='primary'
            fullwidth
            onClick={this.props.viewStellarWallet}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.verified.seewallet'
              defaultMessage='View Stellar Wallet'
            />
          </Button>
        </Container>
      )
    } else if (
      userState === USER_ACTIVATION_STATES.ACTIVE &&
      kycState === KYC_STATES.UNDER_REVIEW
    ) {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.title'
              defaultMessage='Thank you for completing your identity verification'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.subtitle'
              defaultMessage='Your application is still under review. Once verified, you will receive your XLM within 7 days.'
            />
          </Text>
          <Button
            nature='primary'
            fullwidth
            onClick={this.props.viewStellarWallet}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.underreview.seewallet'
              defaultMessage='View Stellar Wallet'
            />
          </Button>
        </Container>
      )
    } else if (userState === USER_ACTIVATION_STATES.ACTIVE) {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.title'
              defaultMessage='Finish identity verification'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.subtitle'
              defaultMessage="Complete your identity verification to claim your XLM. Once verified, you'll be able to use our next generation trading product, Swap."
            />
          </Text>
          <Button
            nature='primary'
            fullwidth
            onClick={this.props.verifyIdentity}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.inprogress.completenow'
              defaultMessage='Complete Now'
            />
          </Button>
        </Container>
      )
    } else {
      return (
        <Container>
          <Text size='26px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.title'
              defaultMessage='Start identity verification'
            />
          </Text>
          <Text size='16px' weight={300}>
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.subtitle'
              defaultMessage="Verify your identity to claim your XLM. It only takes a few minutes. Once verified, you'll be able to use our next generation trading product, Swap."
            />
          </Text>
          <Button
            nature='primary'
            fullwidth
            onClick={this.props.verifyIdentity}
          >
            <FormattedMessage
              id='modals.xlmairdropwelcome.newuser.beginenow'
              defaultMessage='Begin Now'
            />
          </Button>
        </Container>
      )
    }
  }

  render () {
    const { position, total, close } = this.props
    return (
      <Modal size='medium' position={position} total={total}>
        <WelcomeModalHeader onClose={close} />
        <Image name='airdrop-welcome' width='100%' />
        <ModalBody>{this.determineKycState()}</ModalBody>
      </Modal>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  viewStellarWallet: () => {
    dispatch(actions.modals.closeModal())
    dispatch(actions.router.push('/xlm/transactions'))
  },
  verifyIdentity: () => {
    dispatch(actions.modals.closeModal())
    dispatch(actions.components.identityVerification.verifyIdentity('sunriver'))
  }
})

const enhance = compose(
  modalEnhancer('AirdropWelcome'),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(AirdropWelcomeContainer)
