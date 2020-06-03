
import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import NetworkReportCard from '@/components/cards/NetworkReportCard'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('NetworkReportCard', () => {
  let store
  let stubs
  let mocks
  let networkReport

  beforeEach(() => {
    networkReport = {
      network: {
        _meta: {
          name: 'meta'
        },
        id: 'n-001',
        name: 'beautiful network',
        description: 'beautiful collections and biobanks',
        contact: {
          email: 'blaat@bla.nl'
        },
        juridical_person: 'something',
        url: 'https://blaat.nl',
        common_collection_focus: true,
        common_charter: true,
        common_sops: false,
        common_data_access_policy: true,
        common_sample_access_policy: false,
        common_mta: true,
        common_image_access_policy: false,
        common_image_mta: false,
        common_representation: true,
        common_url: true
      }
    }

    store = new Vuex.Store({
      state: {
        networkReport,
        isLoading: false,
        route: {
          params: {
            id: 'my-id'
          }
        }
      },
      actions: {
        __GET_NETWORK_REPORT__: () => {}
      }
    })
    mocks = {
      $route: {
        fullPath: '/network/n-001'
      }
    }
    stubs = ['router-link', 'router-view', 'b-tab', 'b-tabs', 'b-badge']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
    expect(wrapper.html()).to.have.string('class="container mg-network-report-card"')
  })

  describe('computed', () => {
    describe('networkId', () => {
      it('computes the network id based on URL', () => {
        const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.networkId).to.equal('n-001')
      })
    })

    describe('contact', () => {
      it('should fill contact', () => {
        const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.contact.email).to.deep.equal({ value: 'blaat@bla.nl', type: 'email' })
      })
    })

    describe('detailsContent', () => {
      it('should fill detailsContent', () => {
        const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.detailsContent['Common collection focus'].value).to.equal(true)
        expect(wrapper.vm.detailsContent['Common charter'].value).to.equal(true)
        expect(wrapper.vm.detailsContent['Common SOPS'].value).to.equal(false)
        expect(wrapper.vm.detailsContent['Data access policy'].value).to.equal(true)
        expect(wrapper.vm.detailsContent['Sample access policy'].value).to.equal(false)
        expect(wrapper.vm.detailsContent['Common MTA'].value).to.equal(true)
        expect(wrapper.vm.detailsContent['Common image access policy'].value).to.equal(false)
        expect(wrapper.vm.detailsContent['Common image MTA'].value).to.equal(false)
        expect(wrapper.vm.detailsContent['Common representation'].value).to.equal(true)
        expect(wrapper.vm.detailsContent['Common URL'].value).to.equal(true)
      })
    })
  })
})
