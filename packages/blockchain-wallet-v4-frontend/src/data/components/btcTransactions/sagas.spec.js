import { testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as selectors from '../../selectors.js'
import btcTransactionsSagas, { logLocation } from './sagas'
import { FORM } from './model'

const coreSagas = coreSagasFactory()

jest.mock('blockchain-wallet-v4/src/redux/sagas')

const PATHNAME = '/btc/transactions'
const FORM_VALUES = {
  source: 'all'
}

describe('btcTransactions sagas', () => {
  describe('initialized', () => {
    let { initialized } = btcTransactionsSagas({ coreSagas })

    let saga = testSaga(initialized)

    const defaultSource = 'all'
    const initialValues = {
      source: defaultSource,
      status: '',
      search: ''
    }

    it('should initialize the form with initial values', () => {
      saga.next().put(actions.form.initialize(FORM, initialValues))
    })

    it('should dispatch an action to fetch txs', () => {
      saga.next().put(actions.core.data.bitcoin.fetchTransactions('', true))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'initialized', error))
      })
    })
  })

  describe('reportClicked', () => {
    let { reportClicked } = btcTransactionsSagas({ coreSagas })
    let saga = testSaga(reportClicked)

    it('should open the modal', () => {
      saga
        .next()
        .put(actions.modals.showModal('TransactionReport', { coin: 'BTC' }))
    })

    describe('error handling', () => {
      const error = new Error('ERROR')
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'reportClicked', error)
          )
      })
    })
  })

  describe('scrollUpdated', () => {
    let { scrollUpdated } = btcTransactionsSagas({ coreSagas })
    const action = {
      payload: {
        yMax: 100,
        yOffset: 25
      }
    }
    let saga = testSaga(scrollUpdated, action)

    it('should select the path name', () => {
      saga.next().select(selectors.router.getPathname)
    })

    it('should select the form values', () => {
      saga.next(PATHNAME)
    })

    it('should fetch transactions', () => {
      saga
        .next(FORM_VALUES)
        .put(
          actions.core.data.bitcoin.fetchTransactions(
            FORM_VALUES.source === 'all' ? '' : 'some_address',
            false
          )
        )
    })

    describe('error handling', () => {
      const error = new Error()
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'scrollUpdated', error)
          )
      })
    })
  })

  describe('formChanged with show all', () => {
    let { formChanged } = btcTransactionsSagas({ coreSagas })
    const action = {
      meta: {
        form: FORM,
        field: 'source'
      },
      payload: 'all'
    }

    let saga = testSaga(formChanged, action)

    it('should fetch transactions', () => {
      saga
        .next()
        .put(
          actions.core.data.bitcoin.fetchTransactions(
            action.payload === 'all' ? '' : 'some_address',
            true
          )
        )
    })

    describe('error handling', () => {
      const error = new Error()
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(actions.logs.logErrorMessage(logLocation, 'formChanged', error))
      })
    })
  })

  describe('formChanged with show one address', () => {
    let { formChanged } = btcTransactionsSagas({ coreSagas })
    const action = {
      meta: {
        form: FORM,
        field: 'source'
      },
      payload: {
        address: 'some_address'
      }
    }

    let saga = testSaga(formChanged, action)

    it('should fetch transactions', () => {
      saga
        .next()
        .put(
          actions.core.data.bitcoin.fetchTransactions(
            action.payload === 'all' ? '' : 'some_address',
            true
          )
        )
    })
  })
})
