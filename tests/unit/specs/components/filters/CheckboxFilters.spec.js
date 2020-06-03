
import { expect } from 'chai'
import CheckboxFilters from '@/components/filters/CheckboxFilters'
import { mount, createLocalVue } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('components', () => {
  describe('CheckboxFilters', () => {
    describe('html', () => {
      let wrapper, boxes
      beforeEach(() => {
        // Do a full mount so we can click the actual inputs
        wrapper = mount(CheckboxFilters, {
          propsData: {
            name: 'facet',
            label: 'Label',
            options: [{ id: '1', label: 'option 1' }, { id: '2', label: 'option 2' }],
            value: ['1'],
            initiallyCollapsed: false,
            maxVisibleOptions: 4
          },
          localVue
        })
        boxes = wrapper.findAll('input')
      })

      it('should render the label', () => {
        expect(wrapper.find('.filter-header').text()).eq('Label')
      })

      it('should render the body when not collapsed', () => {
        expect(wrapper.find('.card-body').isVisible()).eq(true)
      })

      it('should not render the body when initially collapsed', () => {
        const collapsedWrapper = mount(CheckboxFilters, {
          propsData: {
            label: 'Label',
            options: [],
            value: [],
            initiallyCollapsed: true
          },
          localVue
        })
        expect(collapsedWrapper.find('.card-body').exists()).eq(false)
      })

      it('should render the option labels', () => {
        const labels = wrapper.findAll('label')
        expect(labels.at(0).text()).eq('option 1')
        expect(labels.at(1).text()).eq('option 2')
      })

      it('should select the selected option boxes', () => {
        expect(boxes.at(0).find('input').element.checked).eq(true)
        expect(boxes.at(1).find('input').element.checked).eq(false)
      })

      it('should emit an event when a checkbox is checked', async () => {
        boxes.at(1).find('input').setChecked()
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().input).to.deep.eq([[['1', '2']]])
      })

      it('should emit an event when a checkbox is unchecked', async () => {
        boxes.at(0).find('input').setChecked(false)
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().input).to.deep.eq([[[]]])
      })

      it('should not slice options when there are fewer than max options', () => {
        expect(wrapper.findAll('label').length).eq(2)
        expect(wrapper.vm.$data.sliceOptions).eq(false)
      })

      it('should slice options when there are more than max options', async () => {
        wrapper.setProps({ maxVisibleOptions: 1 })
        await wrapper.vm.$nextTick()
        expect(wrapper.findAll('label').length).eq(1)
        expect(wrapper.vm.$data.sliceOptions).eq(true)
      })

      it('should show expand link when the options are sliced', async () => {
        wrapper.setProps({ maxVisibleOptions: 1 })
        await wrapper.vm.$nextTick()
        const toggler = wrapper.find('.toggle-slice')
        expect(toggler.isVisible()).eq(true)
        expect(toggler.text()).eq('Show 1 more')
      })

      it('should expand the checkboxes when the toggle link is clicked', async () => {
        wrapper.setProps({ maxVisibleOptions: 1 })
        await wrapper.vm.$nextTick()
        const toggler = wrapper.find('.toggle-slice')
        toggler.trigger('click')
        await wrapper.vm.$nextTick()
        expect(toggler.text()).eq('Show less')
        expect(wrapper.findAll('label').length).eq(2)
      })

      it('should emit an event when Deselect all is clicked', () => {
        const selectionToggler = wrapper.find('.toggle-select')
        expect(selectionToggler.text()).eq('Deselect all')
        selectionToggler.trigger('click')
        expect(wrapper.emitted().input).to.deep.eq([[[]]])
      })

      it('should emit an event when Select all is clicked', () => {
        wrapper = mount(CheckboxFilters, {
          propsData: {
            name: 'facet',
            label: 'Label',
            options: [{ id: '1', label: 'option 1' }, { id: '2', label: 'option 2' }],
            value: [],
            initiallyCollapsed: false,
            maxVisibleOptions: 4
          },
          localVue
        })
        const selectionToggler = wrapper.find('.toggle-select')
        expect(selectionToggler.text()).eq('Select all')
        selectionToggler.trigger('click')
        expect(wrapper.emitted().input).to.deep.eq([[['1', '2']]])
      })
    })
  })
})
