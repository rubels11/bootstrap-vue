import hljs from '~/utils/hljs'
import MainDocs from '~/components/main-docs'
import docsMixin from '~/plugins/docs-mixin'
import { reference as referenceMeta, defaultConfig } from '~/content'

const getReadMeData = name => {
  try {
    return import(`~/../src/reference/${name}/README.md` /* webpackChunkName: "docs/reference" */)
  } catch {
    // If the dynamic import fails to load, trap the error
    return {
      loadError: true,
      titleLead: '<h1>Documentation has updated!</h1><p class="lead">Please reload the page</p>',
      body: '',
      baseTOC: null
    }
  }
}
const replacer = (key, value) => (typeof value === 'undefined' ? null : value)

// @vue/component
export default {
  name: 'BDVReference',
  layout: 'docs',
  mixins: [docsMixin],
  validate({ params }) {
    return Boolean(referenceMeta[params.slug])
  },
  async asyncData({ params }) {
    const readmeData = (await getReadMeData(params.slug)).default
    const loadError = readmeData.loadError || false
    const titleLead = readmeData.titleLead || ''
    let body = readmeData.body || ''
    const baseTOC = readmeData.baseTOC || {}
    const meta = referenceMeta[params.slug]
    body = body.replace(
      '{{ defaultConfig }}',
      hljs.highlight('json', JSON.stringify(defaultConfig || {}, replacer, 2)).value
    )
    return { meta, titleLead, body, baseTOC, loadError }
  },
  render(h) {
    return h(MainDocs, {
      staticClass: 'bd-components',
      props: {
        meta: this.meta,
        titleLead: this.titleLead,
        body: this.body,
        loadError: this.loadError
      }
    })
  }
}
