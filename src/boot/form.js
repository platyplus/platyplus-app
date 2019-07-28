/**
 * Main mixin to handle Hasura GraphQL endpoints
 */
import VeeValidate from 'vee-validate'
import { save, deleteMutation } from 'boot/hasura'
import { queryToSubscription } from 'boot/apollo'
import * as config from 'boot/platyplus'
import cloneDeep from 'lodash/cloneDeep'
import ButtonBar from 'components/ButtonBar.vue'

export const mixin = (table, settings = {}) => {
  settings = Object.assign(
    {
      // TODO distinction between item queris and list queries
      query: 'form', // Graphql query index
      insert: 'insert', // Grqphql insert mutation index
      update: 'update', // Graphql update mutation index
      /** Set to false if the component doesn't manage a list.
       * If the 'list' query doesn't exist, uses the 'query form' query
       */
      list: 'list',
      validations: {},
      defaultValues: {},
      options: {},
      relations: {}
    },
    config.settings[table],
    settings
  )
  if (!config.queries[table][settings.query]) {
    throw Error(
      `The '${
        settings.query
      }' query has to be implemented for the table '${table}'`
    )
  }
  return {
    props: ['id', 'createFlag', 'editFlag'],
    data () {
      return {
        item: cloneDeep(settings.defaultValues),
        form: cloneDeep(settings.defaultValues),
        relations: Object.keys(settings.relations).reduce((aggr, curr) => {
          aggr[curr] = []
          return aggr
        }, {}),
        list: [],
        deletionConfirmed: false
      }
    },
    methods: {
      /**
       * The following methods may exist with their _ counterparts.
       * They can be overriden in the components whereas the _ function should not.
       */
      create () {
        this.$router.push(this.$route.path + '/create')
      },
      async save (e) {
        const save = await this._save()
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
      async remove () {
        try {
          await deleteMutation({
            apollo: this.$apollo,
            table,
            data: this.id
          })
          this.deletionConfirmed = true
          this.$router.go(-1)
        } catch (error) {
          console.log(error)
        }
      },
      reset (e) {
        this._reset()
      },
      resetForm () {
        this._resetForm()
      },
      _reset (e) {
        this._resetItem()
        this.resetForm()
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
      },
      async _save ({
        oldValues = this.item,
        newValues = this.form,
        relations = this.relations
      } = {}) {
        // this.submitted = true TODO: loading button
        if (await this.$validator.validateAll()) {
          return save(
            {
              apollo: this.$apollo,
              table,
              insert: settings.insert,
              update: settings.update,
              oldValues: oldValues || this.item,
              newValues: newValues || this.form,
              relations: relations || this.relations
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
      /**
       * Calculates the options that can be picked for the given field
       * @param {*} field the field of the form with options
       */
      options (field) {
        const optionSettings = settings.options?.[field]
        let options = []
        if (optionSettings) {
          if (optionSettings.table && this[`${field}_options`]) {
            const filter = optionSettings.filter || ((p, q) => true)
            options = this[`${field}_options`].filter(item =>
              filter(
                item,
                { item: this.form, relations: this.relations },
                optionSettings
              )
            )
          } else if (Array.isArray(optionSettings)) options = optionSettings
        }
        // Unsets the form value if it is not part of the options set
        if (
          this.form[`${field}_id`] &&
          !options.some(option => this.form[`${field}_id`] === option.id) &&
          !settings.relations[field] // TODO make it work for array values as well
        ) {
          this.form[`${field}_id`] = null
        }
        // Sets a default value to unique (not multiple) selection fields when there is only one available option
        // TODO apply this mechanism only when the field is required
        if (
          !this.form[`${field}_id`] &&
          !settings.relations[field] &&
          options.length === 1
        ) {
          this.form[`${field}_id`] = options[0].id
        }
        return options
      }
    },
    computed: {
      reading () {
        return !this.editFlag && !this.createFlag
      },
      details () {
        return Boolean(this.id) || this.createFlag
      }
    },
    apollo: {
      ...(settings.list && {
        list: {
          query:
            config.queries[table][settings.list] ||
            config.queries[table][settings.query],
          variables () {
            return this.listVariables || { where: settings.where }
          },
          skip () {
            return (
              !settings.list ||
              this.details ||
              (this.listSkip instanceof Object && this.listSkip)
            )
          },
          update: data => data[table],
          subscribeToMore: {
            document: queryToSubscription(
              config.queries[table][settings.query]
            ),
            variables () {
              return this.listVariables || { where: settings.where }
            },
            // Mutate the previous result
            updateQuery: (previousResult, { subscriptionData: { data } }) => {
              return data
            }
          }
        }
      }),
      item: {
        // TODO: code the subscription as well => make it generic in the hasura plugin?
        query: config.queries[table][settings.query],
        variables () {
          return {
            where: { id: { _eq: this.id } }
          }
        },
        skip () {
          return !this.id
        },
        update: data => data[table][0]
      },
      ...Object.keys(settings.options)
        .filter(name => settings.options[name].table)
        .reduce((aggr, name) => {
          const query = config.queries[settings.options[name].table]['option']
          if (!query) {
            throw Error(
              `The 'option' query has to be implemented for the table '${
                settings.options[name].table
              }'`
            )
          }
          aggr[`${name}_options`] = {
            query: query,
            update: data => data[Object.keys(data)[0]],
            variables: {
              where: settings.options[name].where || {}
            },
            subscribeToMore: {
              document: queryToSubscription(query),
              variables: {
                where: settings.options[name].where || {}
              },
              // Mutate the previous result
              updateQuery: (previousResult, { subscriptionData: { data } }) => {
                return data
              }
            }
          }
          return aggr
        }, {})
    },
    created () {
      this.reset()
    },
    watch: {
      $route: 'reset',
      item: 'resetForm',
      id: '_resetItem',
      ...Object.keys(settings.options).reduce((aggr, curr) => {
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
    },
    $_veeValidate: {
      // TODO https://github.com/baianat/vee-validate/issues/1980
      validator: 'new'
    }
  }
}

const veeValidateConfig = {
  aria: true,
  classNames: {},
  classes: false,
  delay: 0,
  dictionary: null,
  errorBagName: 'vErrors', // change if property conflicts
  events: 'input|blur',
  fieldsBagName: 'fields',
  i18n: null, // TODO: the vue-i18n plugin instance
  i18nRootKey: 'validations', // the nested key under which the validation messages will be located
  inject: false, // TODO https://github.com/baianat/vee-validate/issues/1980
  locale: 'en-uk',
  validity: false
}

export default ({ app, router, Vue }) => {
  Vue.use(VeeValidate, veeValidateConfig)
  Vue.component('p-button-bar', ButtonBar)
}
