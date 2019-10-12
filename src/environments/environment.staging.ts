/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

// import env from './.env';

export const environment = {
    production: true,
    // baseUrl: 'http://52.34.118.246:9914', // client test(staging) server url
    baseUrl: 'https://kapistage.larvolomni.com',
    env: 'staging',
    appPrefix: '/home',
    firebase: {
        apiKey: 'AIzaSyCTpudjN7ZVjiGWEuKFG1WV2uGAUCV8IeE',
        authDomain: 'larvol-40ea0.firebaseapp.com',
        databaseURL: 'https://larvol-40ea0.firebaseio.com',
        projectId: 'larvol-40ea0',
        storageBucket: 'larvol-40ea0.appspot.com',
        messagingSenderId: '1092535064943'
    },
    appName: 'Larvolomni.com',
    showLog: false // set ture if console log need to hide
};

/**
 * Declare API endpoints here and used on whenever user want
 */
export const apiInfo = {
    endpoint: '',
    version: 'v1/',
    info: {
        'login': '/login',
        'lappKols': '/kols/all',
        'kappKols': '/kols',
        'forgotPassword': '/password/reset',
        'resetPassword': '/password/set',
        'getNews': '/news',
        'kols': '/kols',
        'favourite': '/favourite/web',
        'unfavourite': '/favourite',
        'profile': '/profile',
        'getTrails': '/trials',
        'likes': '/likes',
        'comments': '/comments',
        'request': '/request',
        'notes': '/notes',
        'kol': '/kol',
        'share': '/shares',
        'notification': '/notifications',
        'feedback': '/feedback',
        'counterRequest': '/upgrade/request',
        'getInstitute': '/institutions',
        'getState': '/state',
        'getCountry': '/country',
        'createics': '/ics',
        'getArea': '/areas',
        'bookmark': '/bookmark',
        'bookmarklist': '/bookmarklist',
        'signup': '/register',
        'logout': '/logout',
        'institution': '/institution',
        'frequent': '/frequent',
        'get': '/get',
        'search': '/search',
        'save': '/save',
        'recent': '/recent',
        'delete': '/delete',
        'unbookmark': '/unbookmark',
        'getUsers': '/users',
        'read': '/read',
        'list': '/list',
        'saveToken': '/push/register',
        'removeToken': '/push/unregister',
        'getSubscriptions': '/subscriptions/get',
        'teams': '/teams',
        'getTeamsSubscriptions': '/teams/subscriptions/data',
        'subscription': '/teams/subscriptions',
        'groups': '/groups',
        'addGroup': '/group/add',
        'deleteGroup': '/group',
        'getGroupTeam': '/groupTeam/list',
        'getAllGroupTeam': '/groupTeam',
        'add': '/kol/add',
        'terms': '/terms',
        'getConference': '/conference',
        'analytics': '/analytics',
        'updatereadstatus': '/updatereadstatus',
        'drug': {
            'products': '/products',
            'favourite': '/favourite',
            'unfavourite': '/unfavourite',
            'getTeamsSubscriptions': '/teams/drug/subscriptions/data',
            'product': '/product',
        }
    },
    MODE_PULSE: 'pulse', // Registered  free user (LAPP Users/created from app)
    MODE_LTL : 'ltl' // Registered paid user (KAPP Users/created from admin)
};
