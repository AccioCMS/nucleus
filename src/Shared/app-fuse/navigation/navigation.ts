import { FuseNavigation } from '../../@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'sample',
                title    : 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/test/fuse',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            },
            {
                id       : 'users',
                title    : 'Users',
                translate: 'NAV.USERS.TITLE',
                type     : 'item',
                icon     : 'account_box',
                url      : '/test/users'
            }
        ]
    },
    {
        id       : 'post-types',
        title    : 'Post Types',
        translate: 'NAV.POST_TYPES',
        type     : 'group',
        children : [
            {
                id       : 'articles',
                title    : 'Articles',
                translate: 'NAV.ARTICLES.TITLE',
                type     : 'item',
                icon     : 'label',
                url      : '/articles'
            }
        ]
    },
    {
        id       : 'plugins',
        title    : 'Plugins',
        translate: 'NAV.PLUGINS',
        type     : 'group',
        icon     : 'library_add',
        children : [
            {
                id   : 'plugin-1',
                title: 'Plugin 1',
                type : 'item',
                url  : '/plugins/first',
                icon : 'library_add',
            },
            {
                id   : 'plugin-2',
                title: 'Plugin 2',
                type : 'item',
                url  : '/plugins/second',
                icon : 'library_add',
            }
        ]
    },
];
