import VeeValidate from 'vee-validate'
import {
  save,
  smartQueryHelper,
  queryHelper,
  deleteMutation
} from 'plugins/hasura'
import { settings } from 'plugins/platyplus'
import get from 'lodash/get'
import ButtonBar from 'components/ButtonBar.vue'

export const mixin = (table, options = {}) => {
  options = {
    ...{
      fragment: 'base',
      formField: 'form',
      unique: false,
      validations: {},
      defaultValues: {}
    },
    ...settings[table],
    ...options
  }
  return {
    props: ['id', 'createFlag', 'editFlag'],
    data () {
      return {
        [options.formField]: {},
        relations: options.relations
          ? Object.keys(options.relations).reduce((aggr, curr) => {
            aggr[curr] = []
            return aggr
          }, {})
          : {},
        list: [],
        item: options.defaultValues || {}
      }
    },
    methods: {
      create () {
        this.$router.push(this.$route.path + '/create')
      },
      async save (e) {
        // Customize the save method in the component if needed
        await this._mixinPreSave()
        this._mixinPostSave()
      },
      edit () {
        this.$router.replace(this.$route.path + '/edit')
      },
      cancel () {
        this.$router.replace(
          this.$route.path.replace(this.createFlag ? '/create' : '/edit', '')
        )
      },
      reset (e) {
        if (!this.id) {
          this.item = options.defaultValues || {}
        }
        // Copy the initial data to the form data
        this[options.formField] = { ...this.item }
        // Flatten the M2M relation fields with the corresponding IDs
        options.relations &&
          Object.keys(options.relations).map(relation => {
            if (this.item[relation]) {
              this.relations[relation] = this.item[relation].map(
                item => item[options.relations[relation].to].id
              )
            }
          })
        // Focus on the input referenced as 'firstInput' in the template
        if (!this.reading) {
          this.$nextTick(
            () => this.$refs.firstInput && this.$refs.firstInput.focus()
          )
        }
      },
      async remove () {
        await deleteMutation({
          apollo: this.$apollo,
          table,
          data: this.id
        })
        this.$router.go(-1)
      },
      _mixinPreSave () {
        // TODO: form validation
        // this.submitted = true TODO: loading button
        return save({
          apollo: this.$apollo,
          table,
          fragment: options.fragment,
          oldValues: this.item,
          newValues: this[options.formField],
          relations: this.relations
        })
      },
      _mixinPostSave () {
        this.$router.replace(
          this.$route.path.replace(this.createFlag ? '/create' : '/edit', '')
        )
      },
      validate (field) {
        return get(options.validations, field) || ''
      }
    },
    computed: {
      reading () {
        return !this.editFlag && !this.createFlag
      },
      details () {
        return this.item.id || this.createFlag
      }
    },
    apollo: {
      ...(options.unique
        ? {}
        : {
          list: smartQueryHelper({ table })
        }),
      item: {
        // TODO: code the subscription as well => make it generic in the hasura plugin?
        query: queryHelper({
          table,
          fragment: options.fragment
        }),
        variables () {
          return {
            where: { id: { _eq: this.id } }
          }
        },
        skip () {
          return !this.id
        },
        update: data => data[Object.keys(data)[0]][0]
      }
    },
    created () {
      this.reset()
    },
    watch: {
      // TODO: calling reset at so many occasion is too broad and not optimal
      // call again the method if the route changes
      $route: 'reset',
      item: 'reset',
      id: 'reset'
    }
  }
}
export default ({ app, router, Vue }) => {
  const config = {
    aria: true,
    classNames: {},
    classes: false,
    delay: 0,
    dictionary: null,
    errorBagName: 'errors', // change if property conflicts
    events: 'input|blur',
    fieldsBagName: 'fields',
    i18n: null, // the vue-i18n plugin instance
    i18nRootKey: 'validations', // the nested key under which the validation messages will be located
    inject: true,
    locale: 'en',
    validity: false
  }
  Vue.use(VeeValidate, config)
  Vue.component('button-bar', ButtonBar)
}
