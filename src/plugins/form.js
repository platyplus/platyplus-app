import VeeValidate from 'vee-validate'
import {
  save,
  smartQueryHelper,
  queryHelper,
  deleteMutation
} from 'plugins/hasura'
import { settings as globalSettings } from 'plugins/platyplus'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import ButtonBar from 'components/ButtonBar.vue'

export const mixin = (table, settings = {}) => {
  settings = {
    ...{
      fragment: 'base',
      formField: 'form',
      unique: false,
      validations: {},
      defaultValues: {}
    },
    ...globalSettings[table],
    ...settings
  }
  return {
    props: ['id', 'createFlag', 'editFlag'],
    data () {
      return {
        [settings.formField]: cloneDeep(settings.defaultValues),
        relations: settings.relations
          ? Object.keys(settings.relations).reduce((aggr, curr) => {
            aggr[curr] = []
            return aggr
          }, {})
          : {},
        list: [],
        item: cloneDeep(settings.defaultValues)
      }
    },
    methods: {
      create () {
        this.$router.push(this.$route.path + '/create')
      },
      async save (e) {
        // Customize the save method in the component if needed
        const save = await this._preSave()
        if (save) this._postSave()
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
        this._reset()
      },
      _reset (e) {
        this._resetId()
        this._resetItem()
      },
      _resetId () {
        if (!this.id) this.item = { ...this.item, ...settings.defaultValues }
      },
      _resetItem () {
        this[settings.formField] = cloneDeep(this.item)
        // Flatten the M2M relation fields with the corresponding IDs
        settings.relations &&
          Object.keys(settings.relations).map(relation => {
            if (this.item[relation]) {
              this.relations[relation] = this.item[relation].map(
                item => item[settings.relations[relation].to].id
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
      async _preSave () {
        const validateAll = await this.$validator.validateAll()
        // this.submitted = true TODO: loading button
        if (validateAll) {
          return save(
            {
              apollo: this.$apollo,
              table,
              oldValues: this.item,
              newValues: this[settings.formField],
              relations: this.relations
            },
            settings
          )
        } else return false
      },
      _postSave () {
        this.$router.replace(
          this.$route.path.replace(this.createFlag ? '/create' : '/edit', '')
        )
      },
      validate (field) {
        return get(settings.validations, field) || ''
      },
      options (field) {
        const optionSettings = get(settings.options, field)
        if (optionSettings) {
          if (optionSettings.table && this[`${field}_options`]) {
            const map = optionSettings.map || (p => p)
            const filter = optionSettings.filter || ((p, q) => true)
            return this[`${field}_options`]
              .filter(item =>
                filter(
                  item,
                  { item: this[settings.formField], relations: this.relations },
                  optionSettings
                )
              )
              .map(item => map(item))
          } else if (Array.isArray(optionSettings)) return optionSettings
        }
        return []
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
      ...(settings.unique
        ? {}
        : {
          list: smartQueryHelper({ table, where: settings.where })
        }),
      item: {
        // TODO: code the subscription as well => make it generic in the hasura plugin?
        query: queryHelper({
          table,
          fragment: settings.fragment
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
      },
      ...(settings.options
        ? Object.keys(settings.options)
          .filter(name => settings.options[name].table)
          .reduce((aggr, name) => {
            aggr[`${name}_options`] = smartQueryHelper({
              table: settings.options[name].table,
              where: settings.options[name].where || {}
            })
            return aggr
          }, {})
        : {})
    },
    created () {
      this.reset()
    },
    watch: {
      // TODO: calling reset at so many occasion is too broad and not optimal
      // call again the method if the route changes
      $route: 'reset',
      item: '_resetItem',
      id: '_resetId'
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
