<?php

return [

    /*
    |
    | Copy uploads on deploy
    |
    */
    'uploads' => [
        'from' => base_path('public/uploads/*'),
        'to' => base_path().'/../../shared/public/uploads',
    ],


    /*
    |
    |--------------------------------------------------------------------------
    | Symlink
    |--------------------------------------------------------------------------
    | Symlinks that should be created after deploy
    |
    */
    'symlinks' => [

    ],

    /*
    |
    |--------------------------------------------------------------------------
    | Cron Jobs
    |--------------------------------------------------------------------------
    | Cron jobs that should be created after a deploy is released
    |
    */
    'cron' => [
        '* * * * * php '.base_path().'/artisan schedule:run >> /dev/null 2>&1'
    ],

    /*
    |
    |--------------------------------------------------------------------------
    | Custom Commands
    |--------------------------------------------------------------------------
    | List of commands that should be run on deploy
    |
    */
    'commands' => [
        /*
        |
        |--------------------------------------------------------------------------
        | Activate New Release
        |--------------------------------------------------------------------------
        | Commands that should be when a release is activated
        |
        */
        'activate_new_release' => [
            'before' => [
                'php artisan deploy:env',
                'php artisan deploy:db',
                'php artisan deploy:cron',
            ],
            'after' => [
                'php artisan cache:clear',
                'php artisan config:clear',
                'php artisan view:clear',
                'php artisan route:cache',
            ]
        ],

        /*
        |
        |--------------------------------------------------------------------------
        | Purge Old Releases
        |--------------------------------------------------------------------------
        | Commands that should be run when old release is purged
        |
        */
        'purge_old_releases' => [
            'before' => [],
            'after' => []
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Deploy database
    |--------------------------------------------------------------------------
    |
    | Here you specify where we should look for sql files to be imported on deploy
    |
    */

    'database' => [
        'enabled' => true,
        'path' => database_path('deployments')
    ],
];
