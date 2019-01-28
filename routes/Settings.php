<?php

/**
 * Project Settings Routes
 */
Route::group(
    ['as' => 'backend.settings.', 'namespace' => '\App\Http\Controllers\Backend', 'prefix' => Config::get('project')['adminPrefix']], function () {

        Route::get('/{lang}/settings/{view}', 'SettingsController@index')->name('index');
        Route::group(['middleware' => ['auth:api']], function (){
            /**
             * GET
             */
            Route::get('/{lang}/settings/{view}/{id}', 'SettingsController@single')->name('single');
            Route::get('/{lang}/json/settings/get-settings', 'SettingsController@getSettings')->name('single');
            Route::get('/{lang}/json/settings/get-permalinks', 'SettingsController@getPermalinks')->name('getPermalinks');
            Route::get('/{lang}/json/settings/get-theme-configs', 'SettingsController@getThemeConfigs')->name('getThemeConfigs');

            /**
             * POST
             */
            Route::post('/json/settings/store', 'SettingsController@store')->name('store');
            Route::post('/json/settings/store-permalinks', 'SettingsController@storePermalinks')->name('storePermalinks');
        });
    }
);
