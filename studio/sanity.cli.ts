import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'x7xjqilb',
    dataset: 'production'
  },
  // The editing screen lives at https://shoyaib.sanity.studio
  studioHost: 'shoyaib',
  deployment: {
    appId: 'h5w939xxs6o1j0z2v3gxpn40',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
