// import {en } from '@formkit/i18n'
import { generateClasses } from '@formkit/themes'
// import { genesisIcons } from '@formkit/icons'
import myTailwindTheme from './tailwind-theme.js'

// const config = {
//   locales: { en },
//   locale: 'en',
// }

export default {
    config: {
        classes: generateClasses(myTailwindTheme),
        // locale: 'en',
        // locales: { en },
    },
    // icons: {
    //     ...genesisIcons
    // },
}