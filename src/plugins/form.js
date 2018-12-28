import {
  upsertMutation,
  smartQueryHelper,
  queryHelper,
  deleteMutation
} from 'plugins/hasura'
import ButtonBar from 'components/ButtonBar.vue'
import { insertMutation } from './hasura'

export const mixin = ({
  table,
  fragment = 'base',
  formField = 'form',
  relations = {}, // TODO: dans platyplus.settings
  initialValues = {}, // TODO: dans platyplus.settings
  unique = false,
  beforeSave = p => p // TODO: dans platyplus.settings
}) => {
  return {
    props: ['id', 'createFlag', 'editFlag'],
    data () {
      return {
        [formField]: {},
        relations: Object.keys(relations).reduce((aggr, curr) => {
          aggr[curr] = []
          return aggr
        }, {}),
        list: [],
        item: initialValues
      }
    },
    methods: {
      create () {
        this.$router.push(this.$route.path + '/create')
      },
      save (e) {
        // Customize the save method in the component if needed
        this._mixinPreSave().then(item => {
          this._mixinPostSave()
        })
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
          this.item = initialValues
        }
        // Copy the initial data to the form data
        this[formField] = { ...this.item }
        // Flatten the M2M relation fields with the corresponding IDs
        relations &&
          Object.keys(relations).map(relation => {
            if (this.item[relation]) {
              this.relations[relation] = this.item[relation].map(
                item => item[relations[relation].to].id
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
      async _mixinPreSave () {
        // TODO: move above to plugins/hasura
        // this.submitted = true TODO: loading button
        this[formField] = beforeSave({
          form: this[formField],
          initial: this.item,
          relations: this.relations
        }).form
        if (this.item.id) {
          for await (const name of Object.keys(relations)) {
            let relation = relations[name]
            let data = this.relations[name]
            let initialData = this.item[name].map(item => item[relation.to].id)
            const newData = data
              .filter(item => !initialData.includes(item))
              .map(item => ({
                [`${table}_id`]: this.item.id,
                [`${relation.to}_id`]: item
              }))
            if (newData.length > 0) {
              await insertMutation({
                apollo: this.$apollo,
                table: relation.table,
                fragment: 'minimal',
                data: newData
              })
            }
            const deletedData = initialData.filter(item => !data.includes(item))
            if (deletedData.length > 0) {
              await deleteMutation({
                apollo: this.$apollo,
                table: relation.table,
                key: relation.to,
                data: deletedData
              })
            }
          }
          return upsertMutation({
            apollo: this.$apollo,
            table,
            data: this[formField]
          })
        } else {
          console.warn('TODO: add relations')
          console.warn('TODO: return query')
          return upsertMutation({
            apollo: this.$apollo,
            table,
            data: this[formField]
          })
        }
      },
      _mixinPostSave () {
        this.$router.replace(
          this.$route.path.replace(this.createFlag ? '/create' : '/edit', '')
        )
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
      ...(unique
        ? {}
        : {
          list: smartQueryHelper({ table })
        }),
      item: {
        // TODO: code the subscription as well => make it generic in the hasura plugin?
        query: queryHelper({
          table,
          fragment
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
  Vue.component('button-bar', ButtonBar)
}
