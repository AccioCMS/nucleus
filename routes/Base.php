<?php
/**
 * Base Admin routes
 */
Route::group(
    ['as' => 'backend.base.', 'namespace' => '\App\Http\Controllers\Backend', 'prefix' => Config::get('project')['adminPrefix']], function () {

        Route::get('/get-base-data/{lang}', 'GeneralController@getBaseData')->name('getBaseData');

        Route::group(['middleware' => ['auth:api']], function(){
            /**
             * GET
             */
            Route::get('/update-language/{lang}', 'GeneralController@updateLanguageData')->name('updateLanguageData');
            Route::get('', 'GeneralController@index')->name('index');
            Route::get('/{lang}', 'GeneralController@index')->name('index.lang');
            Route::get('/logout-request', 'GeneralController@logoutUser')->name('logoutUser');
            Route::get('/logout-request', 'GeneralController@logoutUser')->name('logoutUser');
        });

    }
);
