import VeeValidate from 'vee-validate'
import {
  save,
  smartQueryHelper,
  queryHelper,
  deleteMutation
} from 'plugins/hasura'
import { settings as globalSettings } from 'plugins/platyplus'
import cloneDeep from 'lodash/cloneDeep'
import ButtonBar from 'components/ButtonBar.vue'

export const mixin = (table, settings = {}) => {
  settings = {
    ...{
      fragment: 'base',
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
        form: cloneDeep(settings.defaultValues),
        relations: settings.relations
          ? Object.keys(settings.relations).reduce((aggr, curr) => {
            aggr[curr] = settings.relations[curr].default || []
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
        if (save) this._postSave(save)
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
        this._resetItem()
        this._resetForm()
      },
      _resetItem () {
        if (!this.id && !this.createFlag) {
          this.item = cloneDeep(settings.defaultValues)
        }
      },
      _resetForm () {
        this.form = cloneDeep(this.item)
        // Flatten the M2M relation fields with the corresponding IDs
        settings.relations &&
          Object.keys(settings.relations).map(relation => {
            if (this.item[relation]) {
              this.relations[relation] = this.item[relation].map(
                item => item[settings.relations[relation].to].id
              )
            } else {
              this.relations[relation] =
                settings.relations[relation].default || []
            }
          })
        // Focus on the input referenced as 'firstInput' in the template
        if (!this.reading) {
          this.$nextTick(() => this.$refs.firstInput?.focus())
        }
      },
      async remove () {
        // TODO: i18n
        try {
          await this.$q.dialog({
            title: 'Warning',
            message: 'Do you want to delete this record?',
            color: 'warning',
            ok: true, // takes i18n value, or String for "OK" button label
            cancel: true // takes i18n value, or String for "Cancel" button label
          })
          await deleteMutation({
            apollo: this.$apollo,
            table,
            data: this.id
          })
          await this.$q.dialog({
            title: 'Attention',
            message: 'Record deleted',
            color: 'primary',
            ok: true
          })
          this.$router.go(-1)
        } catch (error) {}
      },
      async _preSave () {
        // this.submitted = true TODO: loading button
        if (await this.$validator.validateAll()) {
          return save(
            {
              apollo: this.$apollo,
              table,
              oldValues: this.item,
              newValues: this.form,
              relations: this.relations
            },
            settings
          )
        } else return false
      },
      _postSave (save) {
        this.$router.replace(
          this.createFlag
            ? this.$route.path.replace('create', save?.id || '')
            : this.$route.path.replace('/edit', '')
        )
      },
      validate (field) {
        return settings.validations?.[field]
      },
      options (field) {
        const optionSettings = settings.options?.[field]
        if (optionSettings) {
          if (optionSettings.table && this[`${field}_options`]) {
            const map = optionSettings.map || (p => p)
            const filter = optionSettings.filter || ((p, q) => true)
            return this[`${field}_options`]
              .filter(item =>
                filter(
                  item,
                  { item: this.form, relations: this.relations },
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
        return Boolean(this.item.id) || this.createFlag
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
      $route: 'reset',
      item: '_resetForm',
      id: '_resetItem',
      ...(settings.options
        ? Object.keys(settings.options).reduce((aggr, curr) => {
          // Watches for id changes in the optionned fields
          // If it changes, then it replaces the related object by the one found in the option list
          aggr[`form.${curr}_id`] = {
            handler (newValue) {
              if (newValue && this[`${curr}_options`]) {
                this.form[curr] = Object.assign(
                  {},
                  this.form[curr],
                  this[`${curr}_options`].find(el => el.id === newValue)
                )
              } else this.form[curr] = {}
            }
          }
          return aggr
        }, {})
        : {})
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
    i18n: null, // TODO: the vue-i18n plugin instance
    i18nRootKey: 'validations', // the nested key under which the validation messages will be located
    inject: true,
    locale: 'en-uk',
    validity: false
  }
  Vue.use(VeeValidate, config)
  Vue.component('button-bar', ButtonBar)
}
